<script lang="ts">
    import type { FileUI } from "../../../types/UITypes";

    export let file: FileUI;
    let icon: string;
    let name: string;
    let error = false;
    $: if (file.name !== name) {
        icon = file.icon;
        name = file.name;
    }
</script>

{#if !error}
    <img
        loading="lazy"
        src={icon}
        alt={name}
        class="file-img-preview"
        on:error={(e) => (error = true)}
        on:dragstart|preventDefault
    />
{:else}
    <i class="fas fa-file-image file-img-preview" />
{/if}

<style>
    .file-img-preview {
        max-width: 100%;
        max-height: 100%;
        margin: auto;
    }
</style>
