const donators = require("./config_handler")().donators;
/**
 * @returns {string}
 * @param {{arguments:{target:number},rollCount:number|string,userID:string}} infos 
 */

function afterRollMessageConstructor({ arguments:{target}, rollCount, userID }) {
    if (donators.includes(userID)) { return `<@${userID}> aşkom sonunda ${target} attım${rollCount > 1000 ? " ama ancak " : ", "}${rollCount < 100 ? "hem de " : ""}${rollCount}. denemede attım aşkosu.`; }
    return `<@${userID}>, ${target} sayısı ${rollCount > 100 ? "anca " : ""}${rollCount}. denemede geldi.`;
}

/**
 * @returns {string}
 * @param {{arguments:{target:number,diceSide:number},userID:string}} infos 
 */

function beforeRollMessageConstructor({ userID, arguments:{target,diceSide} }) {
    if (donators.includes(userID)) { return `<@${userID}> aşkım bana şans dile, atıyorum ${diceSide} yüzlü zarımı, senin için ${target} atacağım bebeğim!${target > 1000 ? " Ama biraz büyük sayı, beklemen gerekebilir aşkoom. :kiss:" : ""}`; }
    return `<@${userID}>, bana şans dile, ${target} sayısı için ${diceSide} yüzlü zarımı atmaya başladım.${target > 1000 ? " Büyük sayı yani." : ""}`;
}

/**
 * @param {{userID:string}} infos
 * @returns {string}
 */

function inQueueMessageConstructor({ userID }) {
    const isDonator = donators.includes(userID);
    return `<@${userID}>,${isDonator ? " aşkım" : ""} zaten ${isDonator ? "senin için zar" : "senin zarını"} atıyorum, biraz daha bekle${isDonator ? "yemez misin?" : "."}`;
}

exports.beforeRollMessageConstructor = beforeRollMessageConstructor;
exports.afterRollMessageConstructor = afterRollMessageConstructor;
exports.inQueueMessageConstructor = inQueueMessageConstructor;