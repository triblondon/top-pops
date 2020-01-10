<script>
	import Icon from './Icon.svelte';
	import Countdown from './Countdown.svelte';
	import MetricValue from './MetricValue.svelte';
	import METRICS from '../data/metrics.js';
	import POPS from '../data/pops.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  export let game;

  $: winner = game.players.find(p => p.pop === game.winningPop);
  $: metric = game.metric && METRICS.find(m => m.code === game.metric);
  $: pop = game.winningPop && POPS.find(p => p.code === game.winningPop);
</script>

<style>
.winner-panel {
  display: flex;
  flex-flow: row;
  align-items: stretch;
}
.winner-id {
  flex: 0 0 12em;
  text-align: center;
  margin: 0 2em;
}
.medal {
  font-size: 6em;
	margin-bottom: -0.6em;
}
.results {
	flex: 0 0 27%;
	margin: 0 2em 0 1em;
}
.pop-name {
  font-size: 0.8em;
}
.metric-name {
  font-size: 1.2em;
}
.value {
	margin: 0;
	border: 2px solid black;
	font-size: 3em;
	background: white;
	padding: 0 17px;
	text-align: right;
  overflow: hidden;
}
.subtitle {
  margin-top: 2em;
}
.results ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
.results li {
  display: flex;
  align-items: center;
}
.results li img {
  width: 2em;
  flex: 0 0 auto;
  margin-right: 0.2em;
}
.results li .result-player {
  flex: 1 1 auto;
  font-size: 0.6em;
}
.results li .result-player span {
  flex: 1 1 auto;
  font-size: 0.8em;
  display: block;
}
.results li .result-value {
  flex: 0 0 3em;
  border: 1px solid #aaa;
  padding: 0.1em;
  text-align: right;
}

.metric-info {
  flex: 1 1 auto;
  background: rgb(177,50,84);
  padding: 2em 1em;
  color: white;
}

.reset-timer {
  position: absolute;
	bottom: 1em;
	right: 1em;
}


.media-item {
  border: 2px solid black;
  border-radius: 2%;
  background: white;
  box-shadow: 0 0 2.4em 0.1em rgba(255, 247, 0, 0.7);
}
.media-item img {
  width: 100%;
}
.media-item p {
  font-size: 0.9em;
  text-align: center;
  font-weight: bold;
}

</style>

<div class='winner-panel'>
  <div class='winner-id'>
    <div class='medal'><Icon id='medal' /></div>
    <div class='media-item'>
      <img alt='Cute monster' src='/avatars/{winner.avatar}.svg' />
      <p>{winner.name}</p>
    </div>
    <p>Show your phone to claim your prize!</p>
  </div>
  <div class='results'>
    <div class='pop-name'>{pop.name}</div>
    <div class='metric-name'>{metric.name}</div>
    <div class='value'>
      <MetricValue metric={game.metric} value={game.winningValue} />
    </div>
    <div class='subtitle'>Full results</div>
    <ol>
      {#each game.results as result }
        <li>
          <img alt='Cute monster' src='/avatars/{result.avatar}.svg' />
          <div class='result-player'>
            {result.name}
            <span>{result.popName}</span>
          </div>
          <div class='result-value'>{result.value}</div>
        </li>
      {/each}
    </ol>
  </div>
  <div class='metric-info'>
    <p><strong>{metric.strap}</strong></p>
    <p>{metric.description}</p>
  </div>
  <div class='reset-timer'>Resetting in <Countdown duration=20 on:zero={() => dispatch('resetxxxxxxxxxxxxx') } /></div>
</div>
