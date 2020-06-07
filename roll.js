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
 * @param {{target:number,diceSides:number}} parameters
 */
async function getRollCount({ target, diceSides }) {
    let latestRandomNumber=-1, rolls = 0;
    while (target !== latestRandomNumber) {
        latestRandomNumber = await roll(diceSides);
        console.log(`rolling for ${target} on a ${diceSides} sided dice, got ${latestRandomNumber}`);
        rolls++;
        await wait1Tick();
    }
    return rolls;
}

exports = module.exports = getRollCount;