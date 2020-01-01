import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid/v4';
import * as sapper from '@sapper/server';

import Game from './lib/game';
import POPS from './data/pops.js';
import METRICS from './data/metrics.js';
import { GAMESTATE_INIT } from './constants';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const LOG_EVENT_PATTERN = /^(?<pop>[A-Z]{3}) (?<startTime>\d+) (?<hittime>\d+) (?<h2>[10])(?<ipv6>[10])(?<tls>[10])(?<chr>[10]) (?<lang>[a-z]+) (?<cwnd>[\d]+) (?<pace>[\d]+) (?<rtt>[\d]+)$/;

const app = express();
const games = new Map();

app.use(express.static('static'));
app.use(bodyParser.text({ type: "text/*", limit: 1024 }));
app.use(bodyParser.json());

app.disable('x-powered-by');
app.disable('etag');

app.use((req, res, next) => {
  res.set({
    //'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': "SAMEORIGIN",
    'X-XSS-Protection': "1",
    'X-Content-Type-Options': "nosniff",
    'Referer-Policy': "origin-when-cross-origin",
    'Strict-Transport-Security': "max-age=86400"
  });
  next();
});

const requireGame = (req, res, next) => {
	const game = games.get(req.params.game_id);
	if (game) {
		req.game = game;
		next();
	} else {
		next(new Error('Game not found'));
	}
};

// Ingest log lines
// example: DCA 1575265507502997 17329 1011 en 10 25676604 614
function ingest(strData) {

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
			if (metricData.hittime) metricData.hittime = Number.parseFloat(metricData.hittime / 1000);

			// For each game in progress, record the value relevant to that game
      games.forEach(game => {
        if (game.isPlaying() && game.usesPOP(popCode)) {
					game.addEvent(popCode, metricData);
				}
      });
    }
  });
}
app.post('/ingest', (req, res) => {
	ingest(req.body);
  res.status(204);
  res.end();
});

app.get('/', (req, res) => {
  const gameID = uuid();
  res.redirect('/games/' + gameID);
});

app.get('/games/:game_id/play', requireGame, (req, res) => {
	if (req.game.state !== GAMESTATE_INIT) {
		return res.end("You can't join this game right now.  Reload to try again.");
	}
	const player = req.game.addPlayer();
  res.redirect('/games/' + req.params.game_id + '/players/' + player.id);
});


app.get('/api/pops', (req, res) => {
  res.json(POPS);
});
app.get('/api/metrics', (req, res) => {
  res.json(METRICS);
});

// List games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// Get game
app.get('/api/games/:game_id', (req, res) => {
  let game = games.get(req.params.game_id);
	if (!game) {
		game = new Game(req.params.game_id);
		games.set(req.params.game_id, game);
	}
  res.json(game.toPublic());
});

// Set game metric
app.post('/api/games/:game_id/setMetric', requireGame, (req, res) => {
  req.game.setMetric(req.body.metric);
  res.json(req.game.toPublic());
});

// Add player
app.post('/api/games/:game_id/addPlayer', requireGame, (req, res) => {
  const player = req.game.addPlayer();
  res.json(player);
});

// Player navigation commands
app.post('/api/games/:game_id/players/:player_id([0-9]+)/:command(movePrev|moveNext|select)', requireGame, (req, res) => {
	if (req.params.command === 'select') {
		req.game.stream.publish(null, 'player-select');
	} else {
		req.game.stream.publish(JSON.stringify(req.params.command === 'movePrev' ? -1 : 1), 'player-control');
	}
	res.status(204);
	res.end();
});

// Set player POP
app.post('/api/games/:game_id/players/:player_id([0-9]+)/setPOP', requireGame, (req, res) => {
	req.game.setPlayerPOP(Number.parseInt(req.params.player_id), req.body.pop);
	res.status(204);
	res.end();
});

// Start game
app.post('/api/games/:game_id/start', requireGame, (req, res) => {
	req.game.start();
	res.status(204);
	res.end();
});

// End game
app.post('/api/games/:game_id/end', requireGame, (req, res) => {
	req.game.end();
	res.status(204);
	res.end();
});


app.get('/api/games/:game_id/stream', requireGame, (req, res) => {
	req.game.stream.subscribe(req, res);
});



app.all('/.well-known/fastly/logging/challenge', (req, res) => {
  res.end("TODO log challenge response");
});

app.use(sapper.middleware());

app.listen(PORT, () => console.log('Server up'));




/* Simulator */

const randomBool = (p) => Math.random() < p ? 1 : 0;
const randomInt = (min, max) => Math.floor(min + (Math.random() * (max - min + 1)));
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const LANGS = ['en', 'de', 'jp', 'fr', 'cn'];

setInterval(async () => {
    const lines = Array(randomInt(1,6)).fill().map(() => (
        `${randomItem(POPS).code} ${Date.now()}000 ${randomInt(100, 1000)} ` +
        `${randomBool(0.7)}${randomBool(0.4)}${randomBool(0.8)}${randomBool(0.98)} ` +
        `${randomItem(LANGS)} ${randomInt(10,3000)} ${randomInt(1000000, 9999999)} ${randomInt(500,3000)}`
    ));
    ingest(lines.join('\n'));
}, 15);
