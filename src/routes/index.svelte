<script context="module">
	import uuid from 'uuid/v4';

	export async function preload(page, session) {	
		return this.redirect(302, '/game/' + uuid());
	}
</script>
