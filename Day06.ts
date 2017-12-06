import fs = require("fs");

function redist(bank: number[]) {
    let maxI = bank.reduce((maxi, val, idx, arr) => val > arr[maxi] ? idx : maxi, 0);
    let left = bank[maxI];
    bank[maxI] = 0;
    for (; left > 0; left--) {
        maxI = (maxI + 1) % bank.length;
        bank[maxI]++;
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

    return {total: count, loop: count - (loopMap.get(str) || 0)};
}

const data = fs.readFileSync("data/day06.txt", "utf8").split(/\s/).map((n) => parseInt(n, 10));
const {total, loop} = redistributions(data);
console.log(`Redistributions before loop: ${total}`);
console.log(`Redistributions in loop:     ${loop}`);
