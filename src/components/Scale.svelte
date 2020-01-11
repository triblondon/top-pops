<script>

  export let value;
  export let max;

  $: blobs = Array(Math.ceil(Number.parseInt(max))).fill().map((x, idx) => ({ filled: (idx < value) }));
</script>

<style>
  .scale {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
  }
  .scale div {
    border: 1px solid #b9b9b9;
    margin-right: 0.3em;
    height: 1em;
    flex: 1 1 0;
    transform: skew(-17deg);
	  border-radius: 0.3em;
  }
  .scale .filled {
    background: #fd3b3b;
  }
</style>

<div class='scale'>
  {#each blobs as blob }
    <div class={blob.filled ? 'filled' : ''}></div>
  {/each}
</div>
