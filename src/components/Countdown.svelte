<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let duration;

	let timer;
	let remaining;

	onMount(() => {
		remaining = duration;
		timer = setInterval(() => {
			remaining--;
			if (!remaining) {
				clearInterval(timer);
				dispatch('zero');
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(timer);
		console.log('stopped countdown');
	});
</script>

{remaining}
