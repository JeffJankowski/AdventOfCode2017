import fs = require("fs");

function walk(dirs: string[]): [number, number] {
    const score = (x: number, y: number) =>
        Math.abs(x) + Math.abs(y) - Math.min(Math.abs(y), Math.ceil(Math.abs(x) / 2));

    const NAV: {[dir: string]: (pos: [number, number]) => [number, number]} = {
        n:  ([x, y]) => [x, y + 1],
        s:  ([x, y]) => [x, y - 1],
        nw: ([x, y]) => [x - 1, x % 2 === 0 ? y + 1 : y],
        ne: ([x, y]) => [x + 1, x % 2 === 0 ? y + 1 : y],
        sw: ([x, y]) => [x - 1, x % 2 !== 0 ? y - 1 : y],
        se: ([x, y]) => [x + 1, x % 2 !== 0 ? y - 1 : y],
    };

    let curr: [number, number] = [0, 0];
    let max = -Infinity;
    for (const dir of dirs) {
        curr = NAV[dir](curr);
        max = Math.max(max, score(curr[0], curr[1]));
    }
    return [score(curr[0], curr[1]), max];
}

const [lastScore, globalMax] = walk(fs.readFileSync("data/day11.txt", "utf8").split(","));
console.log(`Distance from origin:  ${lastScore}`);
console.log(`Max distance over run: ${globalMax}`);
