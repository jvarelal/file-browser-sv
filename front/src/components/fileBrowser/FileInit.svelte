<script lang="ts">
    import { onMount } from "svelte";
    //stores
    import fileBrowserStore from "../../stores/fileBrowserStore";
    import fileDirectoryStore from "../../stores/fileDirectoryStore";
    import fileSettingStore from "../../stores/fileSettingStore";
    //components
    import FileView from "./views/FileView.svelte";
    //types
    import type { FileApiResponse } from "../../types/ApiTypes";
    //helpers
    import { getLastTreeName } from "../../helpers/Media";

    export let files: FileApiResponse[] = [];

    onMount(() => {
        fileBrowserStore.setFiles(files, $fileDirectoryStore.current);
        fileSettingStore.updateCache($fileDirectoryStore.current);
        document.title = `FileBrowser - ${getLastTreeName(
            $fileDirectoryStore.current
        )}`;
    });
</script>

<div class:inactive={$fileBrowserStore.viewBookmarks}>
    <FileView
        files={$fileBrowserStore.files}
        active={!$fileBrowserStore.viewBookmarks}
    />
</div>
{#if $fileBrowserStore.viewBookmarks}
    <FileView files={$fileBrowserStore.bookmarks} />
{/if}
