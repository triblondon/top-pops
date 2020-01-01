<script>
	import POPS from '../data/pops.js';
	import METRICS from '../data/metrics.js';

	import Countdown from './Countdown.svelte';

	export let players;
	export let metricCode;
	export let currentData;
  export let duration;

  const unitsByMetricType = {
    percentage: '%',
    milliseconds: 'ms',
    diversity: '',
    bytes: 'b',
    bps: 'kbps'
  };

  $: metric = METRICS.find(m => m.code === metricCode);
</script>

<style>
.race {
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: row nowrap;
	align-items: stretch;
}
.race-detail {
	width: 20vw;
	min-width: 300px;
	padding: 3vh;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-end;
}
.race-detail h4 {
	margin: 30px 0 6px 0;
	font-weight: normal;
	font-size: 1.7em;
}
.metric-name {
	margin: 0;
	font-size: 1.3em;
	font-weight: bold;
}
.time-remaining {
	margin: 0;
	font-family: monospace;
	font-size: 3em;
	line-height: 1;
}
.explain {
	margin-top: 10vh;
	font-size: 1.2em;
}
.players {
	flex: 1 0 auto;
	display: flex;
	flex-flow: row wrap;
	align-items: flex-start;
	list-style-type: none;
	padding: 0;
	margin: 0;
}
.players li {
	padding: 2vw;
	background: rgba(100,100,100,0.2);
	margin: 1vw;
	width: 20vw;
}
.avatar {
	border: 2px solid #777;
	background: white;
	margin-right: 10px;
	float: left;
	width: 5vw;
}
.player-name {
	font-size: 1.2em;
	display: block;
}
.pop-name {
	font-size: 1.2em;
	font-weight: bold;
}
.current-number {
	clear: left;
	margin: 1vw 0 0 0;
	border: 2px solid black;
	font-size: 4em;
	background: white;
	padding: 0 17px;
	text-align: right;
}
.winning {
	background-color: #71ff71;
}
.fly {
	margin: 0;
	text-align: right;
	font-weight: bold;
	font-size: 0.9em;
}
</style>

<div class='race'>
	<div class='race-detail'>
		<h4>Metric:</h4>
		<p class='metric-name'>{metric.name}</p>
		<h4>Time remaining:</h4>
		<p class='time-remaining'><Countdown duration={duration} /></p>
		<p class='explain'>You're seeing data streaming in real time from Fastly's global edge cloud network</p>
	</div>
	<ul class='players'>
		{#each players as player }
			<li>
				<img class='avatar' alt='Cute monster' src='/avatars/{player.avatar}.svg' />
				<span class='player-name'>{player.name}</span>
				<span class='pop-name'>{POPS.find(p => p.code === player.pop).name}</span>

				<div class='current-number {currentData.winning === player.pop ? 'winning' : ''}'>{currentData[player.pop] || '...'}{unitsByMetricType[metric.type]}</div>
				<div class='fly'>RIGHT NOW</div>
			</li>
		{/each}
	</ul>
</div>
