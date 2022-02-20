<script lang="ts">
    import { fly } from "svelte/transition";
    import { setContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileToolbarCollapsedStore from "../../../stores/fileToolbarCollapsedStore";
    //components
    import FileContextMenu from "../contextmenu/FileContextMenu.svelte";
    import FileSettingsActions from "./FileSettingsActions.svelte";
    import Accordion from "../../commons/Accordion.svelte";
    import ActionButton from "../../commons/ActionButton.svelte";
    //helpers
    import FileBrowser from "../../../constants/FileBrowser";
    import Modal from "../../modal/Modal.svelte";
    import FileForm from "../forms/FileForm.svelte";

    export let numberItemsFiltered: number = 0;
    export let isToolbarCollapsed: boolean = $fileToolbarCollapsedStore;

    let newFile: boolean = false;

    $: title =
        "Vista" +
        ($fileBrowserStore.numberItems > 0 && !$fileBrowserStore.waiting
            ? ` | ${$fileBrowserStore.numberItems} elementos ${
                  $fileBrowserStore.filter
                      ? ` | ${numberItemsFiltered} filtrados`
                      : ""
              } ${
                  $fileBrowserStore.numberItemsChecked
                      ? ` | ${$fileBrowserStore.numberItemsChecked} seleccionados`
                      : ""
              }`
            : "");

    function activateNewFile(): void {
        newFile = true;
    }

    function handleSortChange(e: Event) {
        let value = (e.target as HTMLSelectElement).value;
        fileSettingStore.setSortBy(value);
    }

    function handleGroupChange(e: Event) {
        let value = (e.target as HTMLSelectElement).value;
        fileSettingStore.setGroupBy(value);
    }

    setContext("fileAdd", activateNewFile);
</script>

<section class="file-grid-options">
    {#if $fileContextMenuStore.active}
        <FileContextMenu />
    {/if}
    <Accordion
        {title}
        id="sortGroup"
        renderDefault={false}
        bind:collapse={isToolbarCollapsed}
        on:change={() => fileToolbarCollapsedStore.set(isToolbarCollapsed)}
        cssClass="f-09"
    >
        <div class="options-wrapper" transition:fly>
            <div class="form-field-control">
                <label for="select-sort">Ordenamiento</label>
                <div class="form-field">
                    <select
                        value={$fileSettingStore.sortBy}
                        id="select-sort"
                        on:change={handleSortChange}
                    >
                        {#each FileBrowser.sortOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                    <ActionButton
                        on:click={fileSettingStore.setOrderAsc}
                        icon={`fas fa-sort-amount-${
                            $fileSettingStore.orderAsc ? "down" : "up"
                        }-alt`}
                    />
                    <ActionButton
                        on:click={fileSettingStore.setView}
                        icon={`fas fa-${
                            $fileSettingStore.viewList ? "list" : "th"
                        }`}
                    />
                </div>
            </div>
            <div class="form-field-control">
                <label for="select-sort">Agrupación</label>
                <div class="form-field">
                    <select
                        value={$fileSettingStore.groupBy}
                        id="select-sort"
                        on:change={handleGroupChange}
                    >
                        {#each FileBrowser.groupOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="options-aditional">
                <div class="options-title w-100">
                    <input
                        type="checkbox"
                        class="check"
                        id="individualMark"
                        on:change={() => {
                            fileSettingStore.setViewOptions();
                            fileBrowserStore.setCheckAll(false);
                        }}
                        checked={$fileSettingStore.viewOptions}
                    />
                    <label for="individualMark">Opciones de archivo</label>
                </div>
                <FileSettingsActions />
            </div>
        </div>
    </Accordion>
    {#if newFile}
        <Modal
            icon="fas fa-plus"
            label="Agregar elemento"
            onClose={() => (newFile = false)}
        >
            <FileForm />
        </Modal>
    {/if}
</section>

<style>
    .options-wrapper {
        display: flex;
    }
    .options-title {
        font-size: 0.75rem;
        margin: 0.25rem;
    }
    .options-aditional {
        margin: 0 auto;
    }
    @media (max-width: 560px) {
        .options-wrapper {
            flex-direction: column;
        }

        .options-aditional {
            margin-bottom: 0.5rem;
        }
    }
</style>
