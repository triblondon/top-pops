<script context="module">
  export async function preload(page) {
    const game = await this.fetch(`/api/games/${page.params.game_id}`).then(res => res.ok ? res.json() : {});
    return { game };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import {
    GAMESTATE_INIT, GAMESTATE_NEWPLAYER, GAMESTATE_PLAYING, GAMESTATE_FINISHED, GAMESTATE_DEAD,
    START_COUNTDOWN_TIME, MIN_PLAYERS, MAX_PLAYERS, GAME_DURATION_MS, PLAY_INTRO_MS
  } from '../../../constants.js';
  import POPS from '../../../data/pops.js';
  import METRICS from '../../../data/metrics.js';
  import POPMap from '../../../components/POPMap.svelte';
  import BackgroundCircuits from '../../../components/BackgroundCircuits.svelte';
  import Countdown from '../../../components/Countdown.svelte';
  import QRCode from '../../../components/QRCode.svelte';
  import Race from '../../../components/Race.svelte';
  import PlayerEnrolment from '../../../components/PlayerEnrolment.svelte';
  import WinningPlayer from '../../../components/WinningPlayer.svelte';

  export let game;

  let gameStream;
  let gameData = {};
  let popStats = {};
  let playerControlledComponent;
  let starting = false;

  $: activePlayer = game.players && game.players.find(p => p.id === game.activePlayer);
  $: metric = game.metric && METRICS.find(m => m.code === game.metric);
  $: console.log("game update", game);

  const handleReset = () => fetch('/api/games/' + game.id + '/end', { method: 'post' });

  const handleStartGame = () => {
    starting = true;
    setTimeout(async () => {
      fetch('/api/games/' + game.id + '/start', { method: 'post' });
    }, PLAY_INTRO_MS);
  };

  onMount(() => {
    gameStream = new EventSource('/api/games/' + game.id + '/stream');
    gameStream.addEventListener('game'+game.id+'-gameUpdate', e => {
      game = JSON.parse(e.data);
      if (game.state !== GAMESTATE_INIT) starting = false;
      if (game.state === GAMESTATE_DEAD) location.href = '/';
    });
    gameStream.addEventListener('game'+game.id+'-gameData', e => {
      gameData = JSON.parse(e.data);
    });
    gameStream.addEventListener('popStats', e => {
      popStats = JSON.parse(e.data);
    });

    // Receive player button presses
    gameStream.addEventListener('game'+game.id+'-playerControl', e => playerControlledComponent.changeSelection(Number.parseInt(e.data)));
    gameStream.addEventListener('game'+game.id+'-playerSelect', () => playerControlledComponent.select());

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
  bottom: 2em;
  right: 2em;
  font-size: 1.5em;
}

.lets-play {
  display: flex;
  flex-flow: column;
  align-items: center;
}
.lets-play .players {
  list-style: none;
  margin: 2em 0 0 0;
  padding: 0;
  display: flex;
  flex-flow: row;
  justify-content: center;
}
.lets-play .players li {
  display: flex;
  width: 10em;
  margin-right: 1em;
  flex-flow: column;
  align-items: center;
}
.lets-play .players li > p {
  font-size: 0.7em;
  margin: 0;
}
.lets-play .players li .media-item {
  border: 2px solid black;
  border-radius: 2%;
  background: white;
  width: 100%;
  box-sizing: border-box;
  margin: 0.7em 0 0 0;
}
.lets-play .players li .avatar {
  width: 4em;
  height: 3em;
  background-size: cover;
  background-position: center;
}
.lets-play .players li .city {
  width: 100%;
  height: 0;
  padding-top: 70%;
  background-size: cover;
  background-position: center;
}
.lets-play .players li .media-item p {
  font-size: 0.9em;
  text-align: center;
  font-weight: bold;
}
.lets-play .strap {
  font-size: 0.7em;
  font-weight: bold;
}

</style>

<div class='panels'>
  <div><BackgroundCircuits /></div>

  {#if game.state === GAMESTATE_INIT && !starting}
    <div><POPMap players={game.players} popStats={popStats} /></div>
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
  {:else if game.state === GAMESTATE_INIT && starting}
    <div class='lets-play'>
      <ul class='players'>
        {#each game.players as player, idx }
          <li in:fade="{{delay: 500 + (idx * 400), duration: 500}}">
            <div class='avatar' style='background-image: url(/avatars/{player.avatar}.svg)' />
            <p>{player.name}</p>
            <div class='media-item'>
              <div class='city' style='background-image: url(/pops/{player.pop}.png)' />
              <p>{POPS.find(p => p.code === player.pop).name}</p>
            </div>
          </li>
        {/each}
      </ul>
      <p in:fade="{{delay: 3000, duration: 500}}">Which of these Fastly data centers has a better <strong>{metric.name}</strong> right now?</p>
      <p in:fade="{{delay: 5000, duration: 500}}" class='strap'>You're about to see metrics streaming in real time from Fastly servers.</p>
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
      <WinningPlayer {game} on:reset={handleReset} />
    </div>
  {/if}
</div>
