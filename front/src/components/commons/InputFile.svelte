<script lang="ts">
    import type { FileUI, FormLang } from "../../types/UITypes";
    import { handleDrop } from "../../helpers/Media";

    export let filesSelected: File[] = [];
    export let currentFiles: FileUI[] = [];
    export let errors: string[] = [];
    export let formLang: FormLang

    let dragOn: boolean = false;
    let inputFile: HTMLInputElement;

    function addFiles(inputFiles: File[]): void {
        errors = [];
        inputFiles.forEach((file: File) => {
            if (!filesSelected.find((f) => f.name === file.name)) {
                if (currentFiles.find((f) => f.name === file.name)) {
                    errors.push(formLang.validations.exist(file.name));
                } else {
                    filesSelected = [...filesSelected, file];
                }
            }
        });
    }
    function removeFile(file: File): void {
        filesSelected = filesSelected.filter((f) => f.name !== file.name);
    }
    function handleChange(): void {
        let files = Array.from(inputFile.files);
        addFiles(files);
    }
</script>

<div class="form-field-control">
    <label for="file">{formLang.labels.files}</label>
    <div class="form-field" style="flex-direction: column;">
        <div
            class="file-entry white pointer"
            class:dragOn
            on:click={() => inputFile.click()}
            on:keydown={(e) => (e.key === "Enter" ? inputFile.click() : null)}
            on:dragenter|preventDefault={() => (dragOn = true)}
            on:drop|preventDefault={(e) => handleDrop(e, addFiles)}
            on:dragover|preventDefault={() => (dragOn = false)}
            tabindex="0"
            draggable
        >
            <i class="fas fa-plus" />
            <i class="fas fa-file" />
        </div>
        <input
            type="file"
            name="file"
            multiple
            on:change={handleChange}
            bind:this={inputFile}
        />
        <table class="tbl w-100 f-09">
            <tbody>
                {#each filesSelected as file}
                    <tr>
                        <td class="t-left">{file.name}</td>
                        <td>
                            <button
                                on:click|preventDefault={() => removeFile(file)}
                                class="inp-type disable pointer"
                            >
                                <i class="fas fa-trash-alt" />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    {#each errors as err}
        <div class="form-field-error m-t-4 f-08">* {err}</div>
    {/each}
</div>

<style lang="scss">
    @import "../../styles/vars";
    .file-entry {
        font-size: 2rem;
        padding: 2rem;
        border: 1px solid $border-light;
        border-bottom: 1px solid $border-medium;
    }
    input[type="file"] {
        display: none;
    }
    .dragOn {
        font-size: 2.25rem;
    }
</style>
