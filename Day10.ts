import fs = require("fs");

function hash(inputs: number[], rounds = 1) {
    const LENGTH = 256;
    const list = [...Array(LENGTH)].map((_, i) => i);
    let [pos, skip] = [0, 0];
    for (let r = 0; r < rounds; r++) {
        for (const l of inputs) {
            for (let i = 0; i < l / 2; i++) {
                const first = list[(i + pos) % LENGTH];
                list[(i + pos) % LENGTH] = list[(l - i - 1 + pos) % LENGTH];
                list[(l - i - 1 + pos) % LENGTH] = first;
            }
            pos = (pos + l + skip++) % LENGTH;
        }
    }
    return list;
}

const input = fs.readFileSync("data/day10.txt", "utf8");
const easyList = hash(input.split(",").map((l) => +l));
console.log(`First two elements multiplied: ${easyList[0] * easyList[1]}`);

const SUFFIX = [17, 31, 73, 47, 23];
const hardList = hash([...input].map((char) => char.charCodeAt(0)).concat(...SUFFIX), 64);
const dense = [...Array(16)].map((_, i) =>
    hardList.slice(i * 16, (i + 1) * 16).reduce((xor, val) => xor ^ val, 0));
console.log(`End hash: ${dense.map((n) => (n <= 16 ? "0" : "") + n.toString(16)).join("")}`);
