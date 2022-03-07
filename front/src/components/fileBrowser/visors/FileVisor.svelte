<script lang="ts">
    import { getContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import filePreviewStore from "../../../stores/filePreviewStore";
    import scrollStore from "../../../stores/scrollStore";
    import fileToolbarStore from "../../../stores/fileToolbarStore";
    //components
    import FileVisorImage from "./FileVisorImage.svelte";
    import ActionButton from "../../commons/ActionButton.svelte";
    import FileVisorText from "./FileVisorText.svelte";
    import FIleVisorAudio from "./FIleVisorAudio.svelte";
    import FileVisorExcel from "./FileVisorExcel.svelte";
    import FileVisorVideo from "./FileVisorVideo.svelte";
    //helpers
    import FileService from "../../../services/FileService";
    import { isBookmark } from "../../../helpers/Media";
    import FileBrowser from "../../../constants/FileBrowser";

    export let expanded: boolean;
    export let active: boolean;

    const key: string = getContext<string>("id");
    let timer: boolean = false;
    let enableEdit: boolean = false;
    $: preview = $filePreviewStore.get(key);

    function validateKey(e: KeyboardEvent): any {
        if (active && !enableEdit) {
            if (e.key === "ArrowRight" && preview.next) {
                return preview.next();
            }
            if (e.key === "ArrowLeft" && preview.prev) {
                return preview.prev();
            }
            if (e.key === "Escape") {
                return closePreview();
            }
        }
    }

    function updateBookmark(): void {
        let p = { ...preview };
        fileBrowserStore.updateBookmarks(p);
        if ($fileBrowserStore.viewBookmarks) {
            if (p.next) {
                p.next();
            } else if (p.prev) {
                p.prev();
            } else {
                closePreview();
            }
        }
    }

    function closePreview(): void {
        filePreviewStore.removePreview(key);
        fileToolbarStore.setShow(true);
        scrollStore.triggerPrevious();
    }

    function expandPreview(): void {
        expanded = !expanded;
        fileToolbarStore.setShow(!expanded);
    }
</script>

<svelte:window on:keydown={validateKey} />
<div
    class="file-visor statusToolbar"
    class:toolbarExpanded={!$fileToolbarStore.isCollapsed &&
        $fileToolbarStore.show}
    class:toolbarHided={!$fileToolbarStore.show}
    on:contextmenu|preventDefault|stopPropagation
>
    <div class="d-flex">
        <div class="d-flex">
            <ActionButton
                on:click={expandPreview}
                className={"expand"}
                title={expanded ? "Contraer" : "Expandir"}
                icon={`fas fa-${expanded ? "compress-alt" : "expand-alt"}`}
            />
            {#each ["prev", "next"] as element}
                <ActionButton
                    on:click={preview[element]}
                    disabled={!preview[element]}
                    title={element}
                    icon={`fas fa-${
                        element === "prev" ? "arrow-left" : "arrow-right"
                    }`}
                />
            {/each}
            {#if !enableEdit && FileBrowser.editables.includes(preview.type)}
                <ActionButton
                    on:click={() => (enableEdit = true)}
                    title={"Edit element"}
                    icon="fas fa-edit"
                />
            {/if}
            {#if [...FileBrowser.previews.image, ...FileBrowser.previews.audio, ...FileBrowser.previews.video].includes(preview.type)}
                <ActionButton
                    on:click={() => (timer = !timer)}
                    className={timer ? "btn-active" : ""}
                    title="Presentacion"
                    icon="fas fa-hourglass-half"
                />
            {/if}
            <ActionButton
                on:click={updateBookmark}
                className={isBookmark($fileBrowserStore.bookmarks, preview)
                    ? "btn-active"
                    : ""}
                title="Marcador"
                icon="far fa-star"
            />
        </div>
        <h3 class="file-visor-title">{preview.name}</h3>
        <div class="m-l-auto">
            <ActionButton
                on:click={closePreview}
                style="background-color: #d42; color: white"
                icon="fas fa-times"
            />
        </div>
    </div>
    {#if FileBrowser.previews.image.includes(preview.type)}
        <FileVisorImage {preview} bind:timer />
    {:else if FileBrowser.previews.audio.includes(preview.type)}
        <FIleVisorAudio {preview} bind:timer />
    {:else if FileBrowser.previews.video.includes(preview.type)}
        <FileVisorVideo {preview} bind:timer />
    {:else if FileBrowser.previews.asText.includes(preview.type) || enableEdit}
        <FileVisorText file={preview} bind:enableEdit />
    {:else if FileBrowser.previews.excel.includes(preview.type)}
        <FileVisorExcel file={preview} />
    {:else}
        <iframe
            title="file"
            src={FileService.viewRawFile(preview)}
            class="file-iframe scroll"
        />
    {/if}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .file-visor {
        display: flex;
        flex-direction: column;
        margin: auto;
        &-title {
            margin: 0.25rem;
            font-weight: lighter;
            overflow-x: auto;
        }
    }
    .file-iframe {
        width: calc(100% - 0.4rem);
        height: 100%;
        border: 0px;
        margin: 0 auto;
        position: relative;
        background-color: $bg-iframe;
    }

    @media (max-width: $responsive-size) {
        .file-visor {
            width: 100%;
            height: 100vh;
        }
    }
</style>
