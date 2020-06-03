const ForkedOutPromiseConstructor=require("./forkedOutPromise");
const wait1Tick= function(){
    const FoP = new ForkedOutPromiseConstructor();
    setImmediate(FoP.resolve);
    return FoP.promise;
};
async function roll(max) {
    return Math.ceil(Math.random() * max);
}

async function getRollCount(targetNumber) {
    if (typeof targetNumber !== "number") { }
    if (targetNumber <= 0) { }
    let latestRandomNumber, rolls = 0;
    do {
        latestRandomNumber = await roll(targetNumber);
        rolls++;
        await wait1Tick();
    } while (targetNumber !== latestRandomNumber);
    return rolls;
}

exports = module.exports = getRollCount;