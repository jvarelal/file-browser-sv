<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileDownloadStore from "../../../stores/fileDownloadStore";
    import dialogStore from "../../../stores/dialogStore";
    import userProfileStore from "../../../stores/userProfileStore";
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
    import userOperations from "../../../constants/UserOperations";

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
        deleteFiles(
            $fileBrowserStore[
                $fileBrowserStore.viewBookmarks ? "bookmarks" : "files"
            ].filter((f: FileUI) => f.checked)
        );
    }

    $: hideSeveralOptions =
        !$fileSettingStore.viewOptions || $fileDownloadStore.isDownloading;

    $: settingAction = [
        {
            icon: $fileSettingStore.viewOptions ? "fas fa-book-open" : "fas fa-book",
            label: "View options",
            action: () => {
                fileSettingStore.setViewOptions();
                fileBrowserStore.setCheckAll(false);
            },
            cssClass: $fileSettingStore.viewOptions ? "btn-active" : "",
            typeOperation: userOperations.read,
            disabled: false,
        },
        {
            icon: "fas fa-folder-plus",
            label: "New Element",
            action: activateModal,
            typeOperation: userOperations.write,
            hide: $fileBrowserStore.viewBookmarks || $fileBrowserStore.error,
            disabled: false,
        },
        {
            icon: "fas fa-check-square",
            label: "Check",
            action: () =>
                fileBrowserStore.setCheckAll(!$fileBrowserStore.checkAll),
            cssClass: $fileBrowserStore.checkAll ? "btn-active" : "",
            typeOperation: userOperations.read,
            hide: hideSeveralOptions,
            disabled: false,
        },
        {
            icon: "fas fa-download",
            label: "Download",
            action: () => {
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
            },
            typeOperation: userOperations.read,
            hide: hideSeveralOptions,
            disabled: !$fileBrowserStore.numberItemsChecked,
        },
        {
            icon: "fas fa-clone",
            label: `Copying ${
                $fileBrowserStore.clipboard.length && !$fileBrowserStore.move
                    ? $fileBrowserStore.clipboard.length + " elements"
                    : ""
            }`,
            action: () =>
                fileBrowserStore.setCopy(
                    $fileBrowserStore.files.filter((f) => f.checked)
                ),
            cssClass:
                $fileBrowserStore.clipboard.length && !$fileBrowserStore.move
                    ? "btn-active"
                    : "",
            typeOperation: userOperations.write,
            hide: hideSeveralOptions,
            disabled: !$fileBrowserStore.numberItemsChecked,
        },
        {
            icon: "fas fa-file-export",
            label: `Moving ${
                $fileBrowserStore.clipboard.length && $fileBrowserStore.move
                    ? $fileBrowserStore.clipboard.length + " elements"
                    : ""
            }`,
            disabled: !$fileBrowserStore.numberItemsChecked,
            cssClass:
                $fileBrowserStore.clipboard.length && $fileBrowserStore.move
                    ? "btn-active"
                    : "",
            action: () =>
                fileBrowserStore.setMove(
                    $fileBrowserStore.files.filter((f) => f.checked)
                ),
            hide: hideSeveralOptions || $fileBrowserStore.viewBookmarks,
            typeOperation: userOperations.write,
        },
        {
            icon: "fas fa-paste",
            label: "Paste",
            disabled:
                $fileBrowserStore.clipboard.length === 0 ||
                $fileBrowserStore.clipboard[0].route ===
                    $fileDirectoryStore.current,
            action: preparePasteFiles,
            hide: hideSeveralOptions || $fileBrowserStore.viewBookmarks,
            typeOperation: userOperations.write,
        },
        {
            icon: "fas fa-trash",
            label: "Eliminate",
            action: prepareDelete,
            disabled: $fileBrowserStore.numberItemsChecked <= 0,
            hide: hideSeveralOptions || $fileBrowserStore.viewBookmarks,
            typeOperation: userOperations.delete,
        },
    ].filter((opt) => $userProfileStore.actions.includes(opt.typeOperation));
</script>

<div class="m-auto">
    {#each settingAction as option}
        {#if !option.hide}
            <ActionButton
                on:click={option.action}
                icon={option.icon}
                title={option.label}
                className={option.cssClass || ""}
                disabled={option.disabled}
            />
        {/if}
    {/each}
</div>
