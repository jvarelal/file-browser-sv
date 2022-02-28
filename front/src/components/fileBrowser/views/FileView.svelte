<script lang="ts">
    import { getContext, onMount, setContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import filePreviewStore from "../../../stores/filePreviewStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileGridCssStore from "../../../stores/fileGridCssStore";
    import fileToolbarCollapsedStore from "../../../stores/fileToolbarCollapsedStore";
    //components
    import FileGrid from "../grid/FileGrid.svelte";
    import FileVisor from "../visors/FileVisor.svelte";
    import FileViewEmpty from "./FileViewEmpty.svelte";
    import Accordion from "../../commons/Accordion.svelte";
    //types
    import type {
        FileUI,
        FileUIGroup,
        NumberFunction,
    } from "../../../types/UITypes";
    //helpers
    import { getFileType } from "../../../helpers/Media";
    import { groupByDateClasification } from "../../../helpers/Date";
    import FileBrowser from "../../../constants/FileBrowser";

    export let files: FileUI[] = [];
    export let active: boolean = true;

    const key = new Date().toISOString();
    const itemsFiltered = getContext<NumberFunction>("itemsFiltered");
    let grid: HTMLElement;
    let expanded: boolean = false;

    function getFileGroup(file: FileUI, group: string): string {
        switch (group) {
            case "type":
                return getFileType(file);
            case "creation":
            case "modification":
                return groupByDateClasification(new Date(file[group]));
            default:
                return "";
        }
    }

    function groupFiles(files: FileUI[] = [], group: string): FileUIGroup[] {
        let groupedFiles: FileUIGroup[] = [];
        let fileMap = {};
        files.forEach((file) => {
            let fileGroup = getFileGroup(file, group);
            if (!fileMap[fileGroup]) {
                fileMap[fileGroup] = [];
            }
            fileMap[fileGroup].push(file);
        });
        for (let key in fileMap) {
            groupedFiles.push({ group: key, files: fileMap[key] });
        }
        groupedFiles.sort((a, b) => {
            try {
                if (group === "type") {
                    return a.group > b.group ? 1 : -1;
                }
                let f1 = a.files[0][group];
                let f2 = b.files[0][group];
                return new Date(f1) > new Date(f2) ? -1 : 1;
            } catch (e) {
                return 0;
            }
        });
        return groupedFiles;
    }
    function calculatePreviousLength(index: number): number {
        let size = 0;
        for (let i = 0; i < index; i++) {
            size += filesGroup[i].files.length;
        }
        return size;
    }

    $: filteredFiles = files.filter((f) => {
        if ($fileBrowserStore.filter) {
            let filtered = f.name
                .toLowerCase()
                .includes($fileBrowserStore.filter.toLowerCase());
            return filtered;
        }
        return true;
    });
    $: filesGroup = $fileSettingStore.groupBy
        ? groupFiles(filteredFiles, $fileSettingStore.groupBy)
        : [];

    $: if ($fileBrowserStore.filter) {
        itemsFiltered(filteredFiles.length);
    }

    setContext("id", key);
    onMount(() => {
        return () => {
            if ($filePreviewStore.get(key)) {
                filePreviewStore.removePreview(key);
            }
        };
    });
</script>

<svelte:window on:resize={fileGridCssStore.updateGridInfo} />
<div class="browser-container t-left scroll">
    {#if filteredFiles.length === 0}
        <FileViewEmpty />
    {:else}
        <div
            class="scroll browser-wrapper"
            class:active={$filePreviewStore.get(key)}
            class:active-audio={$filePreviewStore.get(key) &&
                FileBrowser.previews.audio.includes(
                    $filePreviewStore.get(key).type
                )}
            class:statusToolbar={$filePreviewStore.get(key)}
            class:toolbarExpanded={!$fileToolbarCollapsedStore}
            class:expanded
            bind:this={grid}
        >
            {#if !$fileSettingStore.groupBy}
                <FileGrid files={filteredFiles} />
            {:else}
                {#each filesGroup as fileGroup, index}
                    <Accordion title={fileGroup.group} id={fileGroup.group}>
                        <FileGrid
                            files={fileGroup.files}
                            parentIndex={calculatePreviousLength(index)}
                        />
                    </Accordion>
                {/each}
            {/if}
        </div>
        {#if $filePreviewStore.get(key)}
            <div
                class="browser-preview"
                class:expanded
                class:active-audio={FileBrowser.previews.audio.includes(
                    $filePreviewStore.get(key).type
                )}
                on:dragenter|preventDefault|stopPropagation
                on:drop|preventDefault|stopPropagation
                on:dragover|preventDefault|stopPropagation
            >
                <FileVisor bind:expanded {active} />
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .browser-container {
        display: flex;
    }
    .browser-wrapper {
        overflow-y: auto;
        width: 100%;
        transition: all 0.2s;
        &.active {
            overflow-y: auto;
            width: 10rem;
            transition: all 0.2s;
            &.active-audio {
                width: 67%;
                &.expanded {
                    width: 0%;
                }
            }
            &.expanded {
                width: 0%;
            }
        }
    }
    .browser-preview {
        position: relative;
        width: calc(100% - 10rem);
        transition: all 0.25s;
        &.active-audio {
            width: 33%;
            &.expanded {
                width: 100%;
            }
        }
        &.expanded {
            width: 100%;
        }
    }

    @media (max-width: $responsive-size) {
        .browser-container {
            flex-direction: column-reverse;
        }
        .browser-wrapper {
            &.active {
                width: 100%;
                max-height: 50vh;
                overflow-y: auto;
                margin: 1rem 0;
                &.active-audio {
                    width: 100%;
                }
            }
        }
        .browser-preview {
            width: 100%;
            &.active-audio {
                width: 100%;
                max-height: 50vh;
            }
        }
    }
</style>
