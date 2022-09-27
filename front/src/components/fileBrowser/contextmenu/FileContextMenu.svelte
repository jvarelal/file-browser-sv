<script context="module" lang="ts">
    function displayErrors(
        files: FileUI[],
        data: ErrorApiResponse,
        callBack: (filesAfected: FileUI[]) => void
    ): void {
        let filesAfected: FileUI[] = files.filter(
            (f) => !data?.errors?.find((err) => f.name === err.name)
        );
        listErrors(data);
        callBack(filesAfected);
    }

    function dialogsLang(): any {
        try {
            let localSettings = JSON.parse(localStorage["fe-settings"]);
            return TextLanguage[localSettings.lang].dialogs;
        } catch (e) {
            return TextLanguage["EN"].dialogs;
        }
    }

    export function listErrors(data: ErrorApiResponse) {
        let message: string = dialogsLang().fileListError();
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
        let dialogs = dialogsLang();
        let cb = () => {
            dialogStore.showMessage(dialogs.confirmDeletedFiles(files));
            fileBrowserStore.setDelete(files);
        };
        if (files.length > 0) {
            dialogStore.showDialog(dialogs.deleteFiles(files), (): void => {
                dialogStore.showLoading();
                FileService.delete(files, cb, (data) =>
                    displayErrors(files, data, fileBrowserStore.setDelete)
                );
            });
        } else {
            dialogStore.showMessage(dialogs.fileNotSelected());
        }
    }

    export function pasteFiles(fileData: FileMove): void {
        let dialogs = dialogsLang();
        let files = fileData.files;
        let cb = () => {
            dialogStore.showMessage(dialogs.fileMoveCopy(files, fileData.move));
            fileBrowserStore.setPaste(files);
        };
        if (files.length > 0) {
            dialogStore.showLoading();
            FileService.paste(fileData, cb, (data) =>
                displayErrors(files, data, fileBrowserStore.setPaste)
            );
        } else {
            dialogStore.showMessage(dialogs.fileNotSelected());
        }
    }

    export function prepareBookmark(
        file: FileUI,
        groupList: VirtualGroup[],
        bookmarks: FileUI[]
    ): void {
        if (file.checked || file.isDirectory) {
            return;
        }
        let bookmarkIndex = bookmarks.findIndex(
            (bookmark) =>
                file.route + file.name === bookmark.route + bookmark.name
        );
        let exist = bookmarkIndex >= 0;
        if (groupList.length > 1 && !exist) {
            fileBookmarkGroupStore.setFileTarget(file);
        } else {
            fileBrowserStore.updateBookmarks({
                ...file,
                virtualGroup: exist
                    ? bookmarks[bookmarkIndex].virtualGroup
                    : groupList[0].id,
            });
        }
    }
</script>

<script lang="ts">
    //stores
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import dialogStore from "../../../stores/dialogStore";
    import fileBookmarkGroupStore from "../../../stores/fileBookmarkGroupStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    //components
    import FileContextMenuItem from "./FileContextMenuItem.svelte";
    import FileContextMenuParent from "./FileContextMenuParent.svelte";
    //types
    import type {
        FileMove,
        FileUI,
        VirtualGroup,
    } from "../../../types/UITypes";
    import type { ErrorApiResponse } from "../../../types/ApiTypes";
    //helpers
    import FileService from "../../../services/FileService";
    import TextLanguage from "../../../constants/TextLanguage";
    $: lang = TextLanguage[$fileSettingStore.lang];
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
        <FileContextMenuItem {deleteFiles} {prepareBookmark} {lang} />
    {:else}
        <FileContextMenuParent {pasteFiles} {lang} />
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
