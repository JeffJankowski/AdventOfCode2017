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
    const map = new Map<string, string>();
    for (const rule of rules) {
        const [inp, out] = rule.split(" => ");
        let ruleRows = inp.split("/");
        const outRule = out.split("/").join("");
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
    let image = toImg(imageStr);
    for (let iter = 0; iter < iterations; iter++) {
        const size = image[0].length;
        const divis = size % 2 === 0 ? 2 : 3;
        const sections: string[][][] = [];
        for (let i = 0; i < (size / divis) ** 2; i++) {
            const row = Math.floor((i * divis) / size) * divis;
            const col = (i * divis) % size;
            const section = [image[row].slice(col, col + divis), image[row + 1].slice(col, col + divis)];
            if (divis === 3) {
                section.push(image[row + 2].slice(col, col + divis));
            }
            const str = toStr(section);
            const rpl = rulebook.get(str) || "FUCK";
            sections.push(toImg(rpl));
        }
        image = combine(sections);
    }
    return Array<string>().concat(...image).filter((x) => x !== ".").length;
}

const rulebook = buildMap(fs.readFileSync("data/day21.txt", "utf8").split("\r\n"));
const START = ".#...####";
console.log(`Number of lit pixels after 5 iterations:  ${generate(START, 5)}`);
console.log(`Number of lit pixels after 18 iterations: ${generate(START, 18)}`);
