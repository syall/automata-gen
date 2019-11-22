/**
 * Cellular Automata Generator
 */

/**
 * Representing State and Character of a Cell in the [[Grid]]
 */
interface Cell {
	/** State associated with the Cell */
	state: String | number;
	/** Character to display when [[printGrid]] is used */
	display: String;
}

/**
 * Universe of the Cellular Automata
 */
type Grid = Cell[][];

interface InitCell {
	cell: Cell;
	probability: number;
}

interface Options {
	random?: Boolean;
	range?: InitCell[];
}

interface GridState {
	grid: Grid;
	change: boolean;
}

// TODO: Find type for Rules Parser

const rows: number = Number.parseInt(process.argv[3]) || 30;
const cols: number = Number.parseInt(process.argv[4]) || 30;
const stepMs: number = 100;
const maxIterations: number = 500;
let iteration: number = 0;

// TODO: Figure out rules format
function rulesParser(path: string) {
	const fs = require('fs');
	const content: String = fs.readFileSync(path).toString();
	const rmws = (r: String): Boolean => r !== '';
	const stmts = content
		.split('\n')
		.filter(rmws)
		.map(r => {
			const condRes = r.split(':');
			return {
				cond: condRes[0].split(' ').filter(rmws),
				res: Number.parseInt(condRes[1].trim()),
			};
		});
	const parsed = stmts.map(stmt => {
		const [neighbors, compare, num] = stmt.cond;
		const number = Number.parseInt(num);
		switch (compare) {
			case '<':
				return n => n < number ? { res: stmt.res } : false;
			case '<=':
				return n => n <= number ? { res: stmt.res } : false;
			case '>':
				return n => n > number ? { res: stmt.res } : false;
			case '>=':
				return n => n >= number ? { res: stmt.res } : false;
			case '=':
				return n => n === number ? { res: stmt.res } : false;
			case '!=':
				return n => n !== number ? { res: stmt.res } : false;
			default:
				return n => { return { res: stmt.res }; };
		}
	});
	return parsed;
}

function generateGrid(options?: Options): Grid {
	const opts: Options = {
		random: false,
		range: [
			{ cell: { state: 0, display: '0' }, probability: 0.7 },
			{ cell: { state: 1, display: '1' }, probability: 0.3 },
		],
		...options,
	};
	const grid: Grid = [];
	for (let row = 0; row < rows; row++) {
		grid.push([]);
		for (let col = 0; col < cols; col++) {
			// TODO: Update logic to include Cell
			// grid[row].push(opts.random
			// 	? randomInRange(opts.low, opts.high)
			// 	: opts.low
			// );
		}
	}
	return grid;
}

// TODO: Differentiate Random based on InitCell
function randomInRange(low, high) {
	return Math.floor(Math.random() * (high - low + 1)) + low;
}

function printGrid(grid: Grid): void {
	console.clear();
	console.log(`Iteration: ${iteration++}`);
	console.log(grid.map(row => row.join('')).join('\n'));
}

function updateGrid(grid: Grid, rules): GridState {
	const tempGrid: Grid = generateGrid();
	let change: boolean = false;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const numNeighbors: number = getNeighbors(grid, row, col);
			const status: Cell = checkRules(rules, numNeighbors, grid[row][col]);
			tempGrid[row][col] = status;
			if (tempGrid[row][col] !== grid[row][col])
				change = true;
		}
	}
	return { grid: tempGrid, change };
}

function getNeighbors(grid: Grid, r, c) {
	let count = 0;
	const directions = [
		[+0, +1],
		[+1, +1],
		[+1, +0],
		[+1, -1],
		[+0, -1],
		[-1, -1],
		[-1, +0],
		[-1, +1],
	];
	directions.forEach(([offX, offY]) => {
		const newR = r + offX;
		const newC = c + offY;
		if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
			// TODO: Update Logic for Cell
			// count = grid[newR][newC] !== 0
			// 	? count + 1
			// 	: count;
		}
	});
	return count;
}

// TODO: Update CheckRules after figuring out rules format
function checkRules(rules, n: number, prev: Cell) {
	let status: Cell;
	for (let i = 0; i < rules.length; i++) {
		status = rules[i](n);
		// if (status !== false)
		// 	return status.res;
	}
	return prev;
}

/** @ignore */
function sleep(milliseconds: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function main(): Promise<void> {
	console.log('Loading...');
	const rules = process.argv[2]
		? rulesParser(`rules/${process.argv[2]}`)
		: rulesParser('rules/default.txt');
	let mainGrid: Grid = generateGrid({ random: true });
	let running: boolean = true;
	while (running) {
		printGrid(mainGrid);
		const { grid: tempGrid, change }: GridState = updateGrid(mainGrid, rules);
		mainGrid = tempGrid;
		running = change && iteration < maxIterations;
		await sleep(stepMs);
	}
	process.exit();
}

main();
