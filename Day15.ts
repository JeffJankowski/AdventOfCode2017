function match(a: number, b: number) {
    const MASK = 0xFFFF;
    return (a & MASK) === (b & MASK);
}

class Gen {
    private readonly DIV = 2147483647;
    constructor(readonly factor: number, public value: number, readonly multiple = 1) {  }
    public gen() {
        do {
            this.value = (this.value * this.factor) % this.DIV;
        } while (this.value % this.multiple !== 0 );
        return this.value;
    }
}

const [A_FACT, B_FACT] = [16807, 48271];
const [A_VAL, B_VAL] = [512, 191];
let [A, B] = [new Gen(A_FACT, A_VAL), new Gen(B_FACT, B_VAL)];
let matches = 0;
for (let i = 0; i < (40 * 10 ** 6); i++) {
    if (match(A.gen(), B.gen())) { matches++; }
}
console.log(`Judges count: ${matches}`);

[A, B] = [new Gen(A_FACT, A_VAL, 4), new Gen(B_FACT, B_VAL, 8)];
matches = 0;
for (let i = 0; i < (5 * 10 ** 6); i++) {
    if (match(A.gen(), B.gen())) { matches++; }
}
console.log(`Judges count (multiples): ${matches}`);
