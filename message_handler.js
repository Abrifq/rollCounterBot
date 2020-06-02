const rollMachine = require("./roll"),
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
function afterRollMessageConstructor({ target, rollCount, userID }) {
    return `<@${userID}>, ${target} sayısı ${rollCount > 100 ? "anca " : ""}${rollCount} denemede geldi.`;
}
function beforeRollMessageConstructor({ userID, target }) {
    return `<@${userID}>, bana şans dile, ${target} sayısı için ${target} yüzlü zarımı atmaya başladım.${target > 1000 ? " Büyük sayı yani." : ""}`;

}

function messageHandler(message) {
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
    
    const userID = message.member.id;
    const beforeRollMessage = beforeRollMessageConstructor({ userID, target: argument });
    const sentMessage = message.channel.send(beforeRollMessage),
        rollCount = rollMachine(Number(argument));
        const afterRollMessage  = rollCount.then(rollCount=>afterRollMessageConstructor({target:argument,rollCount,userID}));
        sentMessage.then(sentMessage=>sentMessage.edit(afterRollMessage));
        return;        
}
module.exports = exports = messageHandler;