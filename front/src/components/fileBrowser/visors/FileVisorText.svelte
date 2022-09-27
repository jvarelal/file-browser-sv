<script lang="ts">
    import FileService from "../../../services/FileService";
    import dialogStore from "../../../stores/dialogStore";
    import type { FileEdit, FileUI } from "../../../types/UITypes";

    export let file: FileUI;
    export let enableEdit: boolean = false;

    let textArea: HTMLTextAreaElement;
    let originalData: string = "";
    let errMessage = "";
    let loading = false;
    let numberLines: number = 0;

    function loadData(): void {
        dialogStore.showLoading();
        loading = true;
        FileService.getAsTxt(
            file,
            (dataString) => {
                dialogStore.reset();
                loading = false;
                textArea.value = dataString;
                originalData = dataString;
                updateLines();
            },
            (err) => {
                dialogStore.reset();
                loading = false;
                errMessage = err.message;
            }
        );
    }
    function dialogOnCancel(): void {
        if (textArea.value !== originalData) {
            dialogStore.showDialog(
                "¿Esta seguro de descartar los cambios?",
                () => {
                    enableEdit = false;
                    textArea.value = originalData;
                    dialogStore.reset();
                }
            );
        } else {
            enableEdit = false;
        }
    }

    function updateLines(): void {
        numberLines = textArea.value.split("\n").length;
    }

    function editFile(): void {
        if (textArea.value !== originalData) {
            let fileEdit: FileEdit = {
                name: file.name,
                route: file.route,
                text: textArea.value,
            };
            dialogStore.showLoading();
            FileService.setPlainFile(
                fileEdit,
                () => {
                    dialogStore.reset();
                    originalData = textArea.value;
                    enableEdit = false;
                },
                (err) => {
                    dialogStore.showMessage(err.message);
                }
            );
        } else {
            enableEdit = false;
        }
    }

    $: if (file) {
        loadData();
    }
    $: if (enableEdit && textArea) {
        setTimeout(() => {
            textArea.focus();
        }, 300);
    }
</script>

<div class="txt-edit">
    {#if errMessage}
        <h2>{errMessage}</h2>
    {:else}
        <div class="txt-edit-container scroll" class:enableEdit>
            <div class="monospace txt-edit-linenumber">
                {#each Array(numberLines) as line, i}
                    {i + 1}<br />
                {/each}
            </div>
            <textarea
                bind:this={textArea}
                class="txt-edit-file monospace scroll"
                disabled={!enableEdit}
                style={`height: calc(${numberLines * 14}px + 1rem)`}
                on:input={updateLines}
            />
        </div>
        {#if enableEdit && !loading}
            <div class="txt-edit-control">
                <button class="btn m-auto w-25" on:click={editFile}>
                    <i class="fas fa-save" />
                    Guardar
                </button>
                <button on:click={dialogOnCancel} class="btn m-auto w-25">
                    <i class="far fa-window-close" />
                    Cancelar
                </button>
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .txt-edit {
        height: 100%;
        &-container {
            position: relative;
            width: 100%;
            height: calc(100% - 1.5rem);
            overflow: auto;
            &.enableEdit {
                height: calc(100% - 5rem);
            }
        }
        &-linenumber {
            width: 2.75rem;
            text-align: right;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0.5rem 0.25rem;
            background-color: $bg-btn;
            border: 1px solid $border-light;
        }
        &-file {
            width: calc(100% - 4.25rem);
            background-color: transparent;
            color: $color-text;
            margin: 0;
            border: none;
            padding: 0.5rem;
            white-space: pre;
            position: absolute;
            top: 0;
            right: 0;
            overflow-y: hidden;
        }
        &-control {
            display: flex;
            height: 3rem;
        }
    }
    .monospace {
        font-family: monospace;
        font-size: 14px;
        line-height: 1;
    }
</style>
