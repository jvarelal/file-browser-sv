<script lang="ts">
    import { onMount } from "svelte";
    import fileBrowserStore from "../../../stores/fileBrowserStore";

    onMount(() => {
        fileBrowserStore.setWaiting(true);
        document.title = "FileBrowser";
        return () => fileBrowserStore.setWaiting(false);
    });
</script>

<div class="d-flex m-auto loader-container w-50">
    <div class="loader" />
    <div class="loader" />
    <div class="loader" />
</div>

<style>
    .loader-container {
        padding: 2rem;
        transition: all 0.15s;
    }
    .loader {
        border: 4px solid #e7b2b1;
        border-top: 3px solid #9d693a;
        border-radius: 25%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
        margin: auto;
    }
</style>
