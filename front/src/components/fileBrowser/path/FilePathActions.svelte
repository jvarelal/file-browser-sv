<script lang="ts">
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileBookmarkGroupStore from "../../../stores/fileBookmarkGroupStore";
    import ActionButton from "../../commons/ActionButton.svelte";
    import FilePathForm from "../forms/FilePathForm.svelte";
    import Modal from "../../modal/Modal.svelte";

    let editPath: boolean = false;
</script>

<div class="route-actions d-flex">
    <ActionButton
        on:click={fileBrowserStore.setViewBookmarks}
        className={$fileBrowserStore.viewBookmarks ? "btn-active" : ""}
        disabled={$fileBrowserStore.waiting}
        title="bookmarks"
        icon="far fa-star"
    />
    {#if !$fileBrowserStore.viewBookmarks}
        {#each ["backward", "fordward"] as action}
            <ActionButton
                on:click={$fileDirectoryStore[action].length
                    ? fileDirectoryStore[action]
                    : () => null}
                disabled={!$fileDirectoryStore[action].length ||
                    $fileBrowserStore.waiting}
                title={action}
                icon={`fas fa-arrow-circle-${
                    action === "backward" ? "left" : "right"
                }`}
            />
        {/each}
    {:else}
        <ActionButton
            on:click={fileBookmarkGroupStore.showForm}
            disabled={$fileBrowserStore.waiting}
            title="New group"
            icon="fas fa-folder-plus"
        />
    {/if}
    <ActionButton
        on:click={() => (editPath = true)}
        className="d-responsive"
        title="Set directory"
        icon="fas fa-pencil-alt"
    />
</div>
{#if editPath}
    <Modal
        icon="fas fa-pencil-alt"
        label="Ir a ruta"
        onClose={() => (editPath = false)}
    >
        <FilePathForm />
    </Modal>
{/if}
