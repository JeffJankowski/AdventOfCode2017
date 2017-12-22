import fs = require("fs");

enum Dir { Up, Right, Down, Left }
enum State { Clean, Weakened, Infected, Flagged }
const turn = (facing: Dir, move: Dir) => ((facing + (move === Dir.Left ? -1 : 1) + 4) % 4) as Dir;
const rev = (facing: Dir) => ((facing + 2) % 4) as Dir;

class VirusSim {
    private dirLUT: {[dir: number]: [number, number]} = {
        0: [0, 1],
        1: [1, 0],
        2: [0, -1],
        3: [-1, 0],
    };
    constructor(private map: Map<string, State>, private stepFunc:
        (state: State, dir: Dir, key: string, map: Map<string, State>) => [Dir, boolean]) { }
    public run(bursts: number) {
        let pos: [number, number] = [0, 0];
        let dir = Dir.Up;
        let infects = 0;
        for (let burst = 0; burst < bursts; burst++) {
            const key = toStr(pos);
            const [newDir, infect] = this.stepFunc(this.map.get(key) || State.Clean, dir, key, this.map);
            if (infect) {infects++; }
            dir = newDir;
            const offset = this.dirLUT[dir] || [];
            pos = [pos[0] + offset[0], pos[1] + offset[1]];
        }
        return infects;
    }
}

const toStr = ([x, y]: [number, number]) => `${x},${y}`;
function buildMap(grid: string[][]) {
    const map = new Map<string, State>();
    const [xLen, yLen] = [Math.floor(grid[0].length / 2), Math.floor(grid.length / 2)];
    for (let i = yLen; i >= -yLen; i--) {
        for (let j = -xLen; j <= xLen; j++) {
            if (grid[yLen - i][j + xLen] === "#") { map.set(toStr([j, i]), State.Infected); }
        }
    }
    return map;
}

const nodeMap = buildMap(fs.readFileSync("data/day22.txt", "utf8").split("\r\n").map((s) => s.split("")));
const nodeFunc = (state: State, dir: Dir, key: string, map: Map<string, State>): [Dir, boolean] => {
    const clean = state === State.Clean;
    if (clean) { map.set(key, State.Infected); } else { map.delete(key); }
    return [turn(dir, clean ? Dir.Left : Dir.Right) , state === State.Clean];
};
const evolveMap = new Map(nodeMap);
const evolveFunc = (state: State, dir: Dir, key: string, map: Map<string, State>): [Dir, boolean] => {
    switch (state) {
        case State.Clean:
            map.set(key, State.Weakened);
            return [turn(dir, Dir.Left), false];
        case State.Weakened:
            map.set(key, State.Infected);
            return [dir, true];
        case State.Flagged:
            map.delete(key);
            return [rev(dir), false];
        case State.Infected:
            map.set(key, State.Flagged);
            return [turn(dir, Dir.Right), false];
    }
};
console.log(`Infected after 10000 bursts: ${new VirusSim(nodeMap, nodeFunc).run(1E4)}`);
console.log(`Infected after 10000000 evolved bursts: ${new VirusSim(evolveMap, evolveFunc).run(1E7)}`);
