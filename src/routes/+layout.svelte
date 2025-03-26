<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		width: 100vw;
		height: 100vh;
		background: url(/src/lib/assets/background.jpg) no-repeat center;
		background-size: cover;
		display: grid;
		place-items: center;
	}
</style>
