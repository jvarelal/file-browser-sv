<script lang="ts">
	import FileBrowser from "./components/FileBrowser.svelte";
	import Login from "./components/Login.svelte";
	import Dialog from "./components/modal/Dialog.svelte";
	import UserControl from "./components/UserControl.svelte";
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
		<UserControl />
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
