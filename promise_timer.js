/**
 * @desc Calls a function every `delay` milliseconds until the promise resolves. The callback will be called at least once.
 * @param {Promise<*>} promise - A promise that will eventually resolve.
 * @param {function()=>void} callback A callback function that will have no arguments.
 * @param {number} delay The delay of calling the callback, in milliseconds.
 * @returns {Promise<*>}
 */
async function promiseTimerContainer(promise, callback, delay) {
    setImmediate(callback);
    const timerID = setInterval(callback, delay);
    await promise;
    clearInterval(timerID);
    return promise;
}
exports = module.exports = promiseTimerContainer;