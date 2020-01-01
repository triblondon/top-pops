/**
 * Percentage Stat
 *
 * This metric type takes boolean events and calculates a percentage
 * which is the proportion which are true.  The snapshot uses a
 * rolling-window history (which should be fairly large), and the
 * final aggregate is the mean.
 */

const HISTORY_LENGTH = 500;

const arrayMean = arr => arr.reduce((sum, item) => sum + item, 0) / arr.length;

export default class Percentage {

	constructor() {
		this.total = 0;
		this.count = 0;
		this.history = [];
	}

	insert(value) {
		const normalisedValue = value ? 1 : 0;
		this.total += normalisedValue;
		this.count++;
		this.history.push(normalisedValue);
		if (this.history.length > HISTORY_LENGTH) this.history.shift();
	}

	getSnapshot() {
		const mean = arrayMean(this.history);
		return Math.round(mean * 10000) / 100;
	}

	getAggregate() {
		const mean = this.total / this.count;
		return Math.round(mean * 10000) / 100;
	}
}
