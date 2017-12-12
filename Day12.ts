import fs = require("fs");

interface Pipes { [id: number]: number[]; }

function connected(id: number, pipes: Pipes) {
    const set = new Set<number>([id]);
    const visit = (i: number) => {
        for (const conn of pipes[i]) {
            if (!set.has(conn)) {
                set.add(conn);
                visit(conn);
            }
        }
    };
    visit(id);
    return set;
}

function groups(pipes: Pipes) {
    let count = 0;
    const visited = new Set<number>();
    for (let i = 0; i < data.length; i++) {
        if (!visited.has(i)) {
            [...connected(i, pipes).values()].forEach((conn) => visited.add(conn));
            count++;
        }
    }
    return count;
}

const data = fs.readFileSync("data/day12.txt", "utf8").split("\r\n");
const map: Pipes = { };
for (const str of data) {
    const [id, rest] = (str.match(/([0-9]+) <-> (.+)/) as RegExpMatchArray).slice(1);
    map[+id] = rest.split(", ").map((s) => +s);
}
console.log(`Programs in group 0: ${connected(0, map).size}`);
console.log(`Number of disconnected groups: ${groups(map)}`);
