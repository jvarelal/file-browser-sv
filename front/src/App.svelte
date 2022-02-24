<script lang="ts">
	import FileBrowser from "./components/FileBrowser.svelte";
	import Dialog from "./components/modal/Dialog.svelte";
	import dialogStore from "./stores/dialogStore";
</script>

<main>
	<FileBrowser />
	{#if $dialogStore.active}
		<Dialog />
	{/if}
</main>

<style lang="scss" global>
	@import "./styles/global";
	main {
		text-align: center;
		height: 100%;
	}
</style>
