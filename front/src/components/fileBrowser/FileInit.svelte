<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
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
    let showBookmarks: boolean = false;

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
    function existTransition(node: HTMLElement, options: any): any {
        if ($fileSettingStore.transitions) {
            return options.fn(node, options);
        }
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

<div class="transition" class:inactive={showBookmarks}>
    <FileView
        files={$fileBrowserStore.files}
        active={!$fileBrowserStore.viewBookmarks}
    />
</div>
{#if $fileBrowserStore.viewBookmarks}
    <div
        transition:existTransition={{ fn: fly, y: 200, duration: 250 }}
        on:introstart={() => (showBookmarks = true)}
        on:outroend={() => (showBookmarks = false)}
    >
        <FileView files={$fileBrowserStore.bookmarks} />
    </div>
{/if}
