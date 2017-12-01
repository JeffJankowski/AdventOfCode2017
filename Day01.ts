import fs = require('fs')

function captcha(data: string) {
    return (next: (n: number) => number) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === data[next(i)])
                sum += parseInt(data[i]);
        }
        return sum;
    }
}

let data = fs.readFileSync('data/day01.txt', 'utf8');
// trying out some partial application-style composition
let withData = captcha(data);

//part 1
let seq = (i: number) => (i + 1) % data.length;
console.log(`Using sequential digit: ${withData(seq)}`);
//part 2
let halfway = (i: number) => (i + data.length / 2) % data.length;
console.log(`Using halfway digit:    ${withData(halfway)}`);