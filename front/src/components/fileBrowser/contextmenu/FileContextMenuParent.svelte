<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileDownloadStore from "../../../stores/fileDownloadStore";
    import userProfileStore from "../../../stores/userProfileStore";
    //components
    import FileContextMenuOption from "./FileContextMenuOption.svelte";
    //types
    import userOperations from "../../../constants/UserOperations";
    import type {
        ContextMenuOption,
        FileMove,
        TxtLang,
    } from "../../../types/UITypes";

    export let pasteFiles: (fileData: FileMove) => void;
    export let lang: TxtLang;

    const activateModal = getContext<VoidFunction>("fileAdd");
    const fileInfo = getContext<Function>("fileInfo");

    let options: ContextMenuOption[] = [
        {
            icon: "fas fa-folder-plus",
            action: activateModal,
            label: lang.contextMenu.parent.addFiles(),
            hide:
                $fileBrowserStore.viewBookmarks ||
                $fileDownloadStore.isDownloading,
            typeOperation: userOperations.write,
        },
        {
            icon: "fas fa-eye",
            action: () => {
                fileSettingStore.setViewOptions();
                fileBrowserStore.setCheckAll(false);
            },
            label: lang.contextMenu.parent.fileOptions(
                $fileSettingStore.viewOptions
            ),
            hide: $fileBrowserStore.numberItems === 0,
            typeOperation: userOperations.read,
        },
        {
            icon: "fas fa-check-square",
            action: () =>
                fileBrowserStore.setCheckAll(!$fileBrowserStore.checkAll),
            label: lang.contextMenu.parent.checkFiles(
                $fileBrowserStore.checkAll
            ),
            hide: $fileBrowserStore.numberItems === 0,
            typeOperation: userOperations.read,
        },
        {
            icon: "fas fa-paste",
            action: () => {
                let fileToMove: FileMove = {
                    files: $fileBrowserStore.clipboard,
                    move: $fileBrowserStore.move,
                    route: $fileDirectoryStore.current,
                };
                pasteFiles(fileToMove);
            },
            label: lang.contextMenu.parent.pasteFile(),
            hide:
                $fileBrowserStore.clipboard.length === 0 ||
                $fileBrowserStore.clipboard[0].route ===
                    $fileDirectoryStore.current ||
                $fileDownloadStore.isDownloading,
            typeOperation: userOperations.write,
        },
        {
            icon: "fas fa-info",
            label: lang.contextMenu.parent.fileInfo(
                $fileContextMenuStore.parent.name
            ),
            action: () => {
                let parts = $fileDirectoryStore.current.split("/");
                let name = parts.pop();
                fileInfo({
                    isDirectory: true,
                    route: parts.join("/"),
                    name,
                });
            },
            hide: $fileBrowserStore.viewBookmarks,
            typeOperation: userOperations.read,
        },
    ].filter((opt) => $userProfileStore.actions.includes(opt.typeOperation));
</script>

<div>
    {#each options as option}
        {#if !option.hide}
            <FileContextMenuOption
                icon={option.icon}
                label={option.label}
                on:click={option.action}
            />
        {/if}
    {/each}
</div>
