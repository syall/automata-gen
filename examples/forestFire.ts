/**
 * Forest Fire
 * https://rosettacode.org/wiki/Forest_fire
 */

(() => {
	const { Automata } = require('../src/automata');

	const emptyCell = { state: 'empty', display: ' ' };
	const treeCell = { state: 'tree', display: '🌲' };
	const burningCell = { state: 'burning', display: '🔥' };
	const probabilityBurn: number = 0.001;
	const probabilityTree: number = 0.01;
	const initRules = {
		options: {
			random: true,
			range: [
				{ cell: emptyCell, weight: 3 },
				{ cell: treeCell, weight: 7 },
			]
		},
	};
	const stateRules = [
		(nbInfo, prev) => prev.state === 'burning' ? emptyCell : false,
		(nbInfo, prev) =>
			prev.state === 'tree' && nbInfo.neighbors['burning']?.count >= 1
				? burningCell
				: false
		,
		(nbInfo, prev) => Math.random() < probabilityBurn ? burningCell : false,
		(nbInfo, prev) => Math.random() < probabilityTree ? treeCell : false,
	];
	const runningRules = {
		msPerStep: 100,
		maxIterations: 250,
	};

	const test = new Automata(
		initRules,
		stateRules,
		runningRules,
	);

	test.generateGrid();
	test.run();

})();
