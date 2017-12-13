import fs = require("fs");

function delay(layers: Map<number, number>) {
    const caught = (del: number) => {
        for (const [depth, range] of layers.entries()) {
            if ((depth + del) % (range * 2 - 2) === 0) {
                return true;
            }
        }
        return false;
    };

    let i = 0;
    while (caught(i)) {
        i++;
    }
    return i;
}

function score(layers: Map<number, number>) {
    return [...layers.entries()].reduce((severity, [depth, range]) =>
        depth % (range * 2 - 2) === 0 ? severity += depth * range : severity, 0);
}

const map = new Map<number, number>();
const data = fs.readFileSync("data/day13.txt", "utf8").split("\r\n").forEach((str) => {
    const [depth, range] = (str.match(/([0-9]+): ([0-9]+)/) as RegExpMatchArray).slice(1);
    map.set(+depth, +range);
});

console.log(`Severity score: ${score(map)}`);
console.log(`Delay until safe run: ${delay(map)}`);
