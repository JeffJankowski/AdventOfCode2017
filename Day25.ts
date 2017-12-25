const rules: {[state: string]: (val: number) => Array<string | number>} = {
    A: (curr: number) => !curr ? [1, 1, "B"] : [0, 1, "F"],
    B: (curr: number) => !curr ? [0, -1, "B"] : [1, -1, "C"],
    C: (curr: number) => !curr ? [1, -1, "D"] : [0, 1, "C"],
    D: (curr: number) => !curr ? [1, -1, "E"] : [1, 1, "A"],
    E: (curr: number) => !curr ? [1, -1, "F"] : [0, -1, "D"],
    F: (curr: number) => !curr ? [1, 1, "A"] : [0, -1, "E"],
};

const CHKSUM = 12964419;
const tape = new Map<number, number>();
let [state, cursor] = ["A", 0];
for (let i = 0; i < CHKSUM; i++) {
    const [val, mv, next] = rules[state](tape.get(cursor) || 0);
    tape.set(cursor, +val);
    cursor += +mv;
    state = next as string;
}
console.log(`Diagnostic checksum: ${[...tape.values()].filter((val) => val).length}`);
