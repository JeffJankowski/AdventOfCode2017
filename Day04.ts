import fs = require('fs');

function valid(phrase: string[], func: (word: string) => string) {
    const set = new Set<string>();
    return phrase.every((word, i, arr) => set.size !== set.add(func(word)).size);
}

const phrases = fs.readFileSync('data/day04.txt', 'utf8')
                  .split('\n')
                  .map((str) => str.split(/\s/));
const simple = phrases.filter((pass) => valid(pass, (str) => str)).length;
console.log(`Valid (simple) passphrases:  ${simple}`);
const hard = phrases.filter((pass) => valid(pass, (str) => [...str].sort().join(''))).length;
console.log(`Valid (complex) passphrases: ${hard}`);
