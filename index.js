/**
 * Game of Life
 */

const rows = process.argv[3] || 30;
const cols = process.argv[4] || 30;
const stepMs = 100;
const maxIterations = 500;
let iteration = 0;

function rulesParser(path) {
	const fs = require('fs');
	const content = fs.readFileSync(path).toString();
	const rmws = r => r !== '';
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

function generateGrid(options) {
	const opts = {
		random: false,
		low: 0,
		high: 1,
		...options,
	};
	const grid = [];
	for (let row = 0; row < rows; row++) {
		grid.push([]);
		for (let col = 0; col < cols; col++)
			grid[row].push(opts.random
				? randomInRange(opts.low, opts.high)
				: opts.low
			);
	}
	return grid;
}

function randomInRange(low, high) {
	return Math.floor(Math.random() * (high - low + 1)) + low;
}

function printGrid(grid) {
	console.clear();
	console.log(`Iteration: ${iteration++}`);
	console.log(grid.map(row => row.join('')).join('\n'));
}

function updateGrid(grid, rules) {
	const tempGrid = generateGrid();
	let change = false;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const numNeighbors = getNeighbors(grid, row, col);
			const status = checkRules(rules, numNeighbors, grid[row][col]);
			tempGrid[row][col] = status;
			if (tempGrid[row][col] !== grid[row][col])
				change = true;
		}
	}
	return [tempGrid, change];
}

function getNeighbors(grid, r, c) {
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
			count = grid[newR][newC] !== 0
				? count + 1
				: count;
		}
	});
	return count;
}

function checkRules(rules, n, prev) {
	let status;
	for (let i = 0; i < rules.length; i++) {
		status = rules[i](n);
		if (status !== false)
			return status.res;
	}
	return prev;
}

function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

(async function main() {
	console.log('Loading...');
	const rules = process.argv[2]
		? rulesParser(process.argv[2])
		: rulesParser('default.txt');
	let mainGrid = generateGrid({ random: true });
	let running = true, change = false;
	while (running) {
		printGrid(mainGrid);
		[mainGrid, change] = updateGrid(mainGrid, rules);
		running = change && iteration < maxIterations;
		await sleep(stepMs);
	}
	process.exit();
})();
