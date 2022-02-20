<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import filePreviewStore from "../../../stores/filePreviewStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileGridCssStore from "../../../stores/fileGridCssStore";
    //Components
    import FileGridItem from "./FileGridItem.svelte";
    import FileGridItemPreview from "./FileGridItemPreview.svelte";
    import FileGridItemBar from "./FileGridItemBar.svelte";
    //types
    import type { FileUI, FileUIPreview } from "../../../types/UITypes";
    //helpers
    import FileBrowser from "../../../constants/FileBrowser";
    import { getFileType, getSizeMb } from "../../../helpers/Media";
    import { limitString } from "../../../helpers/Misc";
    import { setDateFormatStr } from "../../../helpers/Date";

    export let files: FileUI[] = [];
    export let parentIndex: number = 0;

    const key: string = getContext<string>("id");
    const sortBy = {
        name: (f1: FileUI, f2: FileUI): number => (f1.name > f2.name ? 1 : -1),
        size: (f1: FileUI, f2: FileUI): number => (f1.size > f2.size ? 1 : -1),
        type: (f1: FileUI, f2: FileUI): number =>
            getFileType(f1) > getFileType(f2) ? 1 : -1,
        creation: (f1: FileUI, f2: FileUI): number =>
            new Date(f1.creation) > new Date(f2.creation) ? 1 : -1,
        modification: (f1: FileUI, f2: FileUI): number =>
            new Date(f1.modification) > new Date(f2.modification) ? 1 : -1,
    };

    $: orderFiles = files.sort((a, b) =>
        sortFiles(a, b, $fileSettingStore.sortBy, $fileSettingStore.orderAsc)
    );
    $: list = $fileSettingStore.viewList && $filePreviewStore.get(key) === undefined;

    function sortFiles(
        fileA: FileUI,
        fileB: FileUI,
        type: string = "name",
        orderAsc: boolean = true
    ): number {
        let factor = orderAsc ? 1 : -1;
        if (fileA.isDirectory && !fileB.isDirectory) {
            return -1;
        } else if (fileB.isDirectory && !fileA.isDirectory) {
            return 1;
        }
        return sortBy[type](fileA, fileB) * factor;
    }

    function viewItem(file: FileUI): void {
        let consecutives = { prev: null, next: null };
        for (let key of ["prev", "next"]) {
            let factor = key === "prev" ? -1 : 1;
            let counter = file.index;
            while (
                (key === "prev"
                    ? counter > 0
                    : counter < orderFiles.length - 1) &&
                !consecutives[key]
            ) {
                counter += 1 * factor;
                if (FileBrowser.visor.includes(orderFiles[counter].type)) {
                    consecutives[key] = () => {
                        viewItem({
                            ...orderFiles[counter],
                            index: counter,
                        });
                    };
                }
            }
        }
        let filePreview: FileUIPreview = { ...file, ...consecutives };
        filePreviewStore.setPreview(key, filePreview);
    }

</script>

<div
    class:file-list={list}
    class:file-grid={!list}
    class={list ? "" : `gap-${$fileGridCssStore.gap}`}
>
    {#each orderFiles as file, index}
        <FileGridItem
            file={{ ...file, index, idxFocus: parentIndex + index }}
            {viewItem}
            {list}
        >
            <div class="file-img-wrapper">
                {#if file.preview}
                    <FileGridItemPreview {file} />
                {:else if file.asset}
                    <img
                        src={file.icon}
                        alt={file.name}
                        class="file-img-icon"
                    />
                {:else}
                    <i class={file.icon} />
                {/if}
            </div>
            <div class="file-title scroll" title={file.name}>
                <span class="m-auto">
                    {limitString(file.name, list ? 60 : 30, "...")}
                </span>
            </div>
            {#if !file.isDirectory && file.size !== undefined}
                <div class="file-data">{getSizeMb(file.size)}</div>
            {/if}
            <div class="file-data">{setDateFormatStr(file.creation)}</div>
            <div class="file-data">{setDateFormatStr(file.modification)}</div>
            {#if $fileSettingStore.viewOptions}
                <FileGridItemBar {file} {list} />
            {/if}
        </FileGridItem>
    {/each}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    @for $i from 4 through 15 {
        .gap-#{$i} {
            gap: $i * 1px;
        }
    }
    .file-img-wrapper {
        .fa-folder {
            color: $file-folder;
        }
        .fa-file {
            color: $file-icon;
        }
    }
    .file-grid {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 0.25rem;
        .file-img-wrapper {
            width: 7rem;
            height: 7rem;
            margin: auto;
            display: flex;
            align-items: center;
            i {
                font-size: 5rem;
                margin: auto;
            }
        }
        .file-title {
            text-align: center;
            width: 100%;
            overflow: auto;
            padding: 0.1rem;
            min-height: 2rem;
            display: flex;
            align-items: center;
        }
        .file-data {
            display: none;
        }
        .file-img-icon {
            height: 6rem;
            width: 100%;
            margin: auto;
        }
    }
    .file-list {
        display: flex;
        flex-wrap: wrap;
        width: 98%;
        margin: auto;
        padding-bottom: 1rem;
        .file-title {
            margin-right: auto;
        }
        .file-img-wrapper {
            width: 2rem;
            padding: 0 1.5rem;
            i {
                font-size: 2rem;
            }
        }
        .file-img-icon {
            height: 2rem;
        }
        .file-data {
            padding: 0 1.5rem;
            display: flex;
            align-items: center;
        }
    }
    @media (max-width: $responsive-size) {
        .file-img-icon {
            height: 1.75rem;
        }
        .file-list {
            width: 100%;
            .file-img-wrapper {
                width: 2rem;
            }
            .file-data {
                display: none;
            }
        }
    }
</style>
