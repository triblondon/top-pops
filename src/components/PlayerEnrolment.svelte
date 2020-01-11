<script>
	import POPS from '../data/pops.js';
	import METRICS from '../data/metrics.js';
	import POPMap from './POPMap.svelte';
	import PlayerButton from './PlayerButton.svelte';
	import Scale from './Scale.svelte';
	import Icon from './Icon.svelte';

	export let player;
	export let type;
	export let game;

	let stage = 'init';
	let chooserIndex = 1000; // Order inverts when < 0, easier just to start with a big number

	$: options = type === 'first' ? METRICS : POPS.filter(p => !game.players.some(pl => pl.pop === p.code));
	$: metric = game.metric && METRICS.find(m => m.code === game.metric);
  $: pop = player.pop && POPS.find(p => p.code === player.pop);
  $: currentHourUTC = (new Date()).getUTCHours();

	const pick = (list, idx) => list[idx % list.length];

	export const changeSelection = diff => {
		chooserIndex += Number.parseInt(diff);
	};

	export const select = () => {
		if (stage === 'init') {
			stage = (type === 'first') ? 'pop-spin' : 'choose-pop';
		} else if (stage === 'pop-spin') {
			stage = 'pop-confirm';
		} else if (stage === 'pop-confirm') {
			stage = 'choose-metric';
		} else if (stage === 'choose-pop') {
			api('/players/' + player.id + '/setPOP', { pop: pick(options, chooserIndex).code });
		} else if (stage === 'choose-metric') {
			api('/setMetric', { metric: pick(options, chooserIndex).code });
		}
	};

	const api = (endpoint, data) => fetch('/api/games/' + game.id + endpoint, {
		method: 'post',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(data)
	});

</script>

<style>
.chooser {
  list-style: none;
  margin: 4em 2em 2em 2em;
	padding: 0;
  width: 100%;
}
.chooser .help {
  position: absolute;
  top: 0.5em;
  left: 0;
  right: 0;
  text-align: center;
}
.chooser li {
	display: none;
}
.chooser li.selected {
	display: flex;
}

.media-panel {
  padding: 2em;
  display: flex;
  align-items: center;
  min-height: 13em;
  width: 100%;
  box-sizing: border-box;
}
.media-panel > .media-item,
.media-panel > .card {
  width: 30%;
  flex: 0 0 30%;
  margin-right: 1em;
}
.media-panel .title {
  font-size: 1.5em;
}

.media-item {
  border: 2px solid black;
  border-radius: 2%;
  background: white;
}
.media-item img {
  width: 100%;
}
.media-item p {
  font-size: 0.9em;
  text-align: center;
  font-weight: bold;
}
.card {
  background: #444;
  color: white;
  display: flex;
  align-self: stretch;
  align-items: center;
	justify-content: center;
}
.card span {
  font-size: 3em;
  line-height: 1;
  text-align: center;
}
.city-image {
  width: 100%;
  padding-top: 75%;
  height: 0;
  overflow: hidden;
  background-size: cover;
  background-position: 50% 50%;
}

.opponents {
	list-style: none;
}
.opponents > li > .avatar {
	width: 2em;
	display: inline-block;
	vertical-align: middle;
}

.pop-stats {
  width: 100%;
}
.pop-stats .label {
  width: 7em;
}


</style>

{#if stage === 'init' }
	<div class='media-panel'>
    <div class='media-item'>
		  <img alt='Cute monster' src='/avatars/{player.avatar}.svg' />
		  <p>{player.name}</p>
    </div>
    <div class='info'>
      {#if type === 'first' }
        <p>You're the first one here!</p>
        <p>We're going to allocate you a Fastly data center.<br />Then, <strong>you</strong> get to choose a metric to play for.</p>
  		  <p>Press <PlayerButton>OK</PlayerButton> on your phone to <strong>roll for a data center</strong>.</p>
      {:else}
        <p>This game is about <strong>{metric.name}</strong>.  You're playing against:</p>
        <ul class='opponents'>
        {#each game.players.filter(p => p.id !== player.id) as opponent }
          <li><img class='avatar' alt='Cute monster' src='/avatars/{opponent.avatar}.svg' /> <strong>{opponent.name}</strong> in <strong>{POPS.find(p => p.code === opponent.pop).name}</strong></li>
        {/each}
        </ul>
        <p>You need to choose a Fastly data center, which you think can score better than your opponents on {metric.name}!</p>
  		  <p>Press <PlayerButton>OK</PlayerButton> on your phone to <strong>choose a data center</strong>.</p>
      {/if}
    </div>
	</div>

{:else if stage === 'pop-spin' }
	<POPMap selectedPop={player.pop} on:popSelected={() => { if (stage === 'pop-spin') select(); } } />

{:else if stage === 'pop-confirm' }
  <div class='media-panel'>
    <div class='media-item'>
      <div class='city-image' style='background-image: url(/pops/{pop.code}.png)' />
		  <p>{pop.name}</p>
    </div>
    <div class='info'>
      <p class='title'>You'll be playing as {pop.name}</p>
      <p>Which metric will be particularly good here?<br/><strong>You have to decide</strong> what to play for!</p>
      <p>Press <PlayerButton>OK</PlayerButton> on your phone to choose one.</p>
    </div>
  </div>

{:else if stage === 'choose-metric' }
	<ul class='chooser'>
    <div class='help'>Press <PlayerButton><Icon id='left' /></PlayerButton> and <PlayerButton><Icon id='right' /></PlayerButton> on your phone to see your options</div>
		{#each options as o }
			<li class='media-panel {pick(options, chooserIndex) === o ? 'selected' : ''}'>
				<div class='card'><span>{o.name}</span></div>
				<div class='info'>
          <p><strong>{o.strap}</strong></p>
          <p>{o.description}</p>
        </div>
			</li>
		{/each}
	</ul>

{:else if stage === 'choose-pop' }
	<ul class='chooser'>
    <div class='help'>Press <PlayerButton><Icon id='left' /></PlayerButton> and <PlayerButton><Icon id='right' /></PlayerButton> on your phone to see your options</div>
		{#each options as o }
			<li class='media-panel {pick(options, chooserIndex) === o ? 'selected' : ''}'>
				<div class='media-item'>
          <div class='city-image' style='background-image: url(/pops/{o.code}.png)' />
          <p>{o.name}</p>
        </div>
        <table class='pop-stats'>
          <tr><td class='label'>Cache size</td><td><Scale value={o.size} max={4} /></td></tr>
          <tr><td class='label'>Population</td><td><Scale value={o.areaPop} max={4} /></td></tr>
          <tr><td class='label'>Area wealth</td><td><Scale value={o.gdp} max={4} /></td></tr>
          <tr><td class='label'>Daytime</td><td><Scale value={4-((Math.abs(13 - (currentHourUTC + o.tzOffset))/12)*4)} max={4} /></td></tr>
				</table>
			</li>
		{/each}
	</ul>

{/if}
