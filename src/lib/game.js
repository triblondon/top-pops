import * as SSEChannel from 'sse-pubsub';
import { GAMESTATE_INIT, GAMESTATE_NEWPLAYER, GAMESTATE_PLAYING, GAMESTATE_FINISHED, GAME_DURATION_MS, GAMESTATE_DEAD } from '../constants.js';
import POPS from '../data/pops.js';
import METRICS from '../data/metrics.js';
import Stats, { compare as compareStats }  from './stats/index.js';

const PUBLIC_PROPS = ['id', 'state', 'createdTime', 'startTime', 'eventCount', 'metric', 'players', 'activePlayer', 'result', 'winningPop'];
const UPDATE_FREQ = 200;
const AVATARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const NAMES = [
	'Professor Beetlejuice',
	'Captain Cygnus Cache',
	'Dr Apex Domain',
	'Marshall Proteus Phoenix',
	'Major Spdy Scorpulo',
	'Count Bandwidth',
	'President Everest Powerhorn',
	'Agent Delphinus Peer',
	'Chief Teecie Pee',
	'Dr Dee Eness',
	'Agent Origin Shield',
	'Major Surge',
	'Director Lupus Latency'
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFrom = arr => arr[Math.floor(Math.random()*arr.length)];

export default class Game {
	constructor(id) {
		this.id = id;
		this.stream = new SSEChannel();
		this.state =  GAMESTATE_INIT;
		this.createdTime = Date.now();
		this.startTime = null;
		this.eventCount = 0;
		this.result = {};
		this.winningPop = null;
		this.metric = null;
		this.players = [];
		this.gameTimer = null;
		this.activePlayer = null;
		this.data = [];
		this.Stat = null;
	}

	addPlayer() {
		const name = randomFrom(NAMES.filter(n => !this.players.some(p => p.name === n)));
		const avatar = randomFrom(AVATARS.filter(a => !this.players.some(p => p.avatar === a)));
		const player = { id: this.players.length + 1, name, avatar, isConfirmed: false, pop: null };
		this.players.push(player);
		this.activePlayer = player.id;
		this.state = GAMESTATE_NEWPLAYER;
		if (this.players.length === 1) {
			player.pop = POPS[randomInt(0, POPS.length-1)].code;
		}
		this.publish();
		return player;
	}

	setMetric(metric) {
		this.metric = metric;
		this.state = GAMESTATE_INIT;
		this.activePlayer = null;
		const metricType = METRICS.find(m => m.code === this.metric).type;
		this.Stat = Stats[metricType];
		this.publish();
	}

	setPlayerPOP(playerID, pop) {
		this.players.find(p => p.id === playerID).pop = pop;
		this.activePlayer = false;
		this.state = GAMESTATE_INIT;
		this.publish();
	}


	usesPOP(popCode) {
		return this.players.some(p => p.pop === popCode);
	}

	isPlaying() {
		return this.state === GAMESTATE_PLAYING;
	}

	start() {
		this.state = GAMESTATE_PLAYING;
		this.startTime = Date.now();
		this.data = this.players.reduce((out, p) => ({
			...out,
			[p.pop]: new this.Stat()
		}), {});
		this.publish();
		this.gameTimer = setInterval(this.gameFrame.bind(this), UPDATE_FREQ);
	}

	gameFrame() {
		const data = Object.keys(this.data).reduce((out, popCode) => ({
			...out,
			[popCode]: this.data[popCode].getSnapshot()
		}), {});
		data.winning = compareStats(this.data, 'snapshot');
		console.log('data', data);
		this.stream.publish(data, 'running-metrics');
		if (this.startTime + GAME_DURATION_MS < Date.now()) {
			clearTimeout(this.gameTimer);
			this.state = GAMESTATE_FINISHED;
			this.result = Object.keys(this.data).reduce((out, popCode) => ({
				...out,
				[popCode]: this.data[popCode].getAggregate()
			}), {});
			this.winningPop = compareStats(this.data, 'aggregate');
			this.publish();
		}
	}

	addEvent(popCode, metricData) {
		this.eventCount++;
		this.data[popCode].insert(metricData[this.metric]);
	}

	end() {
		this.state = GAMESTATE_DEAD;
		this.publish();
	}

	publish() {
		this.stream.publish(this.toPublic(), 'gameupdate');
	}

	toPublic() {
		return PUBLIC_PROPS.reduce((out, k) => ({ [k]: this[k], ...out }), {});
	}
}
