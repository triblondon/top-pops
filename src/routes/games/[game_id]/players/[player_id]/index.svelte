<script context="module">
  export async function preload(page) {
    const game = await this.fetch(`/api/games/${page.params.game_id}`).then(res => res.ok ? res.json() : {});
    return { game, playerId: Number.parseInt(page.params.player_id) };
  }
</script>

<script>
  import { onMount, beforeUpdate } from 'svelte';
  import { GAMESTATE_INIT, GAMESTATE_NEWPLAYER, GAMESTATE_PLAYING, GAMESTATE_FINISHED, GAMESTATE_DEAD } from '../../../../../constants.js';
  import Icon from '../../../../../components/Icon.svelte';

  let gameStream

  export let game
  export let playerId

  $: player = game.players.find(p => p.id === playerId);
  $: isActive = game.activePlayer === playerId;

  onMount(() => {
    gameStream = new EventSource('/api/games/' + game.id + '/stream');
    gameStream.addEventListener('gameupdate', e => { game = JSON.parse(e.data); });
  });

  function handlePrev() {
    fetch(`/api/games/${game.id}/players/${player.id}/movePrev`, { method: 'post' });
  }
  function handleNext() {
    fetch(`/api/games/${game.id}/players/${player.id}/moveNext`, { method: 'post' });
  }
  function handleSelect() {
    fetch(`/api/games/${game.id}/players/${player.id}/select`, { method: 'post' });
  }
</script>

<style>
.player-control,
.player-message {
  display: grid;
  grid-gap: 2vw;
  max-width: 500px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  padding: 3vw;
  box-sizing: border-box;
}
.player-control {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content 1fr 1fr;
  grid-template-areas:
    "id id"
    "prev next"
    "select select"
  ;
}
.player-message {
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
  grid-template-areas:
    "id"
    "message"
  ;
}

.player-id {
  grid-area: id;
}

.media-item {
  border: 2px solid black;
  border-radius: 0.3em;
  background: white;
  display: flex;
  align-items: center;
  padding: 0.4em;
  width: 100%;
  box-sizing: border-box;
}
.media-item img {
  width: 5em;
  margin-right: 1em;
}
.media-item p {
  font-size: 1.5em;
  text-align: center;
  font-weight: bold;
  margin: 0
}

.nav-button-prev {
  grid-area: prev;
}
.nav-button-next {
  grid-area: next;
}
.select-button {
  grid-area: select;
}
.message {
  grid-area: message;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1em;
}

button {
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 5vh;
  border: 1px solid #2b2b2b;
  background: #f7e9e9;
  border-radius: 5px;
  padding: 20%;
}
button:active {
  background: #ffa4a4;
}
</style>

{#if game.state === GAMESTATE_NEWPLAYER && isActive}
  <div class='player-control'>
    <div class='player-id'>
      <div class='media-item'>
        <img class='avatar' alt='Cute monster' src='/avatars/{player.avatar}.svg' />
        <p>{player.name}</p>
      </div>
    </div>
    <button class='nav-button nav-button-prev' on:click={handlePrev}>
      <Icon id='left' />
    </button>
    <button class='nav-button nav-button-next' on:click={handleNext}>
      <Icon id='right' />
    </button>
    <button class='nav-button select-button' on:click={handleSelect}>OK</button>
  </div>

{:else }
  <div class='player-message'>
    <div class='media-item player-id'>
      <img class='avatar' alt='Cute monster' src='/avatars/{player.avatar}.svg' />
      <p>{player.name}</p>
    </div>
    <div class='message'>
      {#if game.state === GAMESTATE_PLAYING }
        <p>Playing!  Look at the main screen.</p>
      {:else if game.state === GAMESTATE_FINISHED && game.winningPop !== player.pop }
        <p>Sorry you didn't win this round!</p>
        <p>Look at the main screen for more information.</p>
      {:else if game.state === GAMESTATE_FINISHED && game.winningPop === player.pop }
        <h1>You win!</h1>
        <p>Show your phone to claim your prize!</p>
      {:else if game.state === GAMESTATE_DEAD }
        <p>The game is over.<br/>Feel free to close this browser window.</p>
      {:else}
        <p>Please look at the main screen!</p>
      {/if}
    </div>
  </div>
{/if}
