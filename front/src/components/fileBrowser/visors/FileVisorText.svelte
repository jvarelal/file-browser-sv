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
            },
            (err) => {
                dialogStore.reset();
                loading = false;
                errMessage = err.message;
            }
        );
    }
    function dialogOnCancel() {
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

    function editFile() {
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
        <h2>errMessage</h2>
    {:else}
        <textarea
            bind:this={textArea}
            class="txt-edit-file scroll"
            class:enableEdit
            disabled={!enableEdit}
        />
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
        &-file {
            width: calc(100% - 1rem);
            height: calc(100% - 1.5rem);
            background-color: transparent;
            color: $color-text;
            margin: 0;
            border: none;
            padding: 0.5rem;
            &.enableEdit {
                height: calc(100% - 5rem);
            }
        }
        &-control {
            display: flex;
            height: 3rem;
        }
    }
</style>
