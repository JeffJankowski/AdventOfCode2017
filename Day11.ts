import fs = require("fs");

interface Point {
    x: number;
    y: number;
}

function walk(dirs: string[]): [number, number] {
    const score = (p: Point) =>
        Math.abs(p.x) + Math.abs(p.y) - Math.min(Math.abs(p.y), Math.ceil(Math.abs(p.x) / 2));

    const NAV: {[dir: string]: (pos: Point) => Point} = {
        n:  (p) => ({x: p.x,     y: p.y + 1}),
        s:  (p) => ({x: p.x,     y: p.y - 1}),
        nw: (p) => ({x: p.x - 1, y: p.x % 2 === 0 ? p.y + 1 : p.y}),
        ne: (p) => ({x: p.x + 1, y: p.x % 2 === 0 ? p.y + 1 : p.y}),
        sw: (p) => ({x: p.x - 1, y: p.x % 2 !== 0 ? p.y - 1 : p.y}),
        se: (p) => ({x: p.x + 1, y: p.x % 2 !== 0 ? p.y - 1 : p.y}),
    };

    let [curr, max]: [Point, number] = [{x: 0, y: 0}, -Infinity];
    for (const dir of dirs) {
        curr = NAV[dir](curr);
        max = Math.max(max, score(curr));
    }
    return [score(curr), max];
}

const [lastScore, globalMax] = walk(fs.readFileSync("data/day11.txt", "utf8").split(","));
console.log(`Distance from origin:  ${lastScore}`);
console.log(`Max distance over run: ${globalMax}`);
