<script context="module">
	export async function preload(page) {
		const game = await this.fetch(`/api/games/${page.params.game_id}`).then(res => res.ok ? res.json() : {});
		return { game, playerId: Number.parseInt(page.params.player_id) };
	}
</script>

<script>
	import { onMount, beforeUpdate } from 'svelte';
	import { GAMESTATE_INIT, GAMESTATE_NEWPLAYER, GAMESTATE_PLAYING, GAMESTATE_FINISHED, GAMESTATE_DEAD } from '../../../../../constants.js';

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
.player-control {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: min-content 1fr 1fr;
	grid-template-areas:
		"id id"
		"prev next"
		"select select"
	;
	grid-gap: 1vw;
	max-width: 500px;
	margin: 0 auto;
	height: 100%;
	padding: 1vw 0;
	box-sizing: border-box;
}
.player-id {
	grid-area: id;
	display: flex;
	align-items: center;
}
.name {
	font-size: 32px;
}
.player-id .avatar {
	float: left;
	margin-right: 20px;
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
button {
	display: flex;
	align-content: center;
	justify-content: center;
	font-size: 5vh;
	border: 1px dashed #2b2b2b;
	background: #f7e9e9;
	border-radius: 5px;
	padding: 20%;
}
button:active {
	background: #ffa4a4;
}
button svg {
	max-width: 100%;
	width: 100%;
	height: 100%;
}
</style>

{#if game.state === GAMESTATE_NEWPLAYER && isActive}
	<div class='player-control'>
		<div class='player-id'>
			<img class='avatar' alt='Cute monster' src='/avatars/{player.avatar}.svg' />
			<div class='name'>{player.name}</div>
		</div>
		<button class='nav-button nav-button-prev' on:click={handlePrev}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 80 105">
					<g>
						<path d="M68.7 2.5c2.6 0 5.1 1 7.1 2.9a10 10 0 010 14.2L45.5 50l30.4 30.4a10 10 0 010 14.2 10 10 0 01-14.2 0L24.2 57.1c-1.9-1.9-2.9-4.4-2.9-7.1s1.1-5.2 2.9-7.1L61.6 5.4c2-1.9 4.6-2.9 7.1-2.9z"/>
					</g>
			</svg>
		</button>
		<button class='nav-button nav-button-next' on:click={handleNext}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 80 105">
				<g>
					<path d="M31.3 97.5c-2.6 0-5.1-1-7.1-2.9a10 10 0 010-14.2L54.5 50 24.2 19.6a10 10 0 010-14.2 10 10 0 0114.2 0l37.5 37.5c1.9 1.9 2.9 4.4 2.9 7.1s-1.1 5.2-2.9 7.1L38.4 94.6c-2 1.9-4.6 2.9-7.1 2.9z"/>
				</g>
			</svg>
		</button>
		<button class='nav-button select-button' on:click={handleSelect}>OK</button>
	</div>

{:else if game.state === GAMESTATE_PLAYING }
	<p>Playing!</p>

{:else if game.state === GAMESTATE_FINISHED && game.winningPop !== player.pop }
	<p>The game is finished, and sadly, you didn't win this time :-(</p>

{:else if game.state === GAMESTATE_FINISHED && game.winningPop === player.pop }
	<h1>You win!</h1>
	<p><img class='avatar' alt='Cute monster' src='/avatars/{player.avatar}.svg' /></p>
	<p>Show your phone to claim your prize!</p>

{:else if game.state === GAMESTATE_DEAD }
	<p>The game is over.  Feel free to close this browser window.</p>

{:else}
	<p>Please look at the big screen!</p>
{/if}
