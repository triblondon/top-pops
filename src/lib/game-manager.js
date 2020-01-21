import * as SSEChannel from 'sse-pubsub';
import Game from './game';
import POPS from '../data/pops.js';
import METRICS from '../data/metrics.js';

const games = new Map();
const sse = new SSEChannel();

let popReqCounts = POPS.reduce((out, p) => ({ ...out, [p.code]: 0 }), {});


export function get(gameId) {
  return games.get(gameId);
}

export function create(gameId) {
  const game = new Game(gameId, handleGameEvent.bind(null, gameId));
  games.set(gameId, game);
  return game;
}

// Ingest log lines
export function ingestData(strData) {

// example: DCA 1575265507502997 17329 1011 en 10 25676604 614
const LOG_EVENT_PATTERN = /^(?<pop>[A-Z]{3}) (?<startTime>\d+) (?<hittime>\d+) (?<h2>[10])(?<ipv6>[10])(?<tls>[10])(?<chr>[10]) (?<lang>[a-z]+) (?<cwnd>[\d]+) (?<pace>[\d]+) (?<rtt>[\d]+)$/;

  // Separate multiple events
  (strData || "").trim().split(/\n+/).filter(x => x && x.length).forEach(line => {

    // Match the fields based on known log line format
    const event = line.trim().match(LOG_EVENT_PATTERN);
    if (event) {
      const popCode = event.groups.pop.toUpperCase();
      const metricData = METRICS.reduce((out, m) => {
        let val = event.groups[m.code];
        if (/^[\d.]+$/.test(val)) val = Number.parseInt(val);
        return { ...out, [m.code]: val };
      }, {});

      // Normalise
      if (metricData.chr === '1') metricData.hittime = null;
      if (metricData.hittime) metricData.hittime = Number.parseFloat(metricData.hittime / 1000);  // us to ms
      if (metricData.rtt) metricData.rtt = Number.parseFloat(metricData.rtt / 1000);   // us to ms
      if (metricData.pace) metricData.pace = Number.parseFloat(metricData.pace / 1024);   // bytes to KB

      // For each game in progress, record the value relevant to that game
      games.forEach(game => {
        if (game.isPlaying() && game.usesPOP(popCode)) {
          game.addEvent(popCode, metricData);
        }
      });

      popReqCounts[popCode]++;
    }
  });
}

export function subscribe(gameId, req, res) {
  let events = ['popStats', new RegExp('^game'+gameId+'-')];
  sse.subscribe(req, res, events);
}

function handleGameEvent(gameId, eventName, data) {
  sse.publish(JSON.stringify(data), 'game'+gameId+'-'+eventName);
}


setInterval(() => {
  sse.publish(popReqCounts, 'popStats');
  popReqCounts = POPS.reduce((out, p) => ({ ...out, [p.code]: 0 }), {});
}, 500);
