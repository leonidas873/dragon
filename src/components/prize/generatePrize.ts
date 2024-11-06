const PRIZE_TYPES = ['coin', 'flash'];

const getRandomValue = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

type prizeT = 'coin' | 'flash';

interface GeneratePrizeI{
    type: prizeT,
    value: number
}

export const generatePrize = ():GeneratePrizeI => {
    const randomType = PRIZE_TYPES[Math.floor(Math.random() * PRIZE_TYPES.length)] as prizeT;
    
    const randomValue = getRandomValue(1, 10);
    
    return {
        type: randomType,
        value: randomValue,
    };
};