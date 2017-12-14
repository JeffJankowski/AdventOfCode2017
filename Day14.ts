// logic stolen from Day 10, and then modified a little
function hash(input: string) {
    const LENGTH = 256;
    const ROUNDS = 64;
    const SUFFIX = [17, 31, 73, 47, 23];

    const inputs = [...input].map((char) => char.charCodeAt(0)).concat(...SUFFIX);
    const list = [...Array(LENGTH)].map((_, i) => i);
    let [pos, skip] = [0, 0];
    for (let r = 0; r < ROUNDS; r++) {
        for (const l of inputs) {
            for (let i = 0; i < l / 2; i++) {
                const first = list[(i + pos) % LENGTH];
                list[(i + pos) % LENGTH] = list[(l - i - 1 + pos) % LENGTH];
                list[(l - i - 1 + pos) % LENGTH] = first;
            }
            pos = (pos + l + skip++) % LENGTH;
        }
    }
    // to binary string
    return [...Array(16)].map((_, i) =>
        list.slice(i * 16, (i + 1) * 16).reduce((xor, val) => xor ^ val, 0))
        .map((n) => n.toString(2).padStart(8, "0")).join("");
}

function countGroups(grid: string[]) {
    const str = (x: number, y: number) => x + "," + y;
    const used = (row: number, col: number) => grid[row][col] === "1";
    const groups = new Map<string, number>();

    function search(row: number, col: number, n: number) {
        groups.set(str(row, col), n);
        [[0, -1], [-1, 0], [0, 1], [1, 0]].forEach(([rowOff, colOff]) => {
            const [newRow, newCol] = [row + rowOff, col + colOff];
            if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid.length &&
                !groups.has(str(newRow, newCol)) && used(row, col)) {
                search(row + rowOff, col + colOff, n);
            }
        });
    }

    let grpCount = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid.length; col++) {
            if (groups.has(str(row, col))) { continue; }
            if (used(row, col)) {
                search(row, col, grpCount);
                grpCount++;
            }
        }
    }
    return grpCount;
}

const DATA = "hwlqcszp";
const GRID_N = 128;
const disk: string[] = [];
[...Array(GRID_N)].forEach((_, row) => disk[row] = hash(`${DATA}-${row}`));

const squares = disk.reduce((sum, h) => sum + (h.split("1").length - 1), 0);
console.log(`Used squares: ${squares}`);
console.log(`Number of regions: ${countGroups(disk)}`);
