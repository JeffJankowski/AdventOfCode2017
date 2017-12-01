import fs = require('fs');

function captcha(data: string) {
    return (next: (n: number) => number) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === data[next(i)]) {
                sum += parseInt(data[i], 10);
            }
        }
        return sum;
    };
}

const input = fs.readFileSync('data/day01.txt', 'utf8');
// trying out some partial application-style composition
const withData = captcha(input);

// part 1
const seq = (i: number) => (i + 1) % input.length;
console.log(`Using sequential digit: ${withData(seq)}`);
// part 2
const halfway = (i: number) => (i + input.length / 2) % input.length;
console.log(`Using halfway digit:    ${withData(halfway)}`);
