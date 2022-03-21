<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import dialogStore from "../../../stores/dialogStore";
    import fileDownloadStore from "../../../stores/fileDownloadStore";
    import userProfileStore from "../../../stores/userProfileStore";
    import fileBookmarkGroupStore from "../../../stores/fileBookmarkGroupStore";
    //components
    import FileContextMenuOption from "./FileContextMenuOption.svelte";
    //types
    import userOperations from "../../../constants/UserOperations";
    import type {
        ContextMenuOption,
        FileUI,
        VirtualGroup,
    } from "../../../types/UITypes";
    //helpers
    import { isBookmark } from "../../../helpers/Media";
    import FileService from "../../../services/FileService";

    export let deleteFiles: (files: FileUI[]) => void;
    export let prepareBookmark: (file: FileUI, groups: VirtualGroup[], bookmarks: FileUI[]) => void;

    const fileInfo = getContext<Function>("fileInfo");

    $: isChecked = $fileContextMenuStore.item.checked;
    let validateBookmark = isBookmark(
        $fileBrowserStore.bookmarks,
        $fileContextMenuStore?.item
    );

    let options: ContextMenuOption[] = [
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
            typeOperation: userOperations.read,
        },
        {
            icon: "fas fa-check-square",
            action: () => fileBrowserStore.setCheck($fileContextMenuStore.item),
            label: $fileContextMenuStore.item.checked
                ? "Deseleccionar elemento"
                : "Seleccionar elemento",
            typeOperation: userOperations.read,
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
            typeOperation: userOperations.write,
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
            typeOperation: userOperations.write,
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
            hide:
                $fileBrowserStore.viewBookmarks ||
                $fileDownloadStore.isDownloading,
            typeOperation: userOperations.delete,
        },
        {
            icon: "fas fa-download",
            action: () => {
                let files: FileUI[] = isChecked
                    ? $fileBrowserStore[
                          $fileBrowserStore.viewBookmarks
                              ? "bookmarks"
                              : "files"
                      ].filter((f) => f.checked)
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
            hide: $fileDownloadStore.isDownloading,
            typeOperation: userOperations.read,
        },
        {
            icon: "fas fa-info",
            action: () => fileInfo($fileContextMenuStore.item),
            label: "Información",
            hide:
                $fileContextMenuStore.item.checked &&
                $fileBrowserStore.numberItemsChecked > 1,
            typeOperation: userOperations.read,
        },
        {
            icon: "fas fa-star",
            action: () =>
                prepareBookmark(
                    $fileContextMenuStore?.item,
                    $fileBookmarkGroupStore.groupList,
                    $fileBrowserStore.bookmarks
                ),
            label: `${
                validateBookmark ? "Quitar de " : "Agregar a "
            } Marcadores`,
            hide:
                $fileContextMenuStore.item.checked ||
                $fileContextMenuStore.item?.isDirectory,
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
