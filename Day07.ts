import fs = require("fs");

function build(data: string[]): [Map<string, number>, Map<string, string[]>] {
    const weights = new Map<string, number>();
    const adj = new Map<string, string[]>();
    const dataPattern = /^([a-z]+) \((\d+)\)/;
    const progPattern = /-> (.+)$/;
    for (const line of data) {
        const [_, id, weight] = line.match(dataPattern) as RegExpMatchArray;
        weights.set(id, parseInt(weight, 10));
        const progList = line.match(progPattern);
        if (progList !== null) {
            adj.set(id, progList[1].split(", "));
        }
    }
    return [weights, adj];
}

function calcTotals(weights: Map<string, number>, adjs: Map<string, string[]>, root: string) {
    const totals = new Map<string, number>();

    function calc(id: string): number {
        if (totals.has(id)) {
            return totals.get(id) as number;
        }

        const total = (weights.get(id) as number) +
            (adjs.get(id) || []).reduce((sum, above, i, a) => sum += calc(above), 0);
        totals.set(id, total);
        return total;
    }

    calc(bottom);
    return totals;
}

function unbalanced(totals: Map<string, number>, adjs: Map<string, string[]>, root: string) {
    function find(id: string, balance: number): [string, number] {
        const weightCount = new Map<number, string[]>();
        (adjs.get(id) || []).forEach((above) => {
            const weight = totals.get(above) as number;
            weightCount.set(weight, (weightCount.get(weight) || []).concat(above));
        });

        if (weightCount.size === 1) {
            return [id, balance];
        }

        const sorted = [...weightCount.entries()]
            .sort(([wA, idsA], [wB, idsB]) => idsA.length - idsB.length);
        return find(sorted[0][1][0], sorted[1][0] - sorted[0][0]);
    }

    return find(root, 0);
}

const [weightMap, adjMap] = build(fs.readFileSync("data/day07.txt", "utf8").split("\r\n"));
const allAbove = ([] as string[]).concat(...(adjMap.values() as IterableIterator<string[]>));
const bottom = [...adjMap.keys()].find((id) => allAbove.indexOf(id) === -1) || "";

console.log(bottom);

const totalsMap = calcTotals(weightMap, adjMap, bottom);
const [node, offset] = unbalanced(totalsMap, adjMap, bottom);
console.log(node, (weightMap.get(node) as number) + offset);
