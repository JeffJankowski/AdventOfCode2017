import fs = require("fs");

const DIRS: {[DIR: string]: (point: [number, number]) => [number, number]} = {
    down: ([x, y]: [number, number]) => [x, y + 1],
    right: ([x, y]: [number, number]) => [x + 1, y],
    up: ([x, y]: [number, number]) => [x, y - 1],
    left: ([x, y]: [number, number]) => [x - 1, y],
};
const get = ([x, y]: [number, number]) => grid[y][x];
const mark = ([x, y]: [number, number]) => grid[y][x] = "x";
const grid = fs.readFileSync("data/day19.txt", "utf8").split("\r\n").map((row) => [...row]);

let curr: [number, number] = [grid[0].indexOf("|"), 0];
let move = DIRS.down;
let letters = "";
let steps = 0;
while (get(curr) !== " ") {
    mark(curr);
    steps++;
    curr = move(curr);
    switch (get(curr)) {
        case "|":
        case "-":
        case "x":
            break;
        case "+":
            for (const d in DIRS) {
                const look = get(DIRS[d](curr));
                if (look !== " " && look !== "x") {
                    move = DIRS[d];
                    break;
                }
            }
            break;
        default:
            letters += get(curr);
    }
}

console.log(`Letter order of traversal: ${letters}`);
console.log(`Number of steps: ${steps}`);
