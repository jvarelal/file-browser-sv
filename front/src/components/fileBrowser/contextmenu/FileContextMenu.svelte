<script context="module" lang="ts">
    function displayErrors(
        files: FileUI[],
        data: ErrorApiResponse,
        callBack: (filesAfected: FileUI[]) => void
    ): void {
        let filesAfected: FileUI[] = files.filter(
            (f) =>
                !data?.errors?.find(
                    (err) => f.route + f.name === err.route + err.name
                )
        );
        listErrors(data)
        callBack(filesAfected);
    }

    export function listErrors(data: ErrorApiResponse) {
        let message: string =
            "Se presento un problema al operar los archivos: ";
        if (data?.errors?.length > 0) {
            let complement: string = "<ul>";
            data.errors.forEach(
                (e) => (complement += `<li>${e.name}: ${e.message}</li>`)
            );
            message += complement + "</ul>";
        }
        message += " " + data.message;
        dialogStore.showMessage(message);
    }

    export function deleteFiles(files: FileUI[] = []): void {
        let cb = () => {
            let message: string = `${files.length} archivos eliminados`;
            if (files.length === 1) {
                message = `${files[0].name} fue eliminado`;
            }
            dialogStore.showMessage(message);
            fileBrowserStore.setDelete(files);
        };
        if (files.length > 0) {
            dialogStore.showDialog(
                `¿Está seguro de eliminar ${
                    files.length > 1
                        ? `los ${files.length} elementos seleccionados`
                        : ` ${files[0].name}?`
                }?`,
                (): void => {
                    dialogStore.showLoading();
                    FileService.delete(files, cb, (data) =>
                        displayErrors(files, data, fileBrowserStore.setDelete)
                    );
                }
            );
        } else {
            dialogStore.showMessage("No se ha seleccionado ningún elemento");
        }
    }

    export function pasteFiles(fileData: FileMove): void {
        let files = fileData.files;
        let cb = () => {
            let message = `${files.length} archivos ${
                fileData.move ? "movidos" : "copiados"
            }`;
            if (files.length === 1) {
                message = `${files[0].name} ${
                    fileData.move ? "movido" : "copiado"
                }`;
            }
            dialogStore.showMessage(message);
            fileBrowserStore.setPaste(files);
        };
        if (files.length > 0) {
            dialogStore.showLoading();
            FileService.paste(fileData, cb, (data) =>
                displayErrors(files, data, fileBrowserStore.setPaste)
            );
        } else {
            dialogStore.showMessage(
                "No se ha seleccionado ningún elemento para la operación"
            );
        }
    }
</script>

<script lang="ts">
    //stores
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import dialogStore from "../../../stores/dialogStore";
    //components
    import FileContextMenuItem from "./FileContextMenuItem.svelte";
    import FileContextMenuParent from "./FileContextMenuParent.svelte";
    //types
    import type { FileMove, FileUI } from "../../../types/UITypes";
    import type { ErrorApiResponse } from "../../../types/ApiTypes";
    //helpers
    import FileService from "../../../services/FileService";
</script>

<svelte:window
    on:keydown={(e) => {
        if (
            !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)
        ) {
            fileContextMenuStore.closeContext();
        }
    }}
    on:click={fileContextMenuStore.closeContext}
    on:scroll={fileContextMenuStore.closeContext}
/>
<div
    class="context-menu"
    style={`width: ${$fileContextMenuStore.width}px; top: ${$fileContextMenuStore.top}px; left: ${$fileContextMenuStore.left}px;`}
    on:contextmenu|preventDefault
>
    {#if $fileContextMenuStore.showItem}
        <FileContextMenuItem {deleteFiles} />
    {:else}
        <FileContextMenuParent {pasteFiles} />
    {/if}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .context-menu {
        position: fixed;
        z-index: 1000;
        font-size: 0.85rem;
        background-color: $bg-btn;
        color: $color-text;
        text-align: left;
        border: 1px solid $border-light;
        transform-origin: top left;
        transform: scale(1);
    }
</style>
