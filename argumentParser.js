const { maxDiceSide, donators } = require("./config_handler")();
/**
 * @returns {{target:number,diceSides:number}}
 * @param {Array<string>} argumentArray
 * @param {string} userID
 * @throws {string} - Message constructed for the error. Just catch the message in a try-catch and return via returning and sending the message.
 * @async - The only reason I made it async is to let other messages to be processed too.
 */
async function argumentParser({argumentArray, userID}) {
    //LOADS OF TODO
    const isDonator = donators.includes(userID);
    const targetNumberCandidates = argumentArray.filter(string => Number(string) > 0).map(Number),
        diceSideCandidates = argumentArray.filter(string => string.startsWith("d") &&
            string.slice(1) &&
            Number(string.slice(1)) > 0
        ).map(diceSideCandidate => diceSideCandidate.slice(1)).map(Number);
    if (diceSideCandidates.length > 1 || targetNumberCandidates.length > 1) {
        throw `Herkese aynı anda birer zar ayırabiliyorum, birer tane yaz, sıranı bekle${
        isDonator ? " aşkım" : ""
        }.`;
    }
    if (targetNumberCandidates.length === 0) {
        throw `Ee, ne için atıyorum zarı, yazmamışsın${
        isDonator ? " canım" : ""
        }. Hadi düzgünce bi' daha yaz.`;
    }
    const target = targetNumberCandidates[0];
    const diceSides = (diceSideCandidates.length === 1) ? diceSideCandidates[0] : target; //default dice side count is target number
    if (target > diceSides) {
        throw `${diceSides} yüzlü zarda nasıl ${target} atayım?`;
    }

    if (diceSides > maxDiceSide) {
        throw `Üzgünüm${
        isDonator ? " aşkım ama" : ","
        } atomik zar kolleksiyonum daha gelmedi.
Şu anda maksimum ${maxDiceSide} yüzlü zarlara bakabiliyorum, onlar da çok küçük ve zaman alıyorlar${
        isDonator ? " canım" : ""
        }.`;
    }
    return { target, diceSides };
}

exports = module.exports = argumentParser;