const rollMachine = require("./roll"),
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
    return `<@${userID}>, ${target} sayısı ${rollCount > 100 ? "anca " : ""}${rollCount} denemede geldi.`;
}
/**
 * @returns {string}
 * @param {{target:number|string,userID:string}} infos 
 */
function beforeRollMessageConstructor({ userID, target }) {
    return `<@${userID}>, bana şans dile, ${target} sayısı için ${target} yüzlü zarımı atmaya başladım.${target > 1000 ? " Büyük sayı yani." : ""}`;

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

    //Going to roll the dice now.
    console.log("Valid usage. Argument is " + argument);
    const userID = message.member.id;
    const beforeRollMessage = beforeRollMessageConstructor({ userID, target: argument });
    const sentMessage = await message.channel.send(beforeRollMessage)
        .then(message => { console.log(message.content); return message }),
        rollCount = rollMachine(Number(argument)).then(tee);
    const afterRollMessage = await rollCount.then(rollCount => afterRollMessageConstructor({ target: argument, rollCount, userID })).then(tee);
    sentMessage.edit(afterRollMessage)
        .then(message => { console.log(message.content); return message });
    return;
}
module.exports = exports = messageHandler;