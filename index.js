/**
 * Game of Life
 */

const rows = process.argv[2] || 10;
const cols = process.argv[3] || 10;
const rules = process.argv[4]
	? rulesParser(process.argv[4])
	: rulesParser('default.txt');

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
		const [neighbors, compare, number] = stmt.cond;
		switch (compare) {
			case '<':
				return n => n < number ? stmt.res : 0;
			case '<=':
				return n => n <= number ? stmt.res : 0;
			case '>':
				return n => n > number ? stmt.res : 0;
			case '>=':
				return n => n >= number ? stmt.res : 0;
			case '=':
				return n => n === number ? stmt.res : 0;
			case '!=':
				return n => n !== number ? stmt.res : 0;
			default:
				return n => stmt.res;
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
	console.log(grid.map(row => row.join('')).join('\n'));
}

const randomGrid = generateGrid({ random: true });
printGrid(randomGrid);
