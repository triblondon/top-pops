<script context="module">
	// the (optional) preload function takes a
	// `{ path, params, query }` object and turns it into
	// the data we need to render the page
	export async function preload(page) {
		// the `slug` parameter is available because this file
		// is called [slug].svelte
		const { game_id } = page.params;
		//const res = await this.fetch(`blog/${slug}.json`);
		//const article = await res.json();

		return { game_id };
	}
</script>

<script>
	export let game_id;
</script>

<svelte:head>
	<title>Game lobby</title>
</svelte:head>

<h1>Game page {game_id}</h1>

<p>This is the 'about' page. There's not much here.</p>