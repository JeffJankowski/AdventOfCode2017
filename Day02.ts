import fs = require("fs");
import comb = require("js-combinatorics");

function checksum(rows: number[][], func: (row: number[]) => number) {
    return rows.reduce((sum, row) => sum += func(row), 0);
}

const input = fs.readFileSync("data/day02.txt", "utf8")
    .split("\n")
    .map((row) => {
        return row.trim()
            .split(/\s/)
            .map((num) => parseInt(num, 10)); });

const deltaFunc = (row: number[]) => Math.max(...row) - Math.min(...row);
console.log(`Checksum using difference:    ${checksum(input, deltaFunc)}`);

const divideFunc = (row: number[]) => {
    const [big, small] = comb.combination(row, 2).toArray()
        .map((pair) => pair.sort((x, y) => y - x))
        .find(([b, s]) => b % s === 0) || [1, 1];
    return big / small; };
console.log(`Checksum using even division: ${checksum(input, divideFunc)}`);
