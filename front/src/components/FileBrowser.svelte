<script lang="ts">
    import { onMount, setContext } from "svelte";
    //stores
    import fileDirectoryStore from "../stores/fileDirectoryStore";
    import fileSettingStore from "../stores/fileSettingStore";
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

    export let navigate: (route: string) => void;

    let numberItemsFiltered: number = 0;
    let fileInfo: FileUI;

    $: fileList = FileService.list($fileDirectoryStore.current);

    setContext("fileInfo", (file: FileUI): void => {
        fileInfo = file;
    });
    setContext("itemsFiltered", (size: number): void => {
        numberItemsFiltered = size;
    });

    onMount(() => {
        if (!$fileDirectoryStore.current) {
            if ($fileSettingStore.cache[0]) {
                fileDirectoryStore.setDirectory($fileSettingStore.cache[0]);
            } else {
                navigate("/login");
            }
        }
    });
</script>

<section>
    <FileToolBar {numberItemsFiltered} />
    <FileLayout>
        {#await fileList}
            <FileViewWaiting />
        {:then list}
            <FileInit files={list.files} />
        {:catch error}
            <FileViewError {error} {navigate} />
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
