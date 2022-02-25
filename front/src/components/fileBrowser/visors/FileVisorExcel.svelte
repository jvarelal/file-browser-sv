<script lang="ts">
    import FileService from "../../../services/FileService";
    import dialogStore from "../../../stores/dialogStore";
    import type { FileUI } from "../../../types/UITypes";

    export let file: FileUI;

    let errMessage = "";

    function loadData(): void {
        dialogStore.showLoading();
        FileService.getExcel(
            file,
            (data) => {
                dialogStore.reset();
                console.log(data);
            },
            (err) => {
                dialogStore.reset();
                errMessage = err.message;
            }
        );
    }
    $: if (file) {
        loadData();
    }
</script>

<div class="excel-view">
    {#if errMessage}
        <h2>{errMessage}</h2>
    {:else}
        entro
    {/if}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .excel-view {
        height: 100%;
        color: $color-text;
    }
</style>
