async function roll(max){
    return Math.ceil(await Math.random() * max);
}

async function getRollCount(targetNumber){
    if (typeof targetNumber !== "number"){}
    if (targetNumber <= 0){}
    let latestRandomNumber,rolls=0;
    do{
        latestRandomNumber = await roll(targetNumber);
        rolls++;
    }while(targetNumber === latestRandomNumber);
    return rolls;
}

exports = module.exports = getRollCount;