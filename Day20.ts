import fs = require("fs");

class Vector {
    public static create(csv: string) {
        const [a, b, c] = csv.split(",");
        return new Vector(+a, +b, +c);
    }
    constructor(public x: number, public y: number, public z: number) { }
    public add = (vec: Vector) => new Vector(vec.x + this.x, vec.y + this.y, vec.z + this.z);
    public toString = () => `${this.x},${this.y},${this.z}`;
    public copy = () => new Vector(this.x, this.y, this.z);
}

class Particle {
    constructor(public pos: Vector, public vel: Vector, public acc: Vector) { }
    public dist = () => Math.abs(this.pos.x) + Math.abs(this.pos.y) + Math.abs(this.pos.z);
    public step() {
        this.vel = this.vel.add(this.acc);
        this.pos = this.pos.add(this.vel);
    }
    public copy = () => new Particle(this.pos.copy(), this.vel.copy(), this.acc.copy());
}

const ITERS = 1000;
const particles = fs.readFileSync("data/day20.txt", "utf8").split("\r\n").map((str) => {
    const [_, p, v, a] =
        (str.match("p=<([-|0-9|,]+)>, v=<([-|0-9|,]+)>, a=<([-|0-9|,]+)>") as RegExpMatchArray);
    return new Particle(Vector.create(p), Vector.create(v), Vector.create(a));
});

const collParticles = particles.map((p) => p.copy());
for (let i = 0; i < ITERS; i++) {
    particles.forEach((p) => p.step());
    collParticles.forEach((p) => p.step());

    const map = new Map<string, number[]>();
    for (let j = 0; j < collParticles.length; j++) {
        const pos = collParticles[j].pos.toString();
        map.set(pos, (map.get(pos) || []).concat([j]));
    }
    if (map.size < collParticles.length) {
        Array<number>().concat(...[...map.entries()].filter(([k, v]) => v.length > 1)
            .map(([_, v]) => v)).sort((a, b) => a - b).reverse()
            .forEach((idx) => collParticles.splice(idx, 1));
    }
}

const minIndex = particles
    .map((p) => Math.abs(p.pos.x) + Math.abs(p.pos.y) + Math.abs(p.pos.z))
    .reduce(([min, iMin], dist, i) => dist < min ? [dist, i] : [min, iMin], [Infinity, -1])[1];

console.log(`Particle eventually, minimally distant from origin: ${minIndex}`);
console.log(`Number of particles remaining after collisions: ${collParticles.length}`);
