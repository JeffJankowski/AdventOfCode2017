import fs = require('fs');

function steps(target: number) {
    // round up to nearest odd
    const base = 2 * Math.floor((Math.sqrt(target) + 1) / 2) + 1;
    const subbase = base - 2;
    const off = Math.floor(base / 2);
    const ring = Math.floor(base / 2);

    if (target < subbase ** 2 + 1 + (base - 1)) {
        const start = subbase ** 2 + 1;
        const delta = target - start;
        const y = delta - off + 1;
        return ring + Math.abs(y);
    } else if (target < subbase ** 2 + 1 + 2 * (base - 1)) {
        const start = subbase ** 2 + 1 + (base - 1);
        const delta = target - start;
        const x = off - delta - 1;
        return Math.abs(x) + ring;
    } else if (target < (subbase ** 2 + 1 + 3 * (base - 1))) {
        const start = subbase ** 2 + 1 + 2 * (base - 1);
        const delta = target - start;
        const y = off - delta - 1;
        return ring + Math.abs(y);
    } else {
        const start = subbase ** 2 + 1 + 3 * (base - 1);
        const delta = target - start;
        const x = delta - off + 1;
        return Math.abs(x) + ring;
    }
}

const INPUT = 347991;
console.log(`Sequential spiral: ${steps(INPUT)}`);

class Grid {
    private grid: { [coords: string]: number } = {};

    public sum([x, y]: [number, number]) {
        return this.getVal([x + 1, y - 1]) + this.getVal([x + 1, y]) +
            this.getVal([x + 1, y + 1]) + this.getVal([x, y - 1]) +
            this.getVal([x, y + 1]) + this.getVal([x - 1, y - 1]) +
            this.getVal([x - 1, y]) + this.getVal([x - 1, y + 1]);
    }
    public getVal([x, y]: [number, number]) {
        return this.grid[this.coordStr(x, y)] || 0;
    }
    public setVal([x, y]: [number, number], val: number) {
        this.grid[this.coordStr(x, y)] = val;
    }

    private coordStr(x: number, y: number) { return`${x},${y}`; }
}

function sumSpiral(target: number) {
    const grid: Grid = new Grid();
    grid.setVal([0, 0], 1);
    let last = 1;
    let ring = 2;
    while (last < target) {
        const off = Math.floor(ring / 2);
        for (let y = -off + 1; y <= off; y++) {
            last = grid.sum([off, y]);
            grid.setVal([off, y], last);
            if (last >= target) { break; }
        }
        if (last >= target) { break; }
        for (let x = off - 1; x >= -off; x--) {
            last = grid.sum([x, off]);
            grid.setVal([x, off], last);
            if (last >= target) { break; }
        }
        if (last >= target) { break; }
        for (let y = off - 1; y >= -off; y--) {
            last = grid.sum([-off, y]);
            grid.setVal([-off, y], last);
            if (last >= target) { break; }
        }
        if (last >= target) { break; }
        for (let x = -off + 1; x <= off; x++) {
            last = grid.sum([x, -off]);
            grid.setVal([x, -off], last);
            if (last >= target) { break; }
        }

        ring += 2;
    }

    return last;
}

console.log(`First largest in sum spiral: ${sumSpiral(INPUT)}`);
