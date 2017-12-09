import fs = require("fs");

const noIgnore = (data: string) => data.replace(/\!./g, "");
const GARBAGE = /<[^>]*>/g;
const noGarbage = (data: string) => noIgnore(data).replace(GARBAGE, "");

const score = (data: string) => [...noGarbage(data)].reduce(([sum, level], char) =>
    [sum + (char === "{" ? level++ : 0), char === "}" ? --level : level],
    [0, 1])[0];
const garbage = (data: string) => [...noIgnore(data).match(GARBAGE) as RegExpMatchArray]
    .reduce((sum, garb) => sum += garb.length - 2, 0);

const input = fs.readFileSync("data/day09.txt", "utf8");
console.log(`Total score: ${score(input)}`);
console.log(`Garbage count: ${garbage(input)}`);
