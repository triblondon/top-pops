<script context="module">
	import uuid from 'uuid/v4';
	return this.redirect(302, '/game/' + uuid());
</script>
