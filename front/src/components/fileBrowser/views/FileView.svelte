<script lang="ts">
    import { getContext, onMount, setContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import filePreviewStore from "../../../stores/filePreviewStore";
    import fileGridCssStore from "../../../stores/fileGridCssStore";
    import fileToolbarStore from "../../../stores/fileToolbarStore";
    //components
    import FileVisor from "../visors/FileVisor.svelte";
    import FileViewEmpty from "./FileViewEmpty.svelte";
    import FileGroup from "../grid/FileGroup.svelte";
    import Accordion from "../../commons/Accordion.svelte";
    //types
    import type {
        FileUI,
        NumberFunction,
        VirtualGroup,
    } from "../../../types/UITypes";
    //helpers
    import FileBrowser from "../../../constants/FileBrowser";

    export let files: FileUI[] = [];
    export let virtualGroups: VirtualGroup[] = [];
    export let active: boolean = true;

    const key = new Date().toISOString();
    const itemsFiltered = getContext<NumberFunction>("itemsFiltered");
    let expanded: boolean = false;

    $: filteredFiles = files.filter((f) => {
        if ($fileBrowserStore.filter) {
            let filtered = f.name
                .toLowerCase()
                .includes($fileBrowserStore.filter.toLowerCase());
            return filtered;
        }
        return true;
    });

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
    {#if filteredFiles.length === 0 && virtualGroups.length < 2}
        <FileViewEmpty />
    {:else}
        <div
            class="scroll browser-wrapper transition"
            class:active={$filePreviewStore.get(key)}
            class:active-audio={$filePreviewStore.get(key) &&
                FileBrowser.previews.audio.includes(
                    $filePreviewStore.get(key).type
                )}
            class:statusToolbar={$filePreviewStore.get(key)}
            class:toolbarExpanded={!$fileToolbarStore.isCollapsed}
            class:expanded
        >
            {#if virtualGroups.length < 2}
                <FileGroup files={filteredFiles} />
            {:else}
                {#each virtualGroups as virtualGroup}
                    <Accordion
                        title={`<i class="fas fa-folder m-r-2  m-l-2"></i> ${virtualGroup.name}`}
                        id={virtualGroup.id + ''}
                        options={virtualGroup.options}
                    >
                        <div class="p-l-5">
                            <FileGroup
                                files={filteredFiles.filter(
                                    (f) => f.virtualGroup === virtualGroup.id
                                )}
                            />
                        </div>
                    </Accordion>
                {/each}
            {/if}
        </div>
        {#if $filePreviewStore.get(key)}
            <div
                class="browser-preview transition"
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
        &.active {
            overflow-y: auto;
            width: 10rem;
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
