/**
 * Cellular Automata Generator
 */

import {
	Cell,
	Grid,
	Options,
	GridState,
	Rule,
	StateRules,
	InitialRules,
	RunningRules
} from './automata-types';

/**
 * Cellular Automata Class containing all logic to update and display the [[Grid]]
 */
export default class Automata {

	/** State Rules of the Cellular Automaton*/
	rules: Rule[] = [];

	/** Number of rows in the[[Automata]][[Grid]] */
	rows: number = 25;
	/** Number of columns in the [[Automata]] [[Grid]] */
	cols: number = 25;
	/** [[Grid]] of the Cellular Automata */
	grid: Grid = [];
	/** [[Options]] */
	options: Options = { range: [{ cell: { state: 0, display: '0' }, probability: 1 }] };

	/** Number of milliseconds between updates */
	msPerStep: number = 100;
	/** Iteration Number of the Simulation */
	iteration: number = 0;
	/** Upper Bound of [[iteration]] */
	maxIterations: number = 500;

	constructor(initRules: InitialRules, stateRules?: StateRules, runningRules?: RunningRules) {
		this.rules = stateRules || this.rules;
		const { msPerStep, iteration, maxIterations } = runningRules;
		this.msPerStep = msPerStep || this.msPerStep;
		this.iteration = iteration || this.iteration;
		this.maxIterations = maxIterations || this.maxIterations;
		const { rows, cols, grid, options } = initRules;
		this.rows = grid?.length || rows || this.rows;
		this.cols = grid?.length || cols || this.cols;
		this.grid = grid || this.grid;
		this.options = options;
	}

	/** Sleep Utility Function */
	sleep(): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, this.msPerStep));
	}

}


// function generateGrid(options?: Options): Grid {
// 	const opts: Options = {
// 		random: false,
// 		range: [
// 			{ cell: { state: 0, display: '0' }, probability: 0.7 },
// 			{ cell: { state: 1, display: '1' }, probability: 0.3 },
// 		],
// 		...options,
// 	};
// 	const grid: Grid = [];
// 	for (let row = 0; row < rows; row++) {
// 		grid.push([]);
// 		for (let col = 0; col < cols; col++) {
//			TODO: Update logic to include Cell
// 			grid[row].push(opts.random
//				? randomInRange(opts.low, opts.high)
//				: opts.low
//			);
// 		}
// 	}
// 	return grid;
// }


// function printGrid(grid: Grid): void {
// 	console.clear();
// 	console.log(`Iteration: ${iteration++}`);
// 	console.log(grid.map(row => row.join('')).join('\n'));
// }

// function updateGrid(grid: Grid, rules): GridState {
// 	const tempGrid: Grid = generateGrid();
// 	let change: boolean = false;
// 	for (let row = 0; row < rows; row++) {
// 		for (let col = 0; col < cols; col++) {
// 			const numNeighbors: number = getNeighbors(grid, row, col);
// 			const status: Cell = checkRules(rules, numNeighbors, grid[row][col]);
// 			tempGrid[row][col] = status;
// 			if (tempGrid[row][col] !== grid[row][col])
// 				change = true;
// 		}
// 	}
// 	return { grid: tempGrid, change };
// }

// function getNeighbors(grid: Grid, r, c) {
// 	let count = 0;
// 	const directions = [
// 		[+0, +1],
// 		[+1, +1],
// 		[+1, +0],
// 		[+1, -1],
// 		[+0, -1],
// 		[-1, -1],
// 		[-1, +0],
// 		[-1, +1],
// 	];
// 	directions.forEach(([offX, offY]) => {
// 		const newR = r + offX;
// 		const newC = c + offY;
// 		if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
// 			TODO: Update Logic for Cell
// 			count = grid[newR][newC] !== 0
// 				? count + 1
// 				: count;
// 		}
// 	});
// 	return count;
// }

// TODO: Update CheckRules after figuring out rules format
// function checkRules(rules, n: number, prev: Cell) {
// 	let status: Cell;
// 	for (let i = 0; i < rules.length; i++) {
// 		status = rules[i](n);
// 		if (status !== false)
// 			return status.res;
// 	}
// 	return prev;
// }
