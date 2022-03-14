<script lang="ts">
    import { onMount } from "svelte";
    //stores
    import fileBrowserStore from "../../stores/fileBrowserStore";
    import fileDirectoryStore from "../../stores/fileDirectoryStore";
    import fileSettingStore from "../../stores/fileSettingStore";
    import userProfileStore from "../../stores/userProfileStore";
    //components
    import FileView from "./views/FileView.svelte";
    //types
    import type { FileListApiResponse } from "../../types/ApiTypes";
    //helpers
    import { getLastTreeName } from "../../helpers/Media";
    import UserService from "../../services/UserService";

    export let apiResponse: FileListApiResponse;

    $: if (
        $fileBrowserStore.viewBookmarks &&
        $fileBrowserStore.bookmarks.length === 0
    ) {
        UserService.getBookmarks(
            (resp) => {
                fileBrowserStore.setBookmarks(resp.files);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    onMount(() => {
        fileBrowserStore.setFiles(
            apiResponse.files,
            $fileDirectoryStore.current
        );
        fileSettingStore.updateCache($fileDirectoryStore.current);
        userProfileStore.setActions(apiResponse.actions);

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
