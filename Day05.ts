import fs = require('fs');

function steps(instructions: number[], incrFunc: (off: number) => number) {
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

const input = fs.readFileSync('data/day05.txt', 'utf8').split('\n').map((num) => parseInt(num, 10));
console.log(`Number of strange jumps:  ${steps(input, (_) => 1)}`);
console.log(`Number of stranger jumps: ${steps(input, (jmp) => jmp >= 3 ? -1 : 1)}`);
