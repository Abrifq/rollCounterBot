/**
 * @returns {void}
 * @param {number} from 
 * @param {number} to 
 */

async function rollTester(from, to) {
    const rollFunction = require("../roll");
    console.time("Roll Test");
    for (let currentIteration = from; currentIteration < to; currentIteration++) {
        console.timeLog("Roll Time"," started to roll for "+currentIteration);
        const tries = await rollFunction(currentIteration);
        console.timeLog("Roll Time"," rolled "+currentIteration+" in " + tries + " tries.");
    }
    console.timeEnd("Roll Test");
    return;
}
module.exports = exports = rollTester;