import fs = require('fs')
import comb = require('js-combinatorics')

class Day01 {
    public static main() {
        const data = fs.readFileSync('data/day01.txt', 'utf8').split(/\s/);
        console.log(comb.factorial(4));
    }
}

Day01.main();