const { maxDiceSide, donators } = require("./config_handler")();
/**
 * @returns {{target:number,diceSides:number}}
 * @param {Array<string>} argumentArray
 * @param {string} userID
 * @throws {string} - Message constructed for the error. Just catch the message in a try-catch and return via returning and sending the message.
 * @async - The only reason I made it async is to let other messages to be processed too.
 */
async function argumentParser(argumentArray, userID) {
    //LOADS OF TODO
    const targetNumberCandidates = argumentArray.filter(string => !isNaN(string)),
        diceSideCandidates = argumentArray.filter(string => string.startsWith("d") &&
            string.slice(1) &&
            !isNaN(string.slice(1))
        ).map(diceSideCandidate => diceSideCandidate.slice(1));
    if (diceSideCandidates.length > 1) {
        throw `Herkese aynı anda birer zar ayırabiliyorum, birer tane yaz, sıranı bekle${
        donators.includes(userID) ? " aşkım" : ""
        }.`;
    }
    if (targetNumberCandidates.length > 1) {
        throw `Herkese aynı anda birer zar ayırabiliyorum, birer tane yaz, sıranı bekle${
        donators.includes(userID) ? " aşkım" : ""
        }.`;
    }
    if (targetNumberCandidates.length === 0) {
        throw `Ee, ne için atıyorum zarı, yazmamışsın${
        donators.includes(userID) ? " canım" : ""
        }. Hadi düzgünce bi' daha yaz.`;
    }
    const target = targetNumberCandidates[0];
    const diceSides = (diceSideCandidates.length === 1) ?
        diceSideCandidates[0] : target; //default dice side count is target number
    if (target > diceSides) {
        throw `${diceSides} yüzlü zarda nasıl ${target} atayım? Düzgünce bir istek yaz lütfen.`;
    } 

    if (diceSides > maxDiceSide) {
        throw `Üzgünüm${
        donators.includes(userID) ? " aşkım ama" : ","
        } atomik zar kolleksiyonum daha gelmedi.
Şu anda maksimum ${maxDiceSide} yüzlü zarlara bakabiliyorum, onlar da çok küçük ve zaman alıyorlar${
        donators.includes(userID) ? " canım" : ""
        }.`;
    }
    return { target, diceSides };
}

exports = module.exports = argumentParser;