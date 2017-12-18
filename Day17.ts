const SKIP = 376;

const buffer: number[] = [0];
const EASY_SPINS = 2017;
for (let i = 1, curr = 0; i <= EASY_SPINS; i++) {
    curr = (curr + SKIP) % buffer.length + 1;
    buffer.splice(curr, 0, i);
}
console.log(`Value after 2017: ${buffer[buffer.indexOf(EASY_SPINS) + 1]}`);

const HARD_SPINS = 50E6;
let afterZero;
for (let i = 1, curr = 0; i <= HARD_SPINS; i++) {
    curr = (curr + SKIP) % i + 1;
    if (curr === 1) {
        afterZero = i;
    }
}
console.log(`Second value after 50 million spins: ${afterZero}`);
