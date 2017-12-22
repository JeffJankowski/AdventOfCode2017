import fs = require("fs");

function rotate(rows: string[]) {
    const rotated: string[] = [];
    for (let i = 0; i < rows.length; i++) {
        let nr = "";
        for (const row of rows) { nr += row.substr(i, 1); }
        rotated.push(nr);
    }
    return rotated;
}

function buildMap(rules: string[]) {
    const map = new Map<string, string[][]>();
    for (const rule of rules) {
        const [inp, out] = rule.split(" => ");
        let ruleRows = inp.split("/");
        const outRule = toImg(out.split("/").join(""));
        for (let rot = 0; rot < 4; rot++) {
            ruleRows = rotate(ruleRows);
            map.set(ruleRows.join(""), outRule);
            map.set(ruleRows.reverse().join(""), outRule);
        }
    }
    return map;
}

function toStr(img: string[][]) { return Array<string>().concat(...img).join(""); }
function toImg(str: string) {
    const img: string[][] = [];
    const size = Math.sqrt(str.length);
    for (let i = 0; i < size; i++) {
        img.push(str.substr(i * size, size).split(""));
    }
    return img;
}
function combine(sections: string[][][]) {
    const img: string[][] = [];
    const [sectionSize, size] = [Math.sqrt(sections.length), sections[0].length];
    for (let i = 0; i < sectionSize; i++) {
        for (let n = 0; n < size; n++) {
            let row: string[] = [];
            for (let j = 0; j < sectionSize; j++) {
                row = row.concat(sections[i * sectionSize + j][n]);
            }
            img.push(row);
        }
    }
    return img;
}

function generate(imageStr: string, iterations: number) {
    let img = toImg(imageStr);
    for (let iter = 0; iter < iterations; iter++) {
        const size = img[0].length;
        const div = size % 2 === 0 ? 2 : 3;
        const sections: string[][][] = [];
        for (let i = 0; i < (size / div) ** 2; i++) {
            const [row, col] = [Math.floor((i * div) / size) * div, (i * div) % size];
            const section = [img[row].slice(col, col + div), img[row + 1].slice(col, col + div)];
            if (div === 3) { section.push(img[row + 2].slice(col, col + div)); }
            sections.push(rulebook.get(toStr(section)) || [["FUCK"]]);
        }
        img = combine(sections);
    }
    return img;
}

const count = (img: string[][]) => Array<string>().concat(...img).filter((x) => x !== ".").length;

const rulebook = buildMap(fs.readFileSync("data/day21.txt", "utf8").split("\r\n"));
let image = generate(".#...####", 5);
console.log(`Number of lit pixels after 5 iterations:  ${count(image)}`);
image = generate(toStr(image), 18 - 5);
console.log(`Number of lit pixels after 18 iterations: ${count(image)}`);
