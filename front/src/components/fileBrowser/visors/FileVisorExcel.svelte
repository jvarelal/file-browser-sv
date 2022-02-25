<script lang="ts">
    import { onMount } from "svelte";

    import FileService from "../../../services/FileService";
    import dialogStore from "../../../stores/dialogStore";
    import type { FileExcel, FileUI } from "../../../types/UITypes";

    export let file: FileUI;

    let errMessage: string = "";
    let excelData: FileExcel[] = [];
    let selectedSheet: number = 0;

    function loadData(): void {
        dialogStore.showLoading();
        FileService.getExcel(
            file,
            (data) => {
                dialogStore.reset();
                excelData = data;
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

<div class="excel scroll">
    {#if errMessage}
        <h2>{errMessage}</h2>
    {:else if excelData.length > 0}
        <div class="excel-container scroll">
            <table class="excel-data">
                <tbody>
                    {#each excelData[selectedSheet].data as row, idx}
                        <tr>
                            <td class="excel-data-index">{idx + 1}</td>
                            {#each row as cell}
                                <td>{cell ? cell : ""}</td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="excel-sheets scroll">
            {#each excelData as sheet, i}
                <div
                    class="excel-sheet pointer"
                    class:active={i === selectedSheet}
                    on:click={() => (selectedSheet = i)}
                >
                    {sheet.sheetName}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .excel {
        height: 100%;
        color: $color-text;
        position: relative;
        font-size: 0.9rem;
        &-container {
            height: calc(100% - 2.5rem);
            width: 100%;
            overflow: auto;
        }
        &-data {
            border-collapse: collapse;
            &-index {
                background-color: $bg-inp-disable;
                color: $color-inp-disable;
                text-align: center;
                padding: 0.1rem;
                font-size: 0.8rem;
            }
            td {
                border: 1px solid $border-light;
                padding: 0.25rem;
            }
        }
        &-sheets {
            display: flex;
            position: sticky;
            bottom: 0;
            left: 0;
            z-index: 5;
            background-color: $bg-main;
            width: 100%;
            overflow: auto;
        }
        &-sheet {
            min-width: 140px;
            width: 15%;
            border: 1px solid $border-strong;
            text-align: center;
            padding: 0.1rem;
            &.active {
                background-color: $bg-label;
                color: $color-label;
            }
        }
    }
</style>
