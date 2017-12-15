function match(a: number, b: number) {
    const MASK = 0xFFFF;
    return (a & MASK) === (b & MASK);
}

function* generate(factor: number, value: number, multiple = 1) {
    while (true) {
        do {
            value = (value * factor) % 2147483647;
        } while (value % multiple !== 0 );
        yield value;
    }
}

const [A_FACT, B_FACT] = [16807, 48271];
const [A_VAL, B_VAL] = [512, 191];

let [A, B] = [generate(A_FACT, A_VAL), generate(B_FACT, B_VAL)];
let matches = 0;
for (let i = 0; i < 40E6; i++) {
    if (match(A.next().value, B.next().value)) { matches++; }
}
console.log(`Judges count: ${matches}`);

[A, B] = [generate(A_FACT, A_VAL, 4), generate(B_FACT, B_VAL, 8)];
matches = 0;
for (let i = 0; i < 5E6; i++) {
    if (match(A.next().value, B.next().value)) { matches++; }
}
console.log(`Judges count (multiples): ${matches}`);
