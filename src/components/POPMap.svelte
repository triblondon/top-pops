<script>
	import POPS from '../data/pops.js';
	import { onMount, beforeUpdate, createEventDispatcher } from 'svelte';

	const SPIN_TIME = 5000;
	const SPIN_INTERVAL_START = 20;
	const SPIN_INTERVAL_DECELERATION = 1.04;
	const SPIN_DWELL_ON_FINISH = 1000;

	export let players = [];
	export let selectedPop = null;

	let playersByPop = {};
	let currentPop;
	let spinCount;
	let spinStartTime;

	const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
	const dispatch = createEventDispatcher();

	const spin = () => {
		spinCount++;
		const elapsed = Date.now() - spinStartTime;
		if (elapsed > SPIN_TIME) {
			currentPop = selectedPop;
			setTimeout(() => dispatch('popSelected'), SPIN_DWELL_ON_FINISH);
		} else {
			currentPop = randomItem(POPS).code;
			setTimeout(spin, SPIN_INTERVAL_START * Math.pow(SPIN_INTERVAL_DECELERATION, Math.floor(spinCount)));
		}
	}

	onMount(() => {
		if (selectedPop) {
			spinCount = 0;
			spinStartTime = Date.now();
			setTimeout(spin, SPIN_INTERVAL_START);
		}
	});

	beforeUpdate(() => {
		playersByPop = players.reduce((out, p) => {
			if (p.pop) out[p.pop] = p;
			return out;
		}, {});
	});
</script>

<style>
.map {
	height: 100%;
}
.map .world, .map .pops {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

ul.pops {
	list-style: none;
}
ul.pops > li {
	position: absolute;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	border: 1px solid black;
	background: red;
	margin-left: -5px;
	margin-top: -5px;
}
ul.pops > li.selected {
	box-shadow: 0 0 5px 2.5vh rgba(255,255,255,0.7);
}
ul.pops > li.selected::before {
	content: '';
	width: 5vh;
	height: 5vh;
	border-radius: 50%;
	border: 4px solid red;
	display: block;
	position: absolute;
	top: -2.5vh;
	left: -2.5vh;
	box-shadow: 0 0 5px 2px red;
}

.map-player img {
	width: 100%;
}

.map-player {
	width: 8vh;
	height: 8vh;
	background: white;
	border: 2px solid #00a5a5;
	position: absolute;
	top: -10vh;
	left: -3.5vh;
	border-radius: 3px;
	box-shadow: 0 0 2px 2px white;
}

.map li {
	position: relative;
}

.map-player::before {
	border: 2vh solid transparent;
	border-top: 2vh solid #00a5a5;
	position: absolute;
	content: "";
	top: 8vh;
	left: 2vh;
}
</style>

<div class='map panel'>
	<img class='world' src='/world.svg' alt='World map' />
	<ul class='pops'>
		{#each POPS as pop}
		<li style='left: {pop.left}%; top: {pop.top}%' title={pop.name} class={currentPop === pop.code ? "selected" : ""}>
			{#if pop.code in playersByPop }
			<div class='map-player'>
				<img alt='Cute monster' src='/avatars/{playersByPop[pop.code].avatar}.svg' />
			</div>
			{/if}
		</li>
		{/each}
	</ul>
</div>
