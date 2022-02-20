<script lang="ts">
    import { fade } from "svelte/transition";

    import fileBrowserStore from "../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../stores/fileContextMenuStore";
    import fileDirectoryStore from "../../stores/fileDirectoryStore";
    import fileDownloadStore from "../../stores/fileDownloadStore";
    import scrollStore from "../../stores/scrollStore";
    import fileToolbarCollapsed from "../../stores/fileToolbarCollapsedStore";
    import Accordion from "../commons/Accordion.svelte";

    import { getLastTreeName } from "../../helpers/Media";

    let section: HTMLElement;
    let scrollAction = (e: Event): void => {
        let target = e.target as HTMLElement;
        fileContextMenuStore.closeContext();
        scrollStore.setCurrentHeight(
            target.scrollTop,
            target.clientHeight + target.scrollTop
        );
    };
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
>
    <div
        class="browser-layout"
        class:active={!$fileToolbarCollapsed &&
            $scrollStore.startHeight < 16 * 8}
    >
        <slot />
    </div>
    {#if $fileDownloadStore.isDownloading}
        <div
            class="download-alert scroll"
            on:contextmenu|preventDefault|stopPropagation
            transition:fade
        >
            <Accordion title="Descargando..." id="downloads-fb" collapse={true}>
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
        transition: padding 0.35s;
        padding-top: 4rem;
        &.active {
            padding-top: 8.25rem;
        }
    }
    .download-alert {
        position: fixed;
        bottom: 0;
        background-color: $bg-main;
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
    @media (max-width: $responsive-size) {
        .browser-layout {
            &.active {
                padding-top: 17rem;
            }
        }
    }
</style>
