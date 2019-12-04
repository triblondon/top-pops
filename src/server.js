import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const path = require('path');

import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid/v4';
import { GK as DataStruct } from 'streaming-percentiles';
import POPS from './data/pops.js';
import METRICS from './data/metrics.js';

const LOG_EVENT_PATTERN = /^(?<pop>[A-Z]{3}) (?<startTime>\d+) (?<duration>\d+) (?<h2>[10])(?<ipv6>[10])(?<tls>[10])(?<chr>[10]) (?<lang>[a-z]+) (?<cwnd>[\d]+) (?<pace>[\d]+) (?<rtt>[\d]+)$/;
const EPSILON = 0.1;
const HISTORY_LEN = 1000;
const GAMESTATE_INIT = 'init';
const GAMESTATE_PLAYING = 'playing';
const GAMESTATE_FINSHED = 'finished';

const app = express();
const games = new Map();
const recentEvents = [];

app.use(express.static(path.join(__dirname, '../static')));
app.use(bodyParser.text({ type: "text/*", limit: 1024 }));
app.use(bodyParser.json());

app.disable('x-powered-by');
app.disable('etag');

app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': "SAMEORIGIN",
    'X-XSS-Protection': "1",
    'X-Content-Type-Options': "nosniff",
    'Referer-Policy': "origin-when-cross-origin",
    'Strict-Transport-Security': "max-age=86400"
  });
  next();
});

// Ingest log lines
// example: DCA 1575265507502997 17329 1011 en 10 25676604 614
app.post('/ingest', (req, res) => {
  
  // Separate multiple events
  (req.body || "").trim().split(/\n+/).filter(x => x && x.length).forEach(line => {
    
    // Match the fields based on known log line format
    const event = line.trim().match(LOG_EVENT_PATTERN)
    if (event) {
      const metricData = METRICS.reduce((out, m) => ({ ...out, [m.code]: Number.parseInt(event.groups[m.code])}), {})
      
      // Remember the last n raw log events
      recentEvents.push(metricData);
      if (recentEvents.length > HISTORY_LEN) recentEvents.shift();
      console.log(event.groups.pop, metricData);
      
      // For each game in progress, record the value relevant to that game
      games.forEach(game => {
        if (game.state !== GAMESTATE_PLAYING) return;
        if (!Object.keys(game.data).includes(event.groups.pop)) return;
        game.eventCount++;
        game.data[event.groups.pop].insert(metricData[game.metric]);
        console.log(game);
      });
    }
  });
  res.status(204);
  res.end();
});

app.get('/pops', (req, res) => {
  res.json(POPS);
});
app.get('/metrics', (req, res) => {
  res.json(METRICS);
});

app.get('/games', (req, res) => {
  console.log(games);
  res.json(games);
});

app.post('/games', (req, res) => {
  const gameID = uuid();
  games.set(gameID, { id: gameID, state: GAMESTATE_INIT, createdTime: Date.now(), startTime: null, eventCount: 0, metric: null, players: [] })
  res.json({
    "id": gameID
  })
});

app.get('/games/:game_id', (req, res, next) => {
  const game = games.get(req.params.game_id);
  console.log(game, req.params.game_id)
  if (!game) return next();
  res.json(game);
});

app.patch('/games/:game_id', (req, res, next) => {
  const game = games.get(req.params.game_id);
  if (!game) return next();
  console.log(req.body);
  if (req.body.metric) {
    const metric = METRICS.find(m => m.code === req.body.metric.toLowerCase());
    if (metric) game.metric = metric.code;
  }
  res.json(game)
});

app.post('/games/:game_id/players', (req, res, next) => {
  const game = games.get(req.params.game_id);
  if (!game) return next();
  const player = { id: uuid(), "name": "TODO", "avatar": "TODO" };
  game.players.push(player)
  res.json(player)
});

app.post('/games/:game_id/start', (req, res, next) => {
  const game = games.get(req.params.game_id);
  if (!game) return next();
  game.state = GAMESTATE_PLAYING
  game.startTime = Date.now();
  game.data = game.players.reduce((p, out) => ({ ...out, [p.pop.code]: new DataStruct(EPSILON)}))
  res.json(game);
});

app.patch('/games/:game_id/players/:player_id', (req, res, next) => {
  const game = games.get(req.params.game_id);
  if (!game) return next();
  const player = game.players.find(p => p.id = req.params.player_id);
  if (!player) return next();
  if (req.body.pop) {
    const pop = POPS.find(p => p.code === req.body.pop.toUpperCase());
    if (pop) player.pop = pop.code;
  }
  res.json(player)
});


app.all('/.well-known/fastly/logging/challenge', (req, res) => {
  res.end("TODO log challenge response");
})

app.use(sapper.middleware());

app.listen(PORT, () => console.log('Server up'));