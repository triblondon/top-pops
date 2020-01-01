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

  $: activePlayer = game.players.find(p => p.id === game.activePlayer);
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
.qr {
	position: absolute;
	bottom: 5vh;
  left: 5vh;
  display: flex;
  align-items: center;
}
.qr .code {
  margin-right: 1vw;
}

.countdown {
	position: absolute;
	bottom: 5vh;
	right: 5vh;
	font-size: 6vh;
}
</style>

<BackgroundCircuits />

{#if game.state === GAMESTATE_INIT}
	<POPMap players={game.players} />
	{#if game.players.length < MAX_PLAYERS}
		<div class='qr'>
      <div class='code'>
        <QRCode gameId={game.id} />
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

{:else if activePlayer && game.state === GAMESTATE_NEWPLAYER }
	<PlayerEnrolment type={!game.metric ? 'first' : 'normal'} player={activePlayer} {game} bind:this={playerControlledComponent} />

{:else if game.state === GAMESTATE_PLAYING }
	<Race players={game.players} metricCode={game.metric} duration={GAME_DURATION_MS/1000} currentData={gameData} />

{:else if game.state === GAMESTATE_FINISHED }
	<h1>Winner!</h1>
	<img class='avatar' alt='Cute monster' src='/avatars/{game.players.find(p => p.pop === game.winningPop).avatar}.svg' />
	<p>Show your phone to claim your prize!</p>
  <h2>About {metric.name}</h2>
  <p><strong>{metric.strap}</strong></p>
  <p>{metric.description}</p>
	<p>Resetting in <Countdown duration=20 on:zero={handleReset} /></p>

{/if}

