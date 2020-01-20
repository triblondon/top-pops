/**
 * Diversity Stat
 *
 * This metric type takes string values and returns the number of
 * unique values that occur more than n% of the time.x
 */

const HISTORY_LENGTH = 500;
const THRESHOLD = 0.01;

export default class Diversity {

  constructor() {
    this.counts = {};
    this.totalCount = 0;
    this.history = [];
  }

  insert(value) {
    if (!(value in this.counts)) this.counts[value] = 0;
    this.counts[value]++;
    this.totalCount++;
    this.history.push(value);
    if (this.history.length > HISTORY_LENGTH) this.history.shift();
  }

  getSnapshot() {
    const start = Object.keys(this.counts).reduce((out, k) => ({ ...out, [k]: 0 }), {});
    const histCounts = this.history.reduce((out, val) => {
      out[val]++;
      return out;
    }, start);
    const minRequired = Math.floor(this.history.length * THRESHOLD);
    return Object.values(histCounts).filter(v => v > minRequired).length;
  }

  getAggregate() {
    const minRequired = Math.floor(this.totalCount * THRESHOLD);
    return Object.values(this.counts).filter(v => v > minRequired).length;
  }
}
