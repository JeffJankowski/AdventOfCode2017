import fs = require("fs");

// essentially stole all this code from day 18
class Computer {
    protected IC = 0;
    protected mulCount = 0;
    protected IS: {[instr: string]: ([x, y]: string[]) => void} = {
        set: ([x, y]: string[]) => this.REGISTERS[x] = this.val(y),
        sub: ([x, y]: string[]) => this.REGISTERS[x] = (this.REGISTERS[x] || 0) - this.val(y),
        mul: ([x, y]: string[]) => {
            this.mulCount++;
            this.REGISTERS[x] = (this.REGISTERS[x] || 0) * this.val(y); },
        jnz: ([x, y]: string[]) => this.IC += this.val(x) !== 0 ? this.val(y) - 1 : 0,
    };
    constructor(protected PROGRAM: string[], protected REGISTERS: {[reg: string]: number} = {}) {}
    protected val = (x: string) => isNaN(+x) ? (this.REGISTERS[x] || 0) : +x;
    protected tick() {
        const parts = this.PROGRAM[this.IC].split(" ");
        this.IS[parts[0]]([parts[1], parts[2]]);
        this.IC++;
    }

    public run() {
        while (this.IC < this.PROGRAM.length) { this.tick(); }
        return this.mulCount;
    }
}

const data = fs.readFileSync("data/day23.txt", "utf8").split("\r\n");
console.log(`Number of 'mul' calls: ${new Computer(data).run()}`);

// PART 2: I just performed static analysis on the assembly code, and determined that it's
//         counting the composite numbers for: 109900 <= x <= 126900 and x_step = 17
const isComposite = (num: number) => {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) { return true; }}
    return num === 1;
};
const composites = Array(1001).fill(109900).map((x, i) => x + (i * 17)).filter(isComposite).length;
console.log(`Number of composite values: ${composites}`);
