import fs = require("fs");

function dance(state: string, moves: string[]) {
    const progs = [...state];
    const swap = (x: number, y: number) => {
        const tmp = progs[x];
        progs[x] = progs[y];
        progs[y] = tmp;
    };
    const INSTRUCTIONS: {[mov: string]: (suff: string) => void} = {
        s: (rest: string) => progs.unshift(...progs.splice(progs.length - (+rest), +rest)),
        x: (rest: string) => {
            const [x, y] = rest.split("/").map((s) => +s);
            swap(x, y);
        },
        p: (rest: string) => {
            const [a, b] = rest.split("/");
            const [x, y] = [progs.findIndex((val) => val === a),
                            progs.findIndex((val) => val === b)];
            swap(x, y);
        },
    };
    moves.forEach((move) => INSTRUCTIONS[move[0]](move.substr(1)));
    return progs.join("");
}

function loopCount(start: string, moves: string[]) {
    let [count, state] = [0, start];
    do {
        state = dance(state, moves);
        count++;
    } while (state !== start);
    return count;
}

const data = fs.readFileSync("data/day16.txt", "utf8").split(",");
const INITIAL = "abcdefghijklmnop";
console.log(`After one full dance:   ${dance(INITIAL, data)}`);

const LOOP = loopCount(INITIAL, data);
const billion = [...Array(1E9 % LOOP)].reduce((state) => dance(state, data), INITIAL);
console.log(`After a billion dances: ${billion}`);
