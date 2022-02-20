<script lang="ts">
    import { getContext } from "svelte";
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import ActionButton from "../../commons/ActionButton.svelte";
    import type { FileUI, FileUIFunction } from "../../../types/UITypes";
    import { isBookmark } from "../../../helpers/Media";

    export let file: FileUI;
    export let list: boolean;

    const fileInfo = getContext<FileUIFunction>("fileInfo");
</script>

<div
    class="file-options"
    class:list
    class:grid={!list}
    on:click|stopPropagation={() => null}
>
    <div class="d-flex m-r-auto">
        <ActionButton
            on:click={() => fileInfo(file)}
            title="Information"
            icon="fas fa-info"
            small={true}
        />
        {#if !file.isDirectory}
            <ActionButton
                on:click={() => fileBrowserStore.updateBookmarks(file)}
                className={isBookmark($fileBrowserStore.bookmarks, file)
                    ? "btn-active"
                    : ""}
                title="Marcador"
                icon="far fa-star"
                small={true}
            />
        {/if}
    </div>
    <input
        type="checkbox"
        class="check"
        checked={file.checked}
        on:change={() => fileBrowserStore.setCheck(file)}
    />
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .check {
        width: 1.25rem;
        height: 1.25rem;
        cursor: pointer;
    }

    .file-options {
        &.grid {
            text-align: center;
            width: 100%;
            overflow: auto;
            padding: 0.1rem;
            min-height: 2rem;
            display: flex;
            align-items: center;
            border-top: 1px solid $border-light;
            border-bottom: 1px solid $border-medium;
        }
        &.list {
            padding: 0 1.5rem;
            display: flex;
            align-items: center;
        }
    }
</style>
