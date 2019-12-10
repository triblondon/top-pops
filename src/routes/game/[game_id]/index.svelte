<script context="module">
	// the (optional) preload function takes a
	// `{ path, params, query }` object and turns it into
	// the data we need to render the page
	export async function preload(page) {
		// the `slug` parameter is available because this file
		// is called [slug].svelte
		const { game_id } = page.params;
		const res = await this.fetch(`/api/games/${game_id}`, {
			headers: "Accept: application/json"
		});
		const game = await res.json();
		console.log(game);

		return { game };
	}
</script>

<script>
	import { afterUpdate } from 'svelte';
	import QRCode from 'qrcode';

	let canvasElement
	let game

	afterUpdate(() => {
		const link = 'https://' + location.hostname + '/game/' + game_id + '/play';
		QRCode.toCanvas(canvasElement, link, (err) => console.log(err));
	});
</script>

<svelte:head>
	<title>Game lobby</title>
</svelte:head>

<img src='/world.svg' class='map center-and-fit' alt='World map' />
<ul class='pops'>
	{#each game.availablePops as pop }
	<li style={ left: pop.left, right: pop.right } title={pop.name}></li>
	{/each}
</ul>

<canvas bind:this={canvasElement} />