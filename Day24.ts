import fs = require("fs");

interface Comp { portA: number; portB: number; }

function build(pins: number, remaining: Comp[],
               compareFn: ([sA, lA]: [number, number], [sB, lB]: [number, number]) => number):
               [number, number] {
    const avail = remaining.filter((c) => c.portA === pins || c.portB === pins);
    if (avail.length === 0 ) { return [pins, 1]; }
    const recurs = avail.map((c) => {
        const copy = [...remaining];
        copy.splice(remaining.indexOf(c), 1);
        const [strength, length] = build(c.portA === pins ? c.portB : c.portA, copy, compareFn);
        return [pins * 2 + strength, length + 1] as [number, number];
    });
    return recurs.sort(compareFn)[0];
}

const components: Comp[] = fs.readFileSync("data/day24.txt", "utf8").split("\r\n").map((s) => {
    const parts = s.split("/");
    return {portA: +parts[0], portB: +parts[1]};
});

const strongFn = ([strA, lenA]: [number, number], [strB, lenB]: [number, number]) => strB - strA;
console.log(`Strongest bridge: ${build(0, components, strongFn).join("  (length):")}`);
const lengthFn = ([strA, lenA]: [number, number], [strB, lenB]: [number, number]) => lenB - lenA || strB - strA;
console.log(`Longest bridge:   ${build(0, components, lengthFn).join("  (length):")}`);
