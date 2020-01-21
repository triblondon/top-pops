<script>
  import POPS from '../data/pops.js';
  import { onMount, beforeUpdate, createEventDispatcher } from 'svelte';

  const SPIN_TIME = 5000;
  const SPIN_INTERVAL_START = 20;
  const SPIN_INTERVAL_DECELERATION = 1.04;
  const SPIN_DWELL_ON_FINISH = 1000;

  export let players = [];
  export let selectedPop = null;
  export let popStats = {};

  let playersByPop = {};
  let currentPop;
  let spinCount;
  let spinStartTime;

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const relSize = (qty) => Math.min(Math.cbrt(qty || 1) * 2, 10);
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
  font-size: 60%;
}
ul.pops > li {
  position: absolute;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 1px solid black;
  background: red;
  margin-left: -0.5em;
  margin-top: -0.5em;
}
ul.pops > li.selected::before {
  content: '';
  width: 3em;
  height: 3em;
  border-radius: 50%;
  border: 0.2em solid red;
  display: block;
  position: absolute;
  top: -1em;
  left: -1em;
}

.map-player {
  width: 3em;
  height: 3em;
  background: white;
  border: 2px solid #00a5a5;
  position: absolute;
  top: -3.5em;
  left: -1em;
  border-radius: 0.1em;
  box-shadow: 0 0.1em 1em 0.4em white;
}
.map-player::before {
  border: 1em solid transparent;
  border-top: 1em solid #00a5a5;
  position: absolute;
  content: "";
  top: 3em;
  left: 0.5em;
}
.map-player img {
  width: 100%;
}

.ray {
  position: absolute;
  left: 0;
  top: 0;
  width: 1em;
  height: 1em;
  transform-origin: center;
  transition: transform 2.5s ease;
  border-radius: 50%;
  background: #ff1b1b;
  opacity: 0.3;
  box-shadow: 0 0 0.05em 0.05em #ff1b1b;
}
</style>

<div class='map panel'>
  <img class='world' src='/world.svg' alt='World map' />
  <ul class='pops'>
    {#each POPS as pop}
    <li style='left: {pop.left}%; top: {pop.top}%' title={pop.name} class={currentPop === pop.code ? "selected" : ""}>
      <div class='ray' style='transform: scale({relSize(popStats[pop.code])}, {relSize(popStats[pop.code])})' />
      <!--
      {#each Array(popStats[pop.code] || 0) as _, i }
        <path d='M 50 50 L 100 100' stroke='black' />
      {/each}
      -->
      {#if pop.code in playersByPop }
      <div class='map-player'>
        <img alt='Cute monster' src='/avatars/{playersByPop[pop.code].avatar}.svg' />
      </div>
      {/if}
    </li>
    {/each}
  </ul>
</div>
