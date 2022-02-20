<script lang="ts">
	import { Router, Route } from "svelte-navigator";
	import FileBrowser from "./components/FileBrowser.svelte";
	import Login from "./components/Login.svelte";
	import Dialog from "./components/modal/Dialog.svelte";
	import dialogStore from "./stores/dialogStore";
</script>

<Router>
	<main>
		<Route path="/" component={FileBrowser} />
		<Route path="/login" component={Login} />
		{#if $dialogStore.active}
			<Dialog />
		{/if}
	</main>
</Router>

<style lang="scss" global>
	@import "./styles/global";
	main {
		text-align: center;
		height: 100%;
	}
</style>
