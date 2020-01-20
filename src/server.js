import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid/v4';
import * as sapper from '@sapper/server';

import * as GameManager from './lib/game-manager';
import POPS from './data/pops.js';
import { GAMESTATE_INIT } from './constants';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV !== 'production';

const app = express();

app.disable('x-powered-by');
app.disable('etag');

app.use((req, res, next) => {
  res.set({
    'Referer-Policy': "origin-when-cross-origin",
    'Strict-Transport-Security': "max-age=86400",
    "X-Accel-Buffering": "no" // Disables response buffering on Google App Engine
  });
  next();
});

app.use(express.static('static', { setHeaders: res => {
  res.set('surrogate-control', dev ? 'no-store, private' : 'max-age=86400');
  res.set('cache-control', dev ? 'no-store, private' : 'public, max-age=600');
}}));
app.use(bodyParser.text({ type: "text/*", limit: 1024 }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set('Cache-Control', "no-store, private");
  next();
});

const requireGame = (req, res, next) => {
	const game = GameManager.get(req.params.game_id);
	if (game) {
		req.game = game;
		next();
	} else {
		next(new Error('Game not found'));
	}
};

app.post('/ingest', (req, res) => {
	GameManager.ingestData(req.body);
  res.status(204);
  res.end();
});

app.get('/', (req, res) => {
  const gameID = uuid().substr(0,6);
  res.redirect('/games/' + gameID);
});

app.get('/games/:game_id/play', requireGame, (req, res) => {
	if (req.game.state !== GAMESTATE_INIT) {
		return res.end("You can't join this game right now.  Reload to try again.");
	}
	const player = req.game.addPlayer();
  res.redirect('/games/' + req.params.game_id + '/players/' + player.id);
});

// Get game
app.get('/api/games/:game_id', (req, res) => {
  let game = GameManager.get(req.params.game_id);
	if (!game) {
		game = GameManager.create(req.params.game_id);
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
		req.game.playerSelect();
	} else {
		req.game.playerNavigate(req.params.command === 'movePrev' ? -1 : 1);
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
  GameManager.subscribe(req.game.id, req, res);
});

app.get('/__health', (req, res) => res.end('OK'));



app.all('/.well-known/fastly/logging/challenge', (req, res) => {
  res.end("f851148928fcd913bb8d2da45d941af7cc7dc3a8201ad671fc525eef54b5988e");
});

app.use(sapper.middleware());

app.listen(PORT, () => console.log('Server up'));




/* Simulator */

const randomBool = (p) => Math.random() < p ? 1 : 0;
const randomInt = (min, max) => Math.floor(min + (Math.random() * (max - min + 1)));
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const LANGS = ['en', 'de', 'jp', 'fr', 'cn', 'aa', 'ss', 'ee', 'tt', 'yy', 'gg', 'rr', 'jj', 'ee', 'hh'];

if (dev) {
  setInterval(async () => {
      const lines = Array(randomInt(1,6)).fill().map(() => (
          `${randomItem(POPS).code} ${Date.now()}000 ${randomInt(100, 1000)} ` +
          `${randomBool(0.7)}${randomBool(0.4)}${randomBool(0.8)}${randomBool(0.98)} ` +
          `${randomItem(LANGS)} ${randomInt(10,3000)} ${randomInt(1000000, 9999999)} ${randomInt(500000,3000000)}`
      ));
      GameManager.ingestData(lines.join('\n'));
  }, 15);
}
