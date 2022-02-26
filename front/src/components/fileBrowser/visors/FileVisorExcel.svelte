<script lang="ts">
    import { getExcelColumnCode, limitString } from "../../../helpers/Misc";

    import FileService from "../../../services/FileService";
    import dialogStore from "../../../stores/dialogStore";
    import type { FileExcel, FileUI } from "../../../types/UITypes";

    export let file: FileUI;

    let errMessage: string = "";
    let excelData: FileExcel[] = [];
    let selectedSheet: number = 0;

    let excelSheetsContainer: HTMLElement;

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

    function excelSheetsScroll(factor: number): void {
        excelSheetsContainer.scroll({
            left: excelSheetsContainer.scrollLeft + 100 * factor,
            behavior: "smooth",
        });
    }

    $: if (file) {
        selectedSheet = 0;
        loadData();
    }
</script>

<div class="excel scroll">
    {#if errMessage}
        <h2>{errMessage}</h2>
    {:else if excelData.length > 0}
        <div class="excel-container scroll">
            <table class="excel-data">
                <thead>
                    <tr>
                        {#each Array(excelData[selectedSheet].maxNumberOnCol + 1).fill("") as cell, i}
                            <th>{i > 0 ? getExcelColumnCode(i) : ""}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each excelData[selectedSheet].data as row, idx}
                        <tr>
                            <td class="excel-data-index">
                                {idx + 1}
                            </td>
                            {#each row as cell}
                                <td class="excel-data-cell">
                                    {cell ? cell : ""}
                                </td>
                            {/each}
                            {#if row.length < excelData[selectedSheet].maxNumberOnCol}
                                {#each Array(excelData[selectedSheet].maxNumberOnCol - row.length).fill("") as cell}
                                    <td class="excel-data-cell" />
                                {/each}
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="d-flex">
            <div class="excel-sheets w-50" bind:this={excelSheetsContainer}>
                <span
                    class="excel-sheets-scroll pointer s-left"
                    on:click={() => excelSheetsScroll(-1)}
                >
                    {"<"}
                </span>
                {#each excelData as sheet, i}
                    <div
                        class="excel-sheet pointer"
                        class:active={i === selectedSheet}
                        on:click={() => (selectedSheet = i)}
                        title={sheet.sheetName}
                    >
                        {limitString(sheet.sheetName, 20, "..")}
                    </div>
                {/each}
                <span
                    class="excel-sheets-scroll pointer s-right"
                    on:click={() => excelSheetsScroll(1)}
                >
                    {">"}
                </span>
            </div>
            <div class="excel-detail w-50">
                <div class="p-l-5 p-r-5 m-r-auto">{excelData.length} Hojas</div>
                <div class="p-l-5 p-r-5 m-r-auto">
                    {excelData[selectedSheet].data.length} filas
                </div>
                <div class="p-l-5 p-r-5 m-r-auto">
                    {excelData[selectedSheet].maxNumberOnCol} columnas
                </div>
            </div>
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
            height: calc(100% - 2rem);
            width: 100%;
            overflow: auto;
        }
        &-data {
            border-collapse: collapse;
            th {
                top: 0;
            }
            &-index {
                left: 0;
            }
            &-index,
            th {
                text-align: center;
                padding: 0.2rem;
                font-size: 0.8rem;
                position: sticky;
                background-color: $bg-inp;
                color: $color-text;
                &::after {
                    content: "";
                    height: 100%;
                    width: 1px;
                    position: absolute;
                    background: $color-text;
                    right: 0;
                    bottom: 0;
                }
                &::before {
                    content: "";
                    height: 1px;
                    width: 100%;
                    position: absolute;
                    background: $color-text;
                    right: 0;
                    bottom: 0;
                }
            }
            &-cell {
                border: 1px solid $border-medium;
                padding: 0.25rem;
            }
        }
        &-detail {
            display: flex;
            align-items: center;
        }
        &-sheets {
            height: 1.75rem;
            display: flex;
            position: sticky;
            bottom: 0;
            left: 0;
            z-index: 5;
            background-color: $bg-main;
            overflow: hidden;
            &-scroll {
                position: sticky;
                padding: 0 0.5rem;
                background-color: $bg-main;
            }
            .s-left {
                left: 0;
            }
            .s-right {
                right: 0;
            }
        }
        &-sheet {
            min-width: 125px;
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
