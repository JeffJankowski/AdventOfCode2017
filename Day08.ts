import fs = require("fs");

const pattern = /^([a-z]+) (inc|dec) (-?[0-9]+) if ([a-z]+) (>|<|>=|<=|==|!=) (-?[0-9]+)$/;
const evaluate: {[op: string]: (regVal: number, val: number) => boolean} = {
    ">": (regVal: number, val: number) => regVal > val,
    "<": (regVal: number, val: number) => regVal < val,
    ">=": (regVal: number, val: number) => regVal >= val,
    "<=": (regVal: number, val: number) => regVal <= val,
    "==": (regVal: number, val: number) => regVal === val,
    "!=": (regVal: number, val: number) => regVal !== val,
};

function process(line: string, map: Map<string, number>) {
    const [_, reg, func, val, compReg, comp, compVal] = [...(line.match(pattern) as RegExpMatchArray)];
    if (evaluate[comp](map.get(compReg) || 0, +compVal)) {
        map.set(reg, (map.get(reg) || 0) + (func === "inc" ? +val : -val));
    }
}

const input = fs.readFileSync("data/day08.txt", "utf8").split("\r\n");
const cpu = new Map<string, number>();
const max = input.reduce((runningMax, instr, _, __) => {
    process(instr, cpu);
    const localMax = Math.max(...cpu.values());
    return localMax > runningMax ? localMax : runningMax;
}, -Infinity);
console.log(`Max register value at end:  ${Math.max(...cpu.values())}`);
console.log(`Max register value overall: ${max}`);
