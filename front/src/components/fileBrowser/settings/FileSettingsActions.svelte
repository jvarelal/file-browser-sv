<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileDownloadStore from "../../../stores/fileDownloadStore";
    //components
    import ActionButton from "../../commons/ActionButton.svelte";
    //types
    import type { FileMove, FileUI } from "../../../types/UITypes";
    //functions
    import {
        deleteFiles,
        pasteFiles,
    } from "../contextmenu/FileContextMenu.svelte";
    import FileService from "../../../services/FileService";
    import dialogStore from "../../../stores/dialogStore";

    const activateModal = getContext<VoidFunction>("fileAdd");

    function preparePasteFiles(): void {
        let fileToMove: FileMove = {
            files: $fileBrowserStore.clipboard,
            move: $fileBrowserStore.move,
            route: $fileDirectoryStore.current,
        };
        pasteFiles(fileToMove);
    }

    function prepareDelete(): void {
        deleteFiles($fileBrowserStore[prop].filter((f: FileUI) => f.checked));
    }

    $: prop = $fileBrowserStore.viewBookmarks ? "bookmarks" : "files";
</script>

<div>
    {#if !$fileBrowserStore.viewBookmarks}
        <ActionButton
            on:click={activateModal}
            icon="fas fa-folder-plus"
            title="New Element"
        />
    {/if}
    {#if $fileSettingStore.viewOptions && !$fileDownloadStore.isDownloading}
        <ActionButton
            icon="fas fa-check-square"
            title="Check"
            className={$fileBrowserStore.checkAll ? "btn-active" : ""}
            on:click={() =>
                fileBrowserStore.setCheckAll(!$fileBrowserStore.checkAll)}
        />
        <ActionButton
            icon="fas fa-download"
            title="Download"
            disabled={!$fileBrowserStore.numberItemsChecked}
            on:click={() => {
                let files = $fileBrowserStore.files.filter((f) => f.checked);
                fileDownloadStore.setDownload(files);
                FileService.download(
                    files,
                    fileDownloadStore.finishDownload,
                    (err) => {
                        dialogStore.showMessage(err.message);
                        fileDownloadStore.finishDownload();
                    }
                );
            }}
        />
        <ActionButton
            icon="fas fa-clone"
            title={`Copying ${
                $fileBrowserStore.clipboard.length && !$fileBrowserStore.move
                    ? $fileBrowserStore.clipboard.length + " elements"
                    : ""
            }`}
            disabled={!$fileBrowserStore.numberItemsChecked}
            className={$fileBrowserStore.clipboard.length &&
            !$fileBrowserStore.move
                ? "btn-active"
                : ""}
            on:click={() =>
                fileBrowserStore.setCopy(
                    $fileBrowserStore.files.filter((f) => f.checked)
                )}
        />
        <ActionButton
            icon="fas fa-file-export"
            title={`Moving ${
                $fileBrowserStore.clipboard.length && $fileBrowserStore.move
                    ? $fileBrowserStore.clipboard.length + " elements"
                    : ""
            }`}
            disabled={!$fileBrowserStore.numberItemsChecked}
            className={$fileBrowserStore.clipboard.length &&
            $fileBrowserStore.move
                ? "btn-active"
                : ""}
            on:click={() =>
                fileBrowserStore.setMove(
                    $fileBrowserStore.files.filter((f) => f.checked)
                )}
        />
        <ActionButton
            icon="fas fa-paste"
            title="Paste"
            disabled={$fileBrowserStore.clipboard.length === 0 ||
                $fileBrowserStore.clipboard[0].route ===
                    $fileDirectoryStore.current}
            on:click={preparePasteFiles}
        />
        <ActionButton
            disabled={$fileBrowserStore.numberItemsChecked <= 0}
            icon="fas fa-trash"
            title="Eliminate"
            on:click={prepareDelete}
        />
    {/if}
</div>
