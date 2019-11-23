/**
 * Cellular Automata Generator
 */

import {
	Cell,
	Grid,
	Options,
	Rule,
	StateRules,
	InitialRules,
	RunningRules,
	NeighborState,
	NeighborInfo
} from './automata-types';

/**
 * Cellular Automata Class containing all logic to update and display the [[Grid]]
 */
export class Automata {

	/** State Rules of the Cellular Automaton*/
	public rules: Rule[] = [];

	/** Number of rows in the[[Automata]][[Grid]] */
	readonly rows: number = 25;
	/** Number of columns in the [[Automata]] [[Grid]] */
	readonly cols: number = 25;
	/** [[Grid]] of the Cellular Automata */
	public grid: Grid = [];

	/** Default Blank State */
	public defaultCell: Cell = { state: 0, display: '0' };

	/** [[Options]] */
	public options: Options = { random: false, range: [{ cell: this.defaultCell, weight: 1 }] };

	/** Number of milliseconds between updates */
	public msPerStep: number = 100;
	/** Iteration Number of the Simulation */
	private iteration: number = 0;
	/** Upper Bound of [[iteration]] */
	public maxIterations: number = 500;
	/** Whether the simulation is running */
	private running: boolean = false;

	/**
	 * To create an Automata, provide [[InitialRules]], optional [[StateRules]],
	 * and [[RunningRules]].
	 */
	constructor(initRules: InitialRules, stateRules?: StateRules, runningRules?: RunningRules) {
		this.rules = stateRules || this.rules;
		this.msPerStep = runningRules?.msPerStep || this.msPerStep;
		this.maxIterations = runningRules?.maxIterations || this.maxIterations;
		this.rows = initRules?.grid?.length || initRules?.rows || this.rows;
		this.cols = initRules?.grid?.length > 0 ? initRules?.grid[0].length : false || initRules?.cols || this.cols;
		this.grid = initRules?.grid || this.grid;
		this.options = { ...this.options, ...initRules.options };
	}

	public generateGrid(fill: boolean = true): Grid {
		const tempGrid: Grid = [];
		const totalWeight: number = this.calculateTotalWeight();
		for (let row = 0; row < this.rows; row++) {
			tempGrid.push([]);
			for (let col = 0; col < this.cols; col++) {
				tempGrid[row].push(
					fill && this.options.random
						? this.getRandomCell(totalWeight)
						: this.defaultCell
				);
			}
		}
		if (fill) {
			this.grid = tempGrid;
			this.iteration = 0;
		}
		return tempGrid;
	}

	private calculateTotalWeight() {
		let total = 0;
		const { range } = this.options;
		for (let i = 0; i < range.length; i++)
			total += range[i].weight;
		return total;
	}

	private getRandomCell(totalWeight): Cell {
		if (totalWeight === 0)
			return this.defaultCell;
		let random = Math.random() * Math.floor(totalWeight);
		const { range } = this.options;
		for (let i = 0; i < range.length; i++) {
			if (random < range[i].weight)
				return range[i].cell;
			random -= range[i].weight;
		}
		return this.defaultCell;
	}

	public updateGrid(): void {
		const tempGrid: Grid = this.generateGrid(false);
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const nbInfo: NeighborInfo = this.getNeighbors(row, col);
				tempGrid[row][col] = this.checkRules(nbInfo, this.grid[row][col]);
			}
		}
		this.grid = tempGrid;
	}

	private getNeighbors(row: number, col: number): NeighborInfo {
		const record: Record<number | string, NeighborState> = {};
		let count: number = 0;
		const directions: [number, number][] = [
			[+0, +1],
			[+1, +1],
			[+1, +0],
			[+1, -1],
			[+0, -1],
			[-1, -1],
			[-1, +0],
			[-1, +1],
		];
		directions.forEach(([offX, offY]: [number, number]): void => {
			const newR: number = row + offX;
			const newC: number = col + offY;
			if (newR >= 0 && newR < this.rows && newC >= 0 && newC < this.cols) {
				const { state } = this.grid[newR][newC];
				record[state] = record[state]
					? {
						cell: record[state].cell,
						count: record[state].count + 1,
					}
					: {
						cell: this.grid[newR][newC],
						count: 1,
					};
				count = state === 0 ? count : count + 1;
			}
		});
		return {
			neighbors: record,
			count,
		};
	}

	private checkRules(nbInfo: NeighborInfo, prev: Cell): Cell {
		for (let i = 0; i < this.rules.length; i++) {
			const status = this.rules[i](nbInfo, prev);
			if (status) return status;
		}
		return prev;
	}

	public printGrid(): void {
		console.log(`Iteration: ${this.iteration}`);
		console.log(this.toString());
	};

	public toString(): string {
		return this.grid.map(row => row.map(cell => cell.display).join('')).join('\n');
	};

	public async run(): Promise<void> {
		this.running = true;
		console.clear();
		await this.printGrid();
		while (this.running && this.iteration < this.maxIterations) {
			await this.sleep();
			await this.updateGrid();
			this.iteration++;
			console.clear();
			await this.printGrid();
		}
		this.running = false;
	}

	/** Sleep Utility Function */
	private sleep(): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, this.msPerStep));
	}

}
