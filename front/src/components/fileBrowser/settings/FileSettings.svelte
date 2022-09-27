<script lang="ts">
    import { fly } from "svelte/transition";
    import { setContext } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileContextMenuStore from "../../../stores/fileContextMenuStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileToolbarStore from "../../../stores/fileToolbarStore";
    //components
    import FileContextMenu from "../contextmenu/FileContextMenu.svelte";
    import FileSettingsActions from "./FileSettingsActions.svelte";
    import Accordion from "../../commons/Accordion.svelte";
    //helpers
    import TextLanguage from "../../../constants/TextLanguage";
    import Modal from "../../modal/Modal.svelte";
    import FileForm from "../forms/FileForm.svelte";

    export let numberItemsFiltered: number = 0;
    export let isToolbarCollapsed: boolean = $fileToolbarStore.isCollapsed;
    
    let lang = TextLanguage[$fileSettingStore.lang];
    let sortBySelect = lang.selectOptions.sortBy;
    let groupBySelect = lang.selectOptions.groupBy;
    let newFile: boolean = false;

    $: title =
        lang.label.view +
        ($fileBrowserStore.numberItems > 0 && !$fileBrowserStore.waiting
            ? ` | ${$fileBrowserStore.numberItems} ${lang.label.itemName} ${
                  $fileBrowserStore.filter
                      ? ` | ${numberItemsFiltered} ${lang.label.filtered}`
                      : ""
              } ${
                  $fileBrowserStore.numberItemsChecked
                      ? ` | ${$fileBrowserStore.numberItemsChecked} ${lang.label.selected}`
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
        fileSettingStore.setGroupBy(value !== "none" ? value : null);
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
        on:change={() => fileToolbarStore.setCollapse(isToolbarCollapsed)}
        cssClass="f-09"
        options={[
            {
                label: "Order elements",
                icon: `fas fa-sort-amount-${
                    $fileSettingStore.orderAsc ? "down" : "up"
                }-alt`,
                action: fileSettingStore.setOrderAsc,
            },
            {
                label: "Grid/List",
                icon: `fas fa-${$fileSettingStore.viewList ? "th" : "list"}`,
                action: fileSettingStore.setView,
            },
        ]}
    >
        <div class="options-wrapper" transition:fly>
            <div class="form-field-control">
                <label for="select-sort">{sortBySelect.label} </label>
                <div class="form-field">
                    <select
                        value={$fileSettingStore.sortBy}
                        id="select-sort"
                        on:change={handleSortChange}
                    >
                        {#each sortBySelect.options as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="form-field-control">
                <label for="select-sort">{groupBySelect.label}</label>
                <div class="form-field">
                    <select
                        value={$fileSettingStore.groupBy}
                        id="select-sort"
                        on:change={handleGroupChange}
                    >
                        {#each groupBySelect.options as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="options-aditional">
                <FileSettingsActions />
            </div>
        </div>
    </Accordion>
    {#if newFile}
        <Modal
            icon="fas fa-plus"
            label={lang.label.addElement}
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
    .options-aditional {
        margin: 0 auto;
        display: flex;
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
