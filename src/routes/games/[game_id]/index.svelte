<script context="module">
	export async function preload(page) {
		const game = await this.fetch(`/api/games/${page.params.game_id}`).then(res => res.ok ? res.json() : {});
		return { game };
	}
</script>

<script>
	import { onMount } from 'svelte';
	import {
		GAMESTATE_INIT, GAMESTATE_NEWPLAYER, GAMESTATE_PLAYING, GAMESTATE_FINISHED, GAMESTATE_DEAD,
		START_COUNTDOWN_TIME, MIN_PLAYERS, MAX_PLAYERS, GAME_DURATION_MS
	} from '../../../constants.js';
	import POPS from '../../../data/pops.js';
	import METRICS from '../../../data/metrics.js';
	import POPMap from '../../../components/POPMap.svelte';
	import BackgroundCircuits from '../../../components/BackgroundCircuits.svelte';
	import Countdown from '../../../components/Countdown.svelte';
	import QRCode from '../../../components/QRCode.svelte';
	import Race from '../../../components/Race.svelte';
	import PlayerEnrolment from '../../../components/PlayerEnrolment.svelte';

	export let game;

	let gameStream;
	let gameData = {};
	let playerControlledComponent;

  $: activePlayer = game.players && game.players.find(p => p.id === game.activePlayer);
  $: metric = game.metric && METRICS.find(m => m.code === game.metric);
	$: console.log("game update", game);

	const handleStartGame = () => fetch('/api/games/' + game.id + '/start', { method: 'post' });
	const handleReset = () => fetch('/api/games/' + game.id + '/end', { method: 'post' });

	onMount(() => {
		gameStream = new EventSource('/api/games/' + game.id + '/stream');
		gameStream.addEventListener('gameupdate', e => {
			game = JSON.parse(e.data);
			if (game.state === GAMESTATE_DEAD) {
				location.href = '/';
			}
		});
		gameStream.addEventListener('running-metrics', e => {
			gameData = JSON.parse(e.data);
		});

		// Receive player button presses
		gameStream.addEventListener('player-control', e => playerControlledComponent.changeSelection(Number.parseInt(e.data)));
		gameStream.addEventListener('player-select', () => playerControlledComponent.select());

	});

</script>

<style>
.panels {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  max-width: 177vh; /* 16:9 */
  max-height: 56.2vw; /* 16:9 */
  font-size: calc(min(177vh, 100vw) / 50); /* Font size scales consistently with 16:9 aspect */
	overflow: hidden;
  position: relative;
  padding: 0;
}
.panels > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
}

.join-instructions {
	position: absolute;
	bottom: 2em;
  left: 2em;
  display: flex;
  align-items: center;
}
.join-instructions .qr {
  margin-right: 1em;
  width: 5em;
  height: 5em;
}

.countdown {
	position: absolute;
	bottom: 3em;
	right: 2em;
	font-size: 1.5em;
}
</style>

<div class='panels'>
  <div><BackgroundCircuits /></div>

  {#if game.state === GAMESTATE_INIT}
    <div><POPMap players={game.players} /></div>
    <div>
      <div class='labels'>
        {#if game.players.length < MAX_PLAYERS}
          <div class='join-instructions'>
            <div class='qr'>
              <QRCode gameId={game.id} alt="Click to play" />
            </div>
            <div class='strap'>
              Play <strong>Top of the POPs</strong><br/>
              Scan to join!
            </div>
          </div>
        {/if}
        {#if game.players.length >= MIN_PLAYERS }
          <div class='countdown'>Game starting in <Countdown duration={START_COUNTDOWN_TIME} on:zero={handleStartGame} />...</div>
        {/if}
      </div>
    </div>
  {:else if activePlayer && game.state === GAMESTATE_NEWPLAYER }
    <div>
      <PlayerEnrolment type={!game.metric ? 'first' : 'normal'} player={activePlayer} {game} bind:this={playerControlledComponent} />
    </div>

  {:else if game.state === GAMESTATE_PLAYING }
    <div>
      <Race players={game.players} metricCode={game.metric} duration={GAME_DURATION_MS/1000} currentData={gameData} />
    </div>

  {:else if game.state === GAMESTATE_FINISHED }
    <div>
      <h1>Winner!</h1>
      <img class='avatar' alt='Cute monster' src='/avatars/{game.players.find(p => p.pop === game.winningPop).avatar}.svg' />
      <p>Show your phone to claim your prize!</p>
      <h2>About {metric.name}</h2>
      <p><strong>{metric.strap}</strong></p>
      <p>{metric.description}</p>
      <p>Resetting in <Countdown duration=20 on:zero={handleReset} /></p>
    </div>
  {/if}
</div>
