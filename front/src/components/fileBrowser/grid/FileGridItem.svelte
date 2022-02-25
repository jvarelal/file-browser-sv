<script context="module" lang="ts">
    /**
     * Control focus on elements
     */
    const map: Map<string, HTMLElement> = new Map();
    let currentIdx = 0;
    function focusItem(key: string, idx: number): void {
        map.get(key + idx)?.focus();
        currentIdx = idx;
    }
</script>

<script lang="ts">
    import { getContext, onMount } from "svelte";
    //Stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import filePreviewStore from "../../../stores/filePreviewStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileGridCssStore from "../../../stores/fileGridCssStore";
    import scrollStore from "../../../stores/scrollStore";
    //helpers
    import FileBrowser from "../../../constants/FileBrowser";
    import { deleteFiles } from "../contextmenu/FileContextMenu.svelte";
    import { isBookmark } from "../../../helpers/Media";
    import type { FileUI } from "../../../types/UITypes";

    export let file: FileUI;
    export let viewItem: (file: FileUI) => void;
    export let list: boolean = false;

    const key: string = getContext<string>("id");
    let element: HTMLElement;
    let style: string = "";
    let backFocusedFlag: boolean = false;

    function validateScroll(target: HTMLElement) {
        if (!$filePreviewStore.get(key)) {
            setTimeout(() => {
                target.scrollIntoView({behavior: "smooth"});
            }, 500);
        }
    }
    function processItem(e: Event): void {
        validateScroll(e.target as HTMLElement);
        map.get(key + file.idxFocus).focus();
        if (file.isDirectory) {
            fileDirectoryStore.setDirectory(
                $fileDirectoryStore.current + "/" + file.name
            );
        } else if (FileBrowser.visor.includes(file.type)) {
            scrollStore.setPreviousHeight($scrollStore.startHeight);
            viewItem(file);
        } else {
            console.log("download");
        }
    }
    function focusNext(): void {
        let idxTarget = file.idxFocus + 1;
        if (idxTarget < $fileBrowserStore.numberItems)
            focusItem(key, idxTarget);
    }
    function focusPrev(): void {
        let idxTarget = file.idxFocus - 1;
        if (idxTarget >= 0) focusItem(key, idxTarget);
    }
    function focusDown(): void {
        if (list) {
            focusNext();
        } else {
            if (!$filePreviewStore.get(key)) {
                let newIdx = file.idxFocus + $fileGridCssStore.perRow;
                if (newIdx < $fileBrowserStore.numberItems) {
                    focusItem(key, newIdx);
                } else {
                    focusItem(key, $fileBrowserStore.numberItems - 1);
                }
            }
        }
    }
    function focusUp(): void {
        if (list) {
            focusPrev();
        } else {
            if (!$filePreviewStore.get(key)) {
                let newIdx = file.idxFocus - $fileGridCssStore.perRow;
                if (newIdx > 0) {
                    focusItem(key, newIdx);
                } else {
                    focusItem(key, 0);
                }
            }
        }
    }
    function validateKey(e: KeyboardEvent): void {
        switch (e.key) {
            case "Enter":
                return processItem(e);
            case "Delete":
                return $fileBrowserStore.viewBookmarks
                    ? null
                    : deleteFiles(
                          file.checked
                              ? $fileBrowserStore.files.filter((f) => f.checked)
                              : [file]
                      );
            case "ArrowRight":
                return focusNext();
            case "ArrowLeft":
                return focusPrev();
            case "ArrowDown":
                e.preventDefault();
                return focusDown();
            case "ArrowUp":
                e.preventDefault();
                return focusUp();
            case "C":
            case "c":
                return fileBrowserStore.setCheck(file);
            case "M":
            case "m":
                return file.checked || file.isDirectory
                    ? null
                    : fileBrowserStore.updateBookmarks(file);
            default:
                return;
        }
    }

    onMount(() => {
        if (file.idxFocus === 0) {
            if (!$fileGridCssStore.previousSet) {
                fileGridCssStore.setGridInfo(
                    element.getBoundingClientRect().width
                );
            }
            if (!$fileDirectoryStore.itemFocus) {
                element.focus();
            }
        }
        map.set(key + file.idxFocus, element);
        return () =>{
            map.delete(key + file.idxFocus);
            currentIdx = 0
        }
    });
    //move focus on preview
    $: if (
        $filePreviewStore.get(key)?.route + $filePreviewStore.get(key)?.name ===
        file.route + file.name
    ) {
        style = `background-color: #0c9aaa66;`;
        element?.focus();
        backFocusedFlag = true;
    } else {
        style = "";
        if (file.idxFocus === currentIdx && !$fileBrowserStore.filter) {
            element?.focus();
        }
    }
    //focus on previous folder
    $: if (
        !$fileBrowserStore.filter &&
        file.name === $fileDirectoryStore.itemFocus &&
        !backFocusedFlag
    ) {
        element?.focus();
    }
</script>

<div
    class="file-item"
    class:bookmark={isBookmark($fileBrowserStore.bookmarks, file)}
    class:moving={$fileBrowserStore.clipboard.find(
        (f) => f.route + f.name === file.route + file.name
    ) && $fileBrowserStore.move}
    class:selected={file.checked}
    class:list
    class:grid={!list}
    {style}
    tabindex="0"
    bind:this={element}
    on:contextmenu|preventDefault|stopPropagation={({ pageX, pageY }) => {
        element.focus();
        fileContextMenuStore.showContextItem(file, pageX, pageY);
    }}
    on:click={processItem}
    on:keydown={validateKey}
>
    <slot />
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .file-item {
        display: flex;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.25s;
        position: relative;
        &:focus,
        &:hover {
            background-color: $file-item-focus;
            transform: translateY(4%);
        }
        &.bookmark {
            &::before {
                position: absolute;
                top: 0;
                left: 0;
                border-left: 1.75rem solid #2288ff;
                border-top: 1rem solid transparent;
                border-bottom: 1rem solid transparent;
                content: " ";
                transform: translateY(25%);
            }
        }
        &.grid {
            width: 8rem;
            min-height: 8rem;
            flex-wrap: wrap;
            padding: 0.25rem;
            margin-bottom: 0.5rem;
        }
        &.list {
            width: 100%;
            min-height: 3rem;
            align-items: center;
        }
    }
    .moving {
        filter: opacity(50%);
    }
    .selected {
        background-color: rgba(180, 180, 180, 0.5);
    }
    @media (max-width: $responsive-size) {
        .file-item {
            &.grid {
                width: 7rem;
                min-height: 7rem;
                margin: auto;
            }
            &.list {
                min-height: 2.5rem;
                padding: 0.25rem 0;
                font-size: 0.9rem;
            }
        }
    }
</style>
