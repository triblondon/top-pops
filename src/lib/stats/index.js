import Percentage from "./Percentage";
import Numeric from "./Numeric";
import Diversity from "./Diversity";

export default {
	'percentage': Percentage,
	'diversity': Diversity,
	'milliseconds': Numeric,
	'bytes': Numeric,
	'bps': Numeric
};

export function compare(instances, basis) {
	const method = basis === 'snapshot' ? 'getSnapshot' : 'getAggregate';
	let bestVal, winner;
	Object.entries(instances).forEach(([key, i]) => {
		var v = i[method]();
		if (v > bestVal || bestVal === undefined) {
			bestVal = v;
			winner = key;
		}
	});
	return winner;
}
