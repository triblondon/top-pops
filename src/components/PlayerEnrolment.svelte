<script>
	import POPS from '../data/pops.js';
	import METRICS from '../data/metrics.js';
	import POPMap from './POPMap.svelte';
	import PlayerButton from './PlayerButton.svelte';

	export let player;
	export let type;
	export let game;

	let stage = 'init';
	let chooserIndex = 1000; // Order inverts when < 0, easier just to start with a big number

	$: options = type === 'first' ? METRICS : POPS.filter(p => !game.players.some(pl => pl.pop === p.code));
	$: metric = game.metric && METRICS.find(m => m.code === game.metric);
	$: pop = player.pop && POPS.find(p => p.code === player.pop);

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
	position: relative;
	height: 70vh;
}
.chooser li {
	display: none;
}
.chooser li.selected {
	display: flex;
	width: 100%;
	height: 100%;
}
.chooser-media {
	flex: 0 0 50%;
	background: #444;
	background-size: cover;
	background-position: center;
	color: white;
	margin-right: 2vw;
	padding: 40px;
	box-sizing: border-box;
}
.new-player > .avatar {
	float: left;
	width: 30%;
}
.new-player .name {
	font-size: 6vh;
}
.opponents {
	list-style: none;
}
.opponents > li > .avatar {
	width: 100px;
	display: inline-block;
	vertical-align: middle;
}

</style>

{#if stage === 'init' }
	<h1>New player!</h1>
	<div class='new-player panel'>
		<img class='avatar' alt='Cute monster' src='/avatars/{player.avatar}.svg' />
		<p class='name'>{player.name}</p>
		{#if type === 'first' }
			<p>You're the first one here! First, we're going to choose a Fastly edge data center location for you.  Then, <strong>you</strong> get to choose a metric to play for.</p>
		{:else}
			<p>This game is about <strong>{metric.name}</strong>.  You're playing against:</p>
			<ul class='opponents'>
			{#each game.players.filter(p => p.id !== player.id) as opponent }
				<li><img class='avatar' alt='Cute monster' src='/avatars/{opponent.avatar}.svg' /> <strong>{opponent.name}</strong> in <strong>{POPS.find(p => p.code === opponent.pop).name}</strong></li>
			{/each}
			</ul>
			<p>Now you need to choose a Fastly edge data center location, which you think can score better than your opponents on {metric.name}!</p>
		{/if}
		<p>Press <PlayerButton>OK</PlayerButton> on your phone.</p>
	</div>

{:else if stage === 'pop-spin' }
	<h1>Let's choose an edge data center...</h1>
	<POPMap selectedPop={player.pop} on:popSelected={select} /> <!-- TODO fire select only if state===pop-spin -->

{:else if stage === 'pop-confirm' }
	<h1>Congrats!  You got {pop.name}</h1>
  <p><img alt='{pop.name}' src='/pops/{pop.code}.png' /></p>
	<p>Press <PlayerButton>OK</PlayerButton> on your phone</p>

{:else if stage === 'choose-metric' }
	<h1>Pick a metric!</h1>
	<ul class='chooser panel'>
		{#each options as o }
			<li class={pick(options, chooserIndex) === o ? 'selected' : ''}>
				<div class='chooser-media'><h2>{o.name}</h2></div>
				<div class='chooser-detail'>
          <p><strong>{o.strap}</strong></p>
          <p>{o.description}</p>
        </div>
			</li>
		{/each}
	</ul>

{:else if stage === 'choose-pop' }
	<h1>Pick a Fastly data center!</h1>
	<ul class='chooser panel'>
		{#each options as o }
			<li class={pick(options, chooserIndex) === o ? 'selected' : ''}>
				<div class='chooser-media' style='background-image: url(/pops/{o.code}.png)'></div>
				<div class='chooser-detail'>
					<h2>{o.name}</h2>
					<p>Fastly cache servers: {o.nodes}</p>
					<p>People within 500km: {o.areaPop}</p>
				</div>
			</li>
		{/each}
	</ul>

{/if}
