import fs = require("fs");

function firstMaxIndex(arr: number[]) {
    let [maxI, maxVal] = [-1, -1];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
            maxI = i;
        }
    }
    return maxI;
}

function redist(bank: number[]) {
    let i = firstMaxIndex(bank);
    let left = bank[i];
    bank[i] = 0;
    for (; left > 0; left--) {
        i = (i + 1) % bank.length;
        bank[i]++;
    }
}

function redistributions(bank: number[]) {
    const toStr = (arr: number[]) => arr.join(",");
    const loopMap = new Map<string, number>();

    let count = 0;
    let str = toStr(bank);
    while (!loopMap.has(str)) {
        loopMap.set(str, count);
        redist(bank);

        str = toStr(bank);
        count++;
    }

    return [count, count - (loopMap.get(str) || 0)];
}

const data = fs.readFileSync("data/day06.txt", "utf8").split(/\s/).map((n) => parseInt(n, 10));
const [total, loop] = redistributions(data);
console.log(`Redistributions before loop: ${total}`);
console.log(`Redistributions in loop:     ${loop}`);
