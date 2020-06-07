const queueMaster = {},
    FoPConstructor = require("./forkedOutPromise");

/**
 * @returns {Array<JobQueue>}
 * @param {string} userID 
 */

function getUserQueue(userID) {
    if (!(userID in queueMaster)) { queueMaster[userID] = { queue: [], isProcessing: false }; }
    return queueMaster[userID].queue;
}

/**@async
 * @returns {Promise<void>}
 * @param {string} userID
 */

async function queueHandler(userID) {
    //I assume I won't call this w/o creating a userQueue
    queueMaster[userID].isProcessing = true;
    const userQueue = getUserQueue(userID);
    while (userQueue.length/*> 0*/) {
        const currentJob = userQueue[0];
        currentJob.startJob();
        await currentJob.jobPromise;
        userQueue.shift();
    }
    queueMaster[userID].isProcessing = false;
    return;
}

/**
* @param {string} userID
* @returns {Promise<()=>void>}
* @async
*/
exports = module.exports = async function waitInQueue(userID) {
    const waitingPromiseFork = new FoPConstructor(), jobPromiseFork = new FoPConstructor();
    const queue = getUserQueue(userID);
    queue.push({
        startJob: waitingPromiseFork.resolve,
        jobPromise: jobPromiseFork.promise
    });
    if (!queueMaster[userID].isProcessing) { queueHandler(userID); }
    return waitingPromiseFork.promise.then(() => jobPromiseFork.resolve);
};

/**@typedef {Object} JobQueue
 * @prop {()=>void} startJob - Allows the job to run
 * @prop {Promise<void>} jobPromise - Resolves when the job is done.
 */