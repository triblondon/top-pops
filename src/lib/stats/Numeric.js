/**
 * Numeric Stat
 *
 * This metric type takes numeric values and returns the mean
 * from a rolling history (which can be fairly short) as a
 * snapshot, and the estimated median as a final aggregate.
 */

import { GK as DataStruct } from 'streaming-percentiles';

const EPSILON = 0.1;
const HISTORY_LENGTH = 10;

const arrayMean = arr => arr.reduce((sum, item) => sum + item, 0) / arr.length;

export default class Duration {

  constructor() {
    this.data = new DataStruct(EPSILON);
    this.history = [];
  }

  insert(value) {
    const normalisedValue = Number.parseFloat(value);
    this.data.insert(normalisedValue);
    this.history.push(normalisedValue);
    if (this.history.length > HISTORY_LENGTH) this.history.shift();
  }

  getSnapshot() {
    const mean = arrayMean(this.history);
    return Number.parseFloat(mean.toPrecision(3));
  }

  getAggregate() {
    return Number.parseFloat(this.data.quantile(0.5).toPrecision(3));
  }
}
