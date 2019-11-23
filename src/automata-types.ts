/**
 * All types for Class defined in [[Automata]]
 */

/**
 * Representing State and Character of a Cell in the [[Grid]]
 */
export interface Cell {
	/** State associated with the Cell */
	state: string | number;
	/** Character to display when [[printGrid]] is used */
	display: string;
}

/**
 * Universe of the Cellular Automata
 */
export type Grid = Cell[][];

/**
 * Wrapper for [[Cell]] with corresponding probability of spawning when
 * initializing the [[Grid]]
 */
export interface InitCell {
	/** [[Cell]] to Initiate with certain probability */
	cell: Cell;
	/** Probability of Cell to be initiated */
	weight: number;
}

/**
 * Options for creating a [[Grid]]
 */
export interface Options {
	/** Whether the [[Grid]] should be randomly generated with [[range]] */
	random?: Boolean;
	/**
	 * Corresponding Range of [[InitCell]]s that define the probability of Cells
	 * being initialized
	 */
	range: InitCell[];
}

/**
 * Neighbor Count of a Particular [[Cell]]
 */
export interface NeighborState {
	/** [[Cell]] being counted */
	cell: Cell;
	/** Number of that type of [[Cell]] */
	count: number;
}

/**
 * Wrapper for [[NeighborState]] with total Neighbor Count
 */
export interface NeighborInfo {
	neighbors: Record<number | string, NeighborState>;
	count: number;
}

/**
 * Functions that take in [[NeighborState]]s:
 * If matched a rule, return a [[Cell]].
 * Otherwise, return false.
 */
export type Rule = (states: NeighborInfo, prev: Cell) => Cell | false;

/**
 * Rules of State Change in the Cellular Automata
 */
export type StateRules = Rule[];

/**
 * Rules for Running the Cellular Automata Simulation
 */
export interface RunningRules {
	/** Number of milliseconds per [[updateGrid]] */
	msPerStep?: number;
	/** Upper Bound for [[iteration]] */
	maxIterations?: number;
}

/**
 * Rules for Initial State of the Cellular Automata
 */
export interface InitialRules {
	/** Number of rows in the [[Grid]] */
	rows?: number;
	/** Number of columnss in the [[Grid]] */
	cols?: number;
	/** Prefilled [[Grid]]: Must match rows? and cols? if present */
	grid?: Grid;
	/** Options for Generating the [[Grid]] */
	options: Options;
}
