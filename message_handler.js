const rollHandler = require("./roll_handler"),
    maxAllowedDiceSides = require("./config_handler")().maxDiceSide,
    argumentParser = require("./argumentParser"),
    prefix = "kaçTane",
    validMessage = "valid",
    invalidUsageMessage = "argumentInvalid",
    innerError = "matrixInvalid",
    ignoreMessage = "mindYourBusiness",
    isDice = string => string.startsWith("d") && string.slice(1) && Number(string.slice(1)) > 0;

/**@arg {string} messageContent - The content of the incoming message
 * @returns {string} - Returns a string to decide what to do next. 
 */
function validCommandChecker(messageContent) {
    if (typeof messageContent !== "string") { return innerError }
    if (!messageContent.startsWith(prefix)) { return ignoreMessage }

    const argumentList = messageContent.split(" ").filter(string => string !== "").slice(1);
    const firstArgument = argumentList[0];
    if (firstArgument === "github" || firstArgument === "g") { return validMessage } // print github info
    if (argumentList.filter(string => Number(string) > 0 || isDice(string)).length) { return validMessage } // roll dice
    return invalidUsageMessage;
}

/**
 * @returns {Promise<void> | Promise<FakeMessage>}
 * @param {FakeMessage} message
 * @async
 */
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
        return message.channel.send(
            `Koçum öyle yazmıyoruz, gel sana göstereyim.
\`${prefix} <sayı>\` yaparsan <sayı> yüzlü zarda <sayı> atmaya çalışırım,
\`${prefix} <sayı> d<yüzSayısı>\` veya \`${prefix} d<yüzSayısı> <sayı>\` yaparsan da <yüzSayısı> yüzlü zarda <sayı> atmaya çalışırım.
Bunları yapmadan önce, üç koşulum var:
1) <sayı> en az 1 en fazla ${maxAllowedDiceSides} olabilir.
2) <yüzSayısı> en az <sayı> en fazla ${maxAllowedDiceSides} olabilir. Bir d6 ile 8 atmamı bekleme lütfen.
3) Senin için zaten zar sallıyorsam, o sayıyı tutturana kadar senin için başka zar **atmam**.

Github sayfama bakmak istersen sadece \`${prefix} github\` yazman yeterli!`
        );

    }
    if (messageResponseType !== validMessage) {
        console.info("An error occurred in the validity checking function.");
        console.group("Error info:");
        console.info("returned message:");
        console.error(messageResponseType);
        console.groupEnd();
    }

    const rawArguments = message.content.split(" ").filter(string => string !== "").slice(1);
    if (rawArguments.length === 1 && rawArguments[0] === "g" || rawArguments[0] === "github") {
        message.channel.send("Github'da beni ziyaret edin! https://github.com/fbarda/rollCounterBot");
        return;
    }

    //Going to roll the dice now.
    let rollArguments;
    try {
        rollArguments = await argumentParser(rawArguments,message.member.id);
    } catch (errorMessage) {
        console.log("uh oh");
        return message.channel.send(errorMessage);
    }
    return rollHandler({ arguments: rollArguments, message });
}
module.exports = exports = messageHandler;

/**@typedef FakeMessage - Simplified version of "Discord.js"s Message class.
 * @prop {FakeMessageContent} content - Message's content
 * @prop {Object} member - Message's owner
 * @prop {string} member.id - Message's owner's id as a snowflake
 * @prop {(content:FakeMessageContent)=>Promise<FakeMessage>} edit - Changes message's content with the given content. Resolves to new message if successful, however, the original message object can still be used and the resolved message will point to same message if not the same object.
 * @prop {Object} channel - The channel the message has been sent through.
 * @prop {(content:FakeMessageContent)=>Promise<FakeMessage>} channel.send - Sends a new message with the given content. Resolves to new message if successful.
 */
/**@typedef {string} FakeMessageContent - We are only using the UTF-8 string part, too lazy to define the other (file sending) part. */