import * as SSEChannel from 'sse-pubsub';
import {
  GAMESTATE_INIT, GAMESTATE_NEWPLAYER, GAMESTATE_PLAYING, GAMESTATE_FINISHED, GAME_DURATION_MS, GAMESTATE_DEAD,
  HIGHER_IS_BETTER
} from '../constants.js';
import POPS from '../data/pops.js';
import METRICS from '../data/metrics.js';
import Stats, { compare as compareStats }  from './stats/index.js';

const PUBLIC_PROPS = ['id', 'state', 'createdTime', 'startTime', 'eventCount', 'metric', 'players', 'activePlayer', 'results', 'winningPop', 'winningValue'];
const UPDATE_FREQ = 200;
const AVATARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const NAMES = [
  'Professor Purge',
  'Captain Cache',
  'Dr Domain',
  'Marshall Traffic',
  'General Case',
  'Major Priority',
  'Count Bandwidth',
  'President Powderhorn',
  'Agent Peer',
  'Chief Teecie Pee',
  'Dr Dee Eness',
  'Agent Origin Shield',
  'Major Surge',
  'Leutenant Latency',
  'Senator Syn',
  'Admiral Ack'
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFrom = arr => arr[Math.floor(Math.random()*arr.length)];
const isFirst = (a, b, dir) => (dir === HIGHER_IS_BETTER) ? a > b : b > a;

export default class Game {
  constructor(id, eventCallback) {
    this.id = id;
    this.stream = new SSEChannel();
    this.state =  GAMESTATE_INIT;
    this.createdTime = Date.now();
    this.startTime = null;
    this.eventCount = 0;
    this.results = {};
    this.winningPop = null;
    this.winningValue = null;
    this.metric = null;
    this.players = [];
    this.gameTimer = null;
    this.activePlayer = null;
    this.data = [];
    this.Stat = null;
    this.emit = eventCallback;
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

  playerSelect() {
    this.emit('playerSelect');
  }

  playerNavigate(offset) {
    this.emit('playerControl', offset);
  }

  gameFrame() {
    const metricDir = METRICS.find(m => m.code === this.metric).winDirection;
    const data = Object.keys(this.data).reduce((out, popCode) => ({
      ...out,
      [popCode]: this.data[popCode].getSnapshot()
    }), {});
    data.winning = compareStats(this.data, 'snapshot', metricDir);
    this.emit('gameData', data);
    if (this.startTime + GAME_DURATION_MS < Date.now()) {
      clearTimeout(this.gameTimer);
      this.state = GAMESTATE_FINISHED;
      this.results = Object.keys(this.data).map(popCode => {
        const { name, avatar } = this.players.find(p => p.pop === popCode);
        const { name: popName } = POPS.find(p => p.code === popCode);
        return {
          popCode,
          popName,
          name,
          avatar,
          value: this.data[popCode].getAggregate()
        };
      }).sort((a, b) => isFirst(a.value, b.value, metricDir) ? -1 : 1);
      this.winningPop = compareStats(this.data, 'aggregate', metricDir);
      this.winningValue = this.data[this.winningPop].getAggregate();
      this.publish();
    }
  }

  addEvent(popCode, metricData) {
    if (metricData[this.metric] !== null) {
      this.eventCount++;
      this.data[popCode].insert(metricData[this.metric]);
    }
  }

  end() {
    this.state = GAMESTATE_DEAD;
    this.publish();
  }

  publish() {
    this.emit('gameUpdate', this.toPublic());
  }

  toPublic() {
    return PUBLIC_PROPS.reduce((out, k) => ({ [k]: this[k], ...out }), {});
  }
}
