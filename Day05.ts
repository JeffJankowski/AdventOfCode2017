import fs = require("fs");

function steps(instructions: number[], incrFunc = (n: number) => 1) {
    const data = [...instructions];
    let pc = 0;
    let count = 0;
    while (pc < data.length) {
        const jmp = data[pc];
        data[pc] += incrFunc(jmp);
        pc += jmp;
        count++;
    }

    return count;
}

const input = fs.readFileSync("data/day05.txt", "utf8").split("\n").map((n) => parseInt(n, 10));
console.log(`Number of strange jumps:  ${steps(input)}`);
console.log(`Number of stranger jumps: ${steps(input, (n) => n >= 3 ? -1 : 1)}`);
