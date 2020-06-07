"use strict";
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

async function rollHandler({ arguments: { target, diceSides }, message }) {
    console.log("Valid usage. Rolling for " + target + " with a " + diceSides + " sided dice.");
    const userID = message.member.id;
    const beforeRollMessage = beforeRollMessageConstructor({ userID, arguments: { target, diceSides } });
    const waitingMessage = inQueueMessageConstructor({ userID });
    const sentMessage = await message.channel.send(waitingMessage); //queue information to users.
    const jobFinisher = await queueHandler(userID);
    await sentMessage.edit(beforeRollMessage)
        .then(messageTee);
    const putElapsedTime = (function* timerCallbackGenerator() {
        let calledTimes = 0; //called every 6 seconds.
        while (true) {
            sentMessage.edit(beforeRollMessage + ` Ben başlayalı ${calledTimes / 10} dakika geçti.`);
            calledTimes++;
            yield;
        }
    })();
    const rollCount = await promiseTimerContainer(rollMachine({ target, diceSides }).then(tee),
        () => putElapsedTime.next(),
        6000);
        await putElapsedTime.return();
    const afterRollMessage = afterRollMessageConstructor({ arguments:{target}, rollCount, userID });
    await new Promise(resolve=>setImmediate(resolve)); // wait for next tick
    await sentMessage.edit(afterRollMessage)
        .then(messageTee);
    
    return jobFinisher();
}
exports = module.exports = rollHandler;
