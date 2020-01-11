<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const toHHMMSS = inp => {
    const sec_num = Number.parseInt(inp, 10);
    const hours   = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);
    let op = '';
    if (hours > 0) op += ((hours < 10) ? "0" : "") + hours + ":";
    op += ((minutes < 10) ? "0" : "") + minutes + ":";
    op += ((seconds < 10) ? "0" : "") + seconds;
    return op;
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

	onDestroy(() => clearInterval(timer));
</script>

{display}
