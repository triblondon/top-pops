<script>
	import METRICS from '../data/metrics.js';

  export let metric;
  export let value;

  $: type = METRICS.find(m => m.code === metric).type;

  const unitsByMetricType = {
    percentage: '%',
    milliseconds: 'ms',
    diversity: '',
    segs: '',
    bytes: 'b',
    kbps: 'kbps'
  };

</script>

{#if value }
  {value}{unitsByMetricType[type]}
{:else}
  ···
{/if}
