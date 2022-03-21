<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { fly } from "svelte/transition";
    //stores
    import fileDirectoryStore from "../stores/fileDirectoryStore";
    import fileSettingStore from "../stores/fileSettingStore";
    import appViewStore from "../stores/appViewStore";
    //Components
    import FileToolBar from "./fileBrowser/FileToolBar.svelte";
    import FileLayout from "./fileBrowser/FileLayout.svelte";
    import FileInit from "./fileBrowser/FileInit.svelte";
    import FileViewError from "./fileBrowser/views/FileViewError.svelte";
    import FileViewWaiting from "./fileBrowser/views/FileViewWaiting.svelte";
    import Modal from "./modal/Modal.svelte";
    import FileInfo from "./fileBrowser/forms/FileInfo.svelte";
    //helpers
    import FileService from "../services/FileService";
    import type { FileUI } from "../types/UITypes";

    let numberItemsFiltered: number = 0;
    let fileInfo: FileUI;

    $: fileList = FileService.list($fileDirectoryStore.current);

    setContext("fileInfo", (file: FileUI): void => {
        fileInfo = file;
    });
    setContext("itemsFiltered", (size: number): void => {
        numberItemsFiltered = size;
    });

    function existTransition(node: HTMLElement, options: any): any {
        if ($fileSettingStore.transitions) {
            return options.fn(node, options);
        }
    }
    onMount(() => {
        if (!$fileDirectoryStore.current) {
            if ($fileSettingStore.cache[0]) {
                fileDirectoryStore.setDirectory($fileSettingStore.cache[0]);
            } else {
                appViewStore.setLogin();
            }
        }
    });
</script>

<section transition:existTransition={{ fn: fly, x: -100, duration: 300 }}>
    <FileToolBar {numberItemsFiltered} />
    <FileLayout>
        {#await fileList}
            <FileViewWaiting />
        {:then list}
            <FileInit apiResponse={list} />
        {:catch error}
            <FileViewError {error} />
        {/await}
    </FileLayout>
    {#if fileInfo}
        <Modal
            icon="fas fa-info"
            label="Detalle elemento"
            onClose={() => (fileInfo = null)}
        >
            <FileInfo file={fileInfo} />
        </Modal>
    {/if}
</section>

<style lang="scss">
    section {
        height: 100%;
    }
</style>
