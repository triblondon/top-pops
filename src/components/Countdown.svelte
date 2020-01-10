<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const toHHMMSS = inp => {
    const sec_num = Number.parseInt(inp, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10 && hours > 0) hours = "0" + hours + ":";
    if (minutes < 10) minutes = "0" + minutes + ":";
    if (seconds < 10) seconds = "0" + seconds;
    return hours + minutes + seconds;
}

  export let duration;
  export let timeFormat;

	let timer;
  let remaining;

  $: display = timeFormat ? toHHMMSS(remaining) : remaining;

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

{display}
