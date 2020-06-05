const waitInQueue = require("../queuer"), FoPConstructor = require("../forkedOutPromise");
const exampleUserID = "example";

/**
 * @returns {Promise<void>}
 * @param {number} delay - The minimum delay to resolve in milliseconds.
 * @async
 */

async function wait(delay) {
    const promiseFork = new FoPConstructor();
    setTimeout(promiseFork.resolve, delay);
    return promiseFork.promise;
}

/**
 * @returns {Promise<void>}
 * @param {*} printValue - The value to print via `console.log`.
 * @async
 */

async function simpleLoggerWithQueue(printValue) {
    const jobFinisher = await waitInQueue(exampleUserID);
    await wait(100);
    console.log(printValue);
    jobFinisher();
    return;
}

/**
 * @returns {Promise<void>}
 * @param {number} tries Decides how many times the test will add promises.
 * @async
 */

async function queueTester(tries = 100) {
    const testStarter = await waitInQueue();
    for (let i = 0; i < tries;) { simpleLoggerWithQueue(++i); }
    await wait(1000 * 10); //10 seconds to be exact.
    testStarter();
    return;
}

exports= module.exports= queueTester;

