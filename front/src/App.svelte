<script lang="ts">
	import FileBrowser from "./components/FileBrowser.svelte";
	import Login from "./components/Login.svelte";
	import Dialog from "./components/modal/Dialog.svelte";
	import appViewStore from "./stores/appViewStore";
	import dialogStore from "./stores/dialogStore";
</script>

<main>
	{#if $appViewStore.login}
		<Login />
	{:else}
		<FileBrowser />
	{/if}
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
