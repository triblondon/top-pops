<script>
	import POPS from '../data/pops.js';
	import METRICS from '../data/metrics.js';

	import Countdown from './Countdown.svelte';
	import MetricValue from './MetricValue.svelte';

	export let players;
	export let metricCode;
	export let currentData;
  export let duration;

  $: metric = METRICS.find(m => m.code === metricCode);
</script>

<style>
.race {
  width: 100%;
  height: 100%;
	display: flex;
	flex-flow: column nowrap;
	align-items: stretch;
}
.players {
  display: flex;
	flex-flow: row nowrap;
	align-items: flex-start;
	list-style-type: none;
	padding: 0;
	margin: 1em 0 0 0;
	justify-content: space-around;
	width: 100%;
}
.players li {
	padding: 1em;
	background: rgba(100,100,100,0.2);
	margin: 1em 1em 0 1em;
	flex: 1 0 0;
  position: relative;
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
  font-size: 0.6em;
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
.pop-name {
  font-size: 1.4em;
	text-align: center;
	position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin-top: -1.05em;
}
.current-number {
	margin: 0.5em 0 0 0;
	font-size: 3em;
	background: #333;
	padding: 0 0.2em;
	text-align: center;
  transition: box-shadow 2s, color 1s;
  color: white;
}
.winning {
	box-shadow: 0 0 0.2em 0.1em yellow;
	color: yellow;
}

.race-detail {
  display: flex;
	flex-flow: row nowrap;
	align-items: flex-start;
	list-style-type: none;
	padding: 0;
	margin: 2em 0 0 0;
	justify-content: space-around;
	width: 100%;
}
.race-detail h4 {
  margin: 0;
	font-weight: normal;
	font-size: 0.9em;
	text-transform: uppercase;
}
.race-detail p {
  margin: 0;
  font-size: 1.5em;
	line-height: 1;
}
.time-remaining {
	font-family: monospace;
}

.real-time {
  position: absolute;
  bottom: 1em;
  left: 0;
  width: 100%;
  text-align: center;
}
</style>

<div class='race'>
	<ul class='players'>
		{#each players as player }
			<li>
				<div class='pop-name'>{POPS.find(p => p.code === player.pop).name}</div>
        <div class='media-item'>
          <img class='avatar' alt='Cute monster' src='/avatars/{player.avatar}.svg' />
          <p>{player.name}</p>
        </div>

				<div class='current-number {currentData.winning === player.pop ? 'winning' : ''}'>
          <MetricValue metric={metricCode} value={currentData[player.pop]} />
        </div>
			</li>
		{/each}
	</ul>
	<ul class='race-detail'>
    <li>
		  <h4>Metric:</h4>
		  <p>{metric.name}</p>
    </li>
    <li>
		  <h4>Time remaining:</h4>
		  <p class='time-remaining'><Countdown duration={duration} timeFormat /></p>
    </li>
	</ul>
	<div class='real-time'>You're seeing data streaming in real time from Fastly's global edge cloud network.</div>
</div>
