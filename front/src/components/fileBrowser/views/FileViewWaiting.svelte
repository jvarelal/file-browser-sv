<script lang="ts">
    import { onMount } from "svelte";
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";

    onMount(() => {
        fileBrowserStore.setWaiting(true);
        fileContextMenuStore.reset();
        document.title = "FileBrowser";
        return () => fileBrowserStore.setWaiting(false);
    });
</script>

<div class="d-flex m-auto loader-container w-50 transition">
    <div class="loader" />
    <div class="loader" />
    <div class="loader" />
</div>

<style>
    .loader-container {
        padding: 2rem;
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
