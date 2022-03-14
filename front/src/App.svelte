<script lang="ts">
	import FileBrowser from "./components/FileBrowser.svelte";
	import Login from "./components/Login.svelte";
	import Dialog from "./components/modal/Dialog.svelte";
	import UserOptions from "./components/UserOptions.svelte";
	import appViewStore from "./stores/appViewStore";
	import fileSettingStore from "./stores/fileSettingStore";
	import dialogStore from "./stores/dialogStore";
</script>

<main class:main-transition={$fileSettingStore.transitions}>
	{#if $appViewStore.login}
		<Login />
	{:else if $appViewStore.browser}
		<FileBrowser />
	{:else if $appViewStore.userControl}
		<UserOptions />
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
		overflow: hidden;
	}
</style>
