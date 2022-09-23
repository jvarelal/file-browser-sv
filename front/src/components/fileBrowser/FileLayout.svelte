<script lang="ts">
    import { fade } from "svelte/transition";
    //stores
    import fileBrowserStore from "../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../stores/fileContextMenuStore";
    import fileDirectoryStore from "../../stores/fileDirectoryStore";
    import fileDownloadStore from "../../stores/fileDownloadStore";
    import dialogStore from "../../stores/dialogStore";
    import scrollStore from "../../stores/scrollStore";
    import fileToolbarStore from "../../stores/fileToolbarStore";
    import fileSettingStore from "../../stores/fileSettingStore";
    //components
    import Accordion from "../commons/Accordion.svelte";
    //types
    import type { FileUpload } from "../../types/UITypes";
    import type { ErrorApiResponse } from "../../types/ApiTypes";
    //helpers
    import { getLastTreeName, handleDrop } from "../../helpers/Media";
    import { listErrors } from "./contextmenu/FileContextMenu.svelte";
    import FileService from "../../services/FileService";
    import TextLanguage from "../../constants/TextLanguage";

    let section: HTMLElement;
    let dragOn: boolean = false;
    let scrollAction = (e: Event): void => {
        let target = e.target as HTMLElement;
        fileContextMenuStore.closeContext();
        scrollStore.setCurrentHeight(
            target.scrollTop,
            target.clientHeight + target.scrollTop
        );
    };

    function addFiles(files: File[]) {
        if (!$fileBrowserStore.viewBookmarks) {
            let route = $fileDirectoryStore.current;
            let values: FileUpload = { type: "file", name: "", files, route };
            dragOn = false;
            const cb = (): void => {
                fileBrowserStore.addFiles(files);
                dialogStore.showMessage(
                    TextLanguage[$fileSettingStore.lang].dialogs.uploadFile(
                        files.length,
                        route
                    )
                );
            };
            const err = (err: ErrorApiResponse): void => {
                listErrors(err);
                let uploadedFiles = files.filter(
                    (f) =>
                        !err.errors.find(
                            (errorFile) => errorFile.name === f.name
                        )
                );
                fileBrowserStore.addFiles(uploadedFiles);
            };
            dialogStore.showLoading();
            FileService.create(values, cb, err);
        }
    }
    $: if ($scrollStore.updateScroll) {
        section.scroll({ top: $scrollStore.previousHeight });
        scrollStore.restore();
    }
</script>

<section
    class="scroll"
    bind:this={section}
    on:scroll={scrollAction}
    on:contextmenu|preventDefault|stopPropagation={({ pageX, pageY }) => {
        if (!$fileBrowserStore.error) {
            fileContextMenuStore.showContextParent(
                {
                    route: $fileDirectoryStore.current,
                    name: getLastTreeName($fileDirectoryStore.current),
                    isDirectory: true,
                },
                pageX,
                pageY
            );
        }
    }}
    class:dragOn={dragOn && !$fileBrowserStore.viewBookmarks}
    on:dragenter|preventDefault|stopPropagation
    on:drop|preventDefault|stopPropagation={(e) => handleDrop(e, addFiles)}
    on:dragover|preventDefault|stopPropagation={() => (dragOn = true)}
    on:dragleave|preventDefault|stopPropagation={() => (dragOn = false)}
>
    <div
        class="browser-layout transition"
        class:active={!$fileToolbarStore.isCollapsed &&
            $scrollStore.startHeight < 16 * 8}
        class:expand={!$fileToolbarStore.show}
    >
        <slot />
    </div>
    {#if $fileDownloadStore.isDownloading}
        <div
            class="download-alert scroll"
            on:contextmenu|preventDefault|stopPropagation
            transition:fade
        >
            <Accordion title="Downloading..." id="downloads-fb" collapse={true}>
                {#each $fileDownloadStore.files as file}
                    <div class="download-element">
                        <i
                            class={`fas fa-${
                                file.isDirectory ? "folder" : "file"
                            } m-1`}
                        />
                        {file.name}
                    </div>
                {/each}
            </Accordion>
        </div>
    {/if}
</section>

<style lang="scss">
    @import "../../styles/vars";
    section {
        height: 100%;
        overflow-y: auto;
    }
    .browser-layout {
        padding-top: 4rem;
        overflow-x: hidden;
        &.active {
            padding-top: 8.25rem;
        }
        &.expand {
            padding-top: 0;
        }
    }
    .download-alert {
        position: fixed;
        bottom: 0;
        background-color: $bg-label;
        color: $color-label;
        min-width: 200px;
        width: 25%;
        font-size: 0.9rem;
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid $border-light;
        margin: 0.75rem;
    }
    .download-element {
        text-align: left;
        padding: 0.5rem;
        border-bottom: 1px solid $border-light;
    }
    .dragOn {
        background-color: #88888844;
    }
    @media (max-width: $responsive-size) {
        .browser-layout {
            &.active {
                padding-top: 17rem;
            }
        }
    }
</style>
