function mathSpiral(target: number) {
    // round up to nearest odd
    const base = 2 * Math.floor((Math.sqrt(target) + 1) / 2) + 1;
    // find ring level
    const ring = Math.floor(base / 2);
    // get offset from origin
    const offset = ((target - ((base - 2) ** 2)) % (base - 1)) - ring;
    return ring + Math.abs(offset);
}

class Grid {
    private grid: { [coords: string]: number } = {'0,0': 1};

    public calc([x, y]: [number, number]) {
        const sum = this.sum([x, y]);
        this.grid[`${x},${y}`] = sum;
        return sum;
    }

    private sum([x, y]: [number, number]) {
        let sum = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                sum += this.grid[`${x + i},${y + j}`] || 0;
            }
        }
        return sum;
    }
}

function sumSpiral(target: number) {
    const grid: Grid = new Grid();
    let last = 1;
    let base = 2;
    while (last < target) {
        const off = Math.floor(base / 2);
        for (let y = 1 - off; y <= off; y++) {
            last = grid.calc([off, y]);
            if (last >= target) { return last; }
        }
        for (let x = off - 1; x >= -off; x--) {
            last = grid.calc([x, off]);
            if (last >= target) { return last; }
        }
        for (let y = off - 1; y >= -off; y--) {
            last = grid.calc([-off, y]);
            if (last >= target) { return last; }
        }
        for (let x = 1 - off; x <= off; x++) {
            last = grid.calc([x, -off]);
            if (last >= target) { return last; }
        }

        base += 2;
    }
}

const INPUT = 347991;
console.log(`Sequential spiral: ${mathSpiral(INPUT)}`);
console.log(`First largest in sum spiral: ${sumSpiral(INPUT)}`);
