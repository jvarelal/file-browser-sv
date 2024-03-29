<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileDownloadStore from "../../../stores/fileDownloadStore";
    //components
    import FileContextMenuOption from "./FileContextMenuOption.svelte";
    //types
    import type { ContextMenuOption, FileMove } from "../../../types/UITypes";

    export let pasteFiles: (fileData: FileMove) => void;

    const activateModal = getContext<VoidFunction>("fileAdd");
    const fileInfo = getContext<Function>("fileInfo");

    let options: ContextMenuOption[] = [
        {
            icon: "fas fa-folder-plus",
            action: activateModal,
            label: "Agregar archivos",
            hide:
                $fileBrowserStore.viewBookmarks ||
                $fileDownloadStore.isDownloading,
        },
        {
            icon: "fas fa-eye",
            action: () => {
                fileSettingStore.setViewOptions();
                fileBrowserStore.setCheckAll(false);
            },
            label: `${
                $fileSettingStore.viewOptions ? "Ocultar" : "Mostrar"
            } opciones de archivo`,
            hide: $fileBrowserStore.numberItems === 0,
        },
        {
            icon: "fas fa-check-square",
            action: () =>
                fileBrowserStore.setCheckAll(!$fileBrowserStore.checkAll),
            label: $fileBrowserStore.checkAll
                ? "Deseleccionar todos"
                : "Seleccionar todos",
            hide: $fileBrowserStore.numberItems === 0,
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
            label: "Pegar",
            hide:
                $fileBrowserStore.clipboard.length === 0 ||
                $fileBrowserStore.clipboard[0].route ===
                    $fileDirectoryStore.current ||
                $fileDownloadStore.isDownloading,
        },
        {
            icon: "fas fa-info",
            label: `Información de ${$fileContextMenuStore.parent.name}`,
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
        },
    ];
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
