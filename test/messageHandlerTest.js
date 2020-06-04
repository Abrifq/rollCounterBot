const messageHandler = require("../message_handler"), fakeMessageConstructor = require("./fakeMessageConstructor");

/**@returns {string} */
function randomSnowflakeGenerator() {
    Array(16).fill(0).map(() => Math.floor(Math.random() * 10)).join("");
}

/**
 * @returns {void}
 * @param {number} tries 
 */
async function randomMessenger(tries) {
    for (let i = 0; i < tries; i++) {
        const userID = randomSnowflakeGenerator();
        const fakeMessage = new fakeMessageConstructor({
            userID,
            content: "kaçTane " + (Math.ceil(Math.random * 100))
        });
        messageHandler(fakeMessage);
    }
}

exports = module.exports = randomMessenger;