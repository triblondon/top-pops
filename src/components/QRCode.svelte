<script>

	import { onMount, beforeUpdate } from 'svelte';

	export let gameId;

	let qrLink = "";

	beforeUpdate(() => {
		qrLink = location.protocol + '//' + location.hostname + ':' + location.port + '/games/' + gameId + '/play';
	});

</script>

<style>
.qr-code {
	overflow: hidden;
	display: inline-block;
}
.qr-code img {
	margin: -30px -30px -35px -31px;
}
</style>

<div class='qr-code'>
	<a href={qrLink} targret="_blank"><img src='https://chart.googleapis.com/chart?chs=200x200&amp;cht=qr&amp;chl={qrLink}&amp;choe=UTF-8' alt='' /></a>
</div>
