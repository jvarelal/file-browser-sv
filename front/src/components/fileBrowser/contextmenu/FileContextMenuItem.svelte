<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import dialogStore from "../../../stores/dialogStore";
    import fileDownloadStore from "../../../stores/fileDownloadStore";
    //components
    import FileContextMenuOption from "./FileContextMenuOption.svelte";
    //types
    import type { ContextMenuOption, FileUI } from "../../../types/UITypes";
    //helpers
    import { isBookmark } from "../../../helpers/Media";
    import FileService from "../../../services/FileService";

    export let deleteFiles: (files: FileUI[]) => void;

    const fileInfo = getContext<Function>("fileInfo");

    $: isChecked = $fileContextMenuStore.item.checked;
    let validateBookmark = isBookmark(
        $fileBrowserStore.bookmarks,
        $fileContextMenuStore?.item
    );

    let options: ContextMenuOption[] = [
        {
            icon: "fas fa-info",
            action: () => fileInfo($fileContextMenuStore.item),
            label: "Información",
            hide:
                $fileContextMenuStore.item.checked &&
                $fileBrowserStore.numberItemsChecked > 1,
        },
        {
            icon: "fas fa-arrow-right",
            action: () =>
                fileDirectoryStore.setDirectory(
                    $fileContextMenuStore.item.route,
                    $fileContextMenuStore.item.name
                ),
            label: "Ir a ubicación del archivo",
            hide:
                !$fileBrowserStore.viewBookmarks ||
                ($fileContextMenuStore.item.checked &&
                    $fileBrowserStore.numberItemsChecked > 1),
        },
        {
            icon: "fas fa-check-square",
            action: () => fileBrowserStore.setCheck($fileContextMenuStore.item),
            label: $fileContextMenuStore.item.checked
                ? "Deseleccionar elemento"
                : "Seleccionar elemento",
        },
        {
            icon: "fas fa-clone",
            action: () => {
                fileBrowserStore.setCopy(
                    isChecked
                        ? $fileBrowserStore.files.filter((f) => f.checked)
                        : [$fileContextMenuStore.item]
                );
                fileContextMenuStore.reset();
            },
            label: $fileContextMenuStore.item.checked
                ? `Copiar seleccionados`
                : "Copiar",
        },
        {
            icon: "fas fa-file-export",
            action: () => {
                fileBrowserStore.setMove(
                    isChecked
                        ? $fileBrowserStore.files.filter((f) => f.checked)
                        : [$fileContextMenuStore.item]
                );
                fileContextMenuStore.reset();
            },
            label: $fileContextMenuStore.item.checked
                ? `Mover seleccionados`
                : "Mover",
            hide: $fileBrowserStore.viewBookmarks,
        },
        {
            icon: "fas fa-trash",
            action: () => {
                let files: FileUI[] = isChecked
                    ? $fileBrowserStore.files.filter((f) => f.checked)
                    : [$fileContextMenuStore.item];
                deleteFiles(files);
            },
            label: $fileContextMenuStore.item.checked
                ? `Eliminar seleccionados`
                : "Eliminar",
            hide: $fileBrowserStore.viewBookmarks ||
                $fileDownloadStore.isDownloading,
        },
        {
            icon: "fas fa-download",
            action: () => {
                let files: FileUI[] = isChecked
                    ? $fileBrowserStore.files.filter((f) => f.checked)
                    : [$fileContextMenuStore.item];
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
            label: $fileContextMenuStore.item.checked
                ? `Descargar seleccionados`
                : "Descargar",
            hide: $fileDownloadStore.isDownloading
        },
        {
            icon: "fas fa-star",
            action: () =>
                fileBrowserStore.updateBookmarks($fileContextMenuStore?.item),
            label: `${
                validateBookmark ? "Quitar de " : "Agregar a "
            } Marcadores`,
            hide:
                $fileContextMenuStore.item.checked ||
                $fileContextMenuStore.item?.isDirectory,
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
