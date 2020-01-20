import Percentage from "./Percentage";
import Numeric from "./Numeric";
import Diversity from "./Diversity";
import { HIGHER_IS_BETTER, LOWER_IS_BETTER } from '../../constants.js';

export default {
  'percentage': Percentage,
  'diversity': Diversity,
  'milliseconds': Numeric,
  'segs': Numeric,
  'kbps': Numeric
};

export function compare(instances, basis, direction) {
  const method = basis === 'snapshot' ? 'getSnapshot' : 'getAggregate';
  let bestVal, winner;
  Object.entries(instances).forEach(([key, i]) => {
    var v = i[method]();
    if ((direction === HIGHER_IS_BETTER && v > bestVal) || (direction === LOWER_IS_BETTER && v < bestVal) || bestVal === undefined) {
      bestVal = v;
      winner = key;
    }
  });
  return winner;
}
