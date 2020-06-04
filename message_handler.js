const rollMachine = require("./roll"),
    donators = require("./config_handler")().donators,
    tee = logValue => { console.log(logValue); return logValue; },
    prefix = "kaçTane",
    validMessage = "valid",
    invalidUsageMessage = "argumentInvalid",
    innerError = "matrixInvalid",
    ignoreMessage = "mindYourBusiness";

/**@arg {string} messageContent - The content of the incoming message
 * @returns {string} - Returns a string to decide what to do next. 
 */
function validCommandChecker(messageContent) {
    if (typeof messageContent !== "string") { return innerError }
    if (!messageContent.startsWith(prefix)) { return ignoreMessage }

    const argument = messageContent.split(" ").filter(string => string !== "")[1];
    if (argument === "github" || argument === "g") { return validMessage } // print github info
    if (isNaN(argument)) { return invalidUsageMessage }
    if (Number(argument) > 0) { return validMessage } // roll dice
    return invalidUsageMessage;
}
/**
 * @returns {string}
 * @param {{target:number|string,rollCount:number|string,userID:string}} infos 
 */
function afterRollMessageConstructor({ target, rollCount, userID }) {
    if (donators.includes(userID)) { return `<@${userID}> aşkom sonunda ${target} attım${rollCount > 1000 ? " ama ancak " : ", "}${rollCount < 100 ? "hem de " : ""}${rollCount} denemede attım aşkosu.`; }
    return `<@${userID}>, ${target} sayısı ${rollCount > 100 ? "anca " : ""}${rollCount} denemede geldi.`;
}
/**
 * @returns {string}
 * @param {{target:number|string,userID:string}} infos 
 */
function beforeRollMessageConstructor({ userID, target }) {
    if (donators.includes(userID)) { return `<@${userID}> aşkım bana şans dile, atıyorum ${target} yüzlü zarımı, senin için ${target} atacağım bebeğim!${target > 1000 ? " Ama biraz büyük sayı, beklemen gerekebilir aşkoom. :kiss:" : ""}`; }
    return `<@${userID}>, bana şans dile, ${target} sayısı için ${target} yüzlü zarımı atmaya başladım.${target > 1000 ? " Büyük sayı yani." : ""}`;
}

/**
 * @desc Calls a function every `delay` milliseconds until the promise resolves. The callback will be called at least once.
 * @param {Promise<*>} promise - A promise that will eventually resolve.
 * @param {function()=>void} callback A callback function that will have no arguments.
 * @param {number} delay The delay of calling the callback, in milliseconds.
 */

async function promiseTimerContainer(promise, callback, delay) {
    setImmediate(callback);
    const timerID = setInterval(callback, delay);
    await promise;
    clearInterval(timerID);
    return promise;
}
async function messageHandler(message) {
    const messageResponseType = validCommandChecker(message.content);
    if (messageResponseType === ignoreMessage) { return; }
    if (messageResponseType === innerError) {
        console.info("An error occurred while parsing message.");
        console.group("Error Info:");
        console.info("message content:");
        console.error(message.content);
        console.groupEnd();
        return;
    }
    if (messageResponseType === invalidUsageMessage) {
        message.channel.send(
            `Öyle yazmayacan, \`${prefix} sayi\` yazacaksın, tabii sayi da 1'den büyük olsun, zar koleksiyonumuz geniş ama o kadar da değil.
He, github sayfama bakmak istersen, \`${prefix} github\` yazman yeter de artar canım.`
        );
        return;
    }
    if (messageResponseType !== validMessage) {
        console.info("An error occurred in the validity checking function.");
        console.group("Error info:");
        console.info("returned message:");
        console.error(messageResponseType);
        console.groupEnd();
    }

    const argument = message.content.split(" ").filter(string => string !== "")[1];
    if (argument === "g" || argument === "github") {
        message.channel.send("Github'da beni ziyaret edin! https://github.com/fbarda/rollCounterBot");
        return;
    }
    const target = Number.parseInt(argument);
    //Going to roll the dice now.
    console.log("Valid usage. Rolling for " + target);
    const userID = message.member.id;
    const beforeRollMessage = beforeRollMessageConstructor({ userID, target });

    const sentMessage = await message.channel.send(beforeRollMessage)
        .then(message => { console.log(message.content); return message });
    const putElapsedTime = (async function* timerCallbackGenerator() {
        let calledTimes = 0;
        while (true) {
            sentMessage.edit(beforeRollMessage + ` ${calledTimes} saniye geçti.`);
            calledTimes++;
            yield;
        }
    })();
    const rollCount = promiseTimerContainer(rollMachine(Number(argument)).then(tee), ()=>{return putElapsedTime.next();}, 1000);
    const afterRollMessage = await rollCount.then(rollCount => afterRollMessageConstructor({ target, rollCount, userID }))
        .then(tee);
    await sentMessage.edit(afterRollMessage)
        .then(message => { console.log(message.content); return message });
    await putElapsedTime.return();
    return;
}
module.exports = exports = messageHandler;