<script>
  export let id;
</script>

<style>
svg {
  width: 1em;
  height: 1em;
}
</style>

{#if id === 'left'}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 80 105">
      <g>
        <path d="M68.7 2.5c2.6 0 5.1 1 7.1 2.9a10 10 0 010 14.2L45.5 50l30.4 30.4a10 10 0 010 14.2 10 10 0 01-14.2 0L24.2 57.1c-1.9-1.9-2.9-4.4-2.9-7.1s1.1-5.2 2.9-7.1L61.6 5.4c2-1.9 4.6-2.9 7.1-2.9z"/>
      </g>
  </svg>
{:else if id === 'right'}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 80 105">
    <g>
      <path d="M31.3 97.5c-2.6 0-5.1-1-7.1-2.9a10 10 0 010-14.2L54.5 50 24.2 19.6a10 10 0 010-14.2 10 10 0 0114.2 0l37.5 37.5c1.9 1.9 2.9 4.4 2.9 7.1s-1.1 5.2-2.9 7.1L38.4 94.6c-2 1.9-4.6 2.9-7.1 2.9z"/>
    </g>
  </svg>
{:else if id === 'medal'}
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <linearGradient gradientUnits="userSpaceOnUse" id="a" x1="0" x2="512" y1="256" y2="256">
      <stop offset="0" stop-color="#e24263"/>
      <stop offset="1" stop-color="#dd1e47"/>
    </linearGradient>
    <circle cx="256" cy="256" fill="url(#a)" r="256"/>
    <linearGradient gradientUnits="userSpaceOnUse" id="b" x1="42.7" x2="469.3" y1="256" y2="256">
      <stop offset="0" stop-color="#dd1e47"/>
      <stop offset="1" stop-color="#e24263"/>
    </linearGradient>
    <path d="M256 469.3c-117.6 0-213.3-95.7-213.3-213.3S138.4 42.7 256 42.7c117.6 0 213.3 95.7 213.3 213.3S373.6 469.3 256 469.3z" fill="url(#b)"/>
    <g>
      <path d="M241.6 211.7l-32-67.7-65.6.3L191.7 245a91.3 91.3 0 0149.9-33.4zM336.3 245c16-33.5 31.8-67.1 47.7-100.7l-65.6-.3-32 67.7a91.3 91.3 0 0150 33.4z" opacity=".3"/>
      <path d="M264 218.8a82 82 0 00-81.3 82.6A82 82 0 00264 384a82 82 0 0081.3-82.6 82 82 0 00-81.3-82.6zM290.6 347h-51.2v-10H260v-59.2h-20.6v-10H260v-9h10V337h20.6v10z" opacity=".3"/>
    </g>
    <g fill="#FFF">
      <path d="M233.6 203.7l-32-67.7-65.6.3L183.7 237a91.3 91.3 0 0149.9-33.4zM328.3 237c16-33.5 31.8-67.1 47.7-100.7l-65.6-.3-32 67.7a91.3 91.3 0 0150 33.4z"/>
      <path d="M256 210.8a82 82 0 00-81.3 82.6A82 82 0 00256 376a82 82 0 0081.3-82.6 82 82 0 00-81.3-82.6zM282.6 339h-51.2v-10H252v-59.2h-20.6v-10H252v-9h10V329h20.6v10z"/>
    </g>
  </svg>
{/if}
