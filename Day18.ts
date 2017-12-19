import fs = require("fs");

class Computer {
    protected REGISTERS: {[reg: string]: number} = {};
    protected IC = 0;
    protected IS: {[instr: string]: ([x, y]: string[]) => void} = {
        set: ([x, y]: string[]) => this.REGISTERS[x] = this.val(y),
        add: ([x, y]: string[]) => this.REGISTERS[x] = (this.REGISTERS[x] || 0) + this.val(y),
        mul: ([x, y]: string[]) => this.REGISTERS[x] = (this.REGISTERS[x] || 0) * this.val(y),
        mod: ([x, y]: string[]) => this.REGISTERS[x] = (this.REGISTERS[x] || 0) % this.val(y),
        jgz: ([x, y]: string[]) => this.IC += this.val(x) > 0 ? this.val(y) - 1 : 0,
    };
    constructor(protected PROGRAM: string[]) {}
    protected val = (x: string) => isNaN(+x) ? this.REGISTERS[x] : +x;
    protected tick() {
        const parts = this.PROGRAM[this.IC].split(" ");
        this.IS[parts[0]]([parts[1], parts[2]]);
        this.IC++;
    }
}

class Naive extends Computer {
    private lastSound: number;
    private halt: boolean;
    constructor(protected PROGRAM: string[]) {
        super(PROGRAM);
        this.IS = {
            ...this.IS,
            snd: ([x]: string[]) => this.lastSound = this.val(x),
            rcv: ([x]: string[]) => this.halt = this.val(x) !== 0,
        };
    }
    public process() {
        while (!this.halt) { this.tick(); }
        return this.lastSound;
    }
}

class Concurrent extends Computer {
    public Waiting = false;
    constructor(protected PROGRAM: string[], public ID: number, private SndQueue: number[],
                private RcvQueue: number[]) {
        super(PROGRAM);
        this.IS = {
            ...this.IS,
            snd: ([x]: string[]) => SndQueue.push(this.val(x)),
            rcv: ([x]: string[]) => {
                if (RcvQueue.length > 0) {
                    this.REGISTERS[x] = RcvQueue.shift() || 0;
                } else {
                    this.Waiting = true;
                    this.IC--;
                }
            },
        };
        this.REGISTERS.p = ID;
    }
    public tick() {
        const snd = this.SndQueue.length;
        super.tick();
        return this.SndQueue.length > snd;
    }
}

const INPUT = fs.readFileSync("data/day18.txt", "utf8").split("\r\n");
console.log(`Recovered frequency: ${new Naive(INPUT).process()}`);

const [queue0, queue1]: [number[], number[]] = [[], []];
const [cpu0, cpu1] = [new Concurrent(INPUT, 0, queue0, queue1),
                      new Concurrent(INPUT, 1, queue1, queue0)];
let sendCount = 0;
while (!cpu0.Waiting || !cpu1.Waiting) {
    cpu0.tick();
    sendCount += cpu1.tick() ? 1 : 0;
}
console.log(`Number of sends by prog1: ${sendCount}`);
