/**
 * Wire World
 * https://rosettacode.org/wiki/Wireworld
 */

(() => {
	const { Automata } = require('../src/automata');

	const e = { state: 'empty', display: ' ' };
	const h = { state: 'head', display: 'H' };
	const t = { state: 'tail', display: 't' };
	const c = { state: 'conductor', display: '.' };
	const initRules = {
		grid: [
			[t, h, c, c, c, c, c, c, c, c, c],
			[c, e, e, e, c, e, e, e, e, e, e],
			[e, e, e, c, c, c, e, e, e, e, e],
			[c, e, e, e, c, e, e, e, e, e, e],
			[h, t, c, c, e, c, c, c, c, c, c],
		],
		options: { range: [{ cell: e, weight: 1 }] },
	};
	const stateRules = [
		(nbInfo, prev) => prev.state === 'empty' ? e : false,
		(nbInfo, prev) => prev.state === 'head' ? t : false,
		(nbInfo, prev) => prev.state === 'tail' ? c : false,
		(nbInfo, prev) =>
			prev.state === 'conductor' && (
				nbInfo.neighbors['head']?.count === 1 ||
				nbInfo.neighbors['head']?.count === 2)
				? h
				: false,
		(nbInfo, prev) => prev.state === 'conductor' ? c : false,
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

	test.run();
})();
