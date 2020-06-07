const ForkedOutPromiseConstructor = require("./forkedOutPromise");
const wait1Tick = function () {
    const FoP = new ForkedOutPromiseConstructor();
    setImmediate(FoP.resolve);
    return FoP.promise;
};

/**
 * @returns {Promise<number>}
 * @param {number} max 
 * @async
 */
async function roll(max) {
    return Math.ceil(Math.random() * max);
}
/**
 * @returns {Promise<number>}
 * @param {{target:number,diceSide:number}} parameters
 */
async function getRollCount({ target, diceSides }) {
    let latestRandomNumber, rolls = 0;
    do {
        latestRandomNumber = await roll(diceSides);
        rolls++;
        await wait1Tick();
    } while (target !== latestRandomNumber);
    return rolls;
}

exports = module.exports = getRollCount;