const rollMachine = require("./roll"),
    { inQueueMessageConstructor, beforeRollMessageConstructor, afterRollMessageConstructor } = require("./message_generators"),
    promiseTimerContainer = require("./promise_timer"),
    queueHandler = require("./queuer"),
    tee = logValue => { console.log(logValue); return logValue; },
    messageTee = message => { console.log("Sent Message: " + message.content); return message };

/**
 * @returns {Promise<void>}
 * @param {Object} parameters
 * @param {Object} parameters.arguments
 * @param {number} parameters.arguments.target
 * @param {number} parameters.arguments.diceSides
 * @param {import("./message_handler").FakeMessage} parameters.message 
 */

async function rollHandler({ arguments: { target, diceSides }, message, }) {
    console.log("Valid usage. Rolling for " + target);
    const userID = message.member.id;
    const beforeRollMessage = beforeRollMessageConstructor({ userID, arguments: { target, diceSides } });
    const waitingMessage = inQueueMessageConstructor({ userID });
    const sentMessage = await message.channel.send(waitingMessage); //queue information to users.
    const jobFinisher = await queueHandler(userID);
    await sentMessage.edit(beforeRollMessage)
        .then(messageTee);
    const putElapsedTime = (async function* timerCallbackGenerator() {
        let calledTimes = 0; //called every 6 seconds.
        while (true) {
            sentMessage.edit(beforeRollMessage + ` Ben başlayalı ${calledTimes / 10} dakika geçti.`);
            calledTimes++;
            yield;
        }
    })();
    const rollCount = promiseTimerContainer(rollMachine(arguments).then(tee), () => { return putElapsedTime.next(); }, 1000 * 6);
    const afterRollMessage = await rollCount.then(rollCount => afterRollMessageConstructor({ target, rollCount, userID }))
        .then(tee);
    await sentMessage.edit(afterRollMessage)
        .then(messageTee);
    await putElapsedTime.return();
    return jobFinisher();
}
exports = module.exports = rollHandler;
