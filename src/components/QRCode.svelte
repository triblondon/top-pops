<script>

	import { onMount, beforeUpdate } from 'svelte';

  export let gameId;
  export let alt;

	let qrLink = "";

	beforeUpdate(() => {
		qrLink = location.protocol + '//' + location.hostname + ':' + location.port + '/games/' + gameId + '/play';
	});

</script>

<style>
.qr-code {
	display: inline-block;
	overflow: hidden;
  min-width: 50px;
  min-height: 50px;
  width: 100%;
  height: 100%;
	background-position: center;
  background-size: 133%;
}
.qr-code span {
  display: none;
}
</style>

<a class='qr-code' href={qrLink} target="_blank" style="background-image: url(https://chart.googleapis.com/chart?chs=200x200&amp;cht=qr&amp;chl={qrLink}&amp;choe=UTF-8)"><span>{alt}</span></a>
