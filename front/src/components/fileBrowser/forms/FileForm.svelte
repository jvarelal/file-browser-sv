<script lang="ts">
    import { getContext, onMount } from "svelte";
    //stores
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    //components
    import InputText from "../../commons/InputText.svelte";
    import InputFile from "../../commons/InputFile.svelte";
    //types
    import type { BooleanFunction, FileUpload } from "../../../types/UITypes";
    import type {
        ErrorApiResponse,
        FileApiResponse,
    } from "../../../types/ApiTypes";
    //helpers
    import FileService from "../../../services/FileService";
    import FileBrowser from "../../../constants/FileBrowser";
    import TextLanguage from "../../../constants/TextLanguage";

    const closeModal = getContext<VoidFunction>("closeModal");
    const blockModal = getContext<BooleanFunction>("blockModal");
    let formLang = TextLanguage[$fileSettingStore.lang].forms.file;
    let itemSelect = formLang.selects[0];
    let values: FileUpload = {
        type: "folder",
        name: "",
        files: [],
        route: $fileDirectoryStore.current,
    };
    let errors = { name: "", files: [] };
    let finalError: string = "";
    let focusElement: HTMLElement;

    function handleSubmit(): void {
        const cb = (): void => {
            switch (values.type) {
                case "folder":
                    fileDirectoryStore.setDirectory(
                        $fileDirectoryStore.current + "/" + values.name
                    );
                    break;
                case "file":
                    fileBrowserStore.addFiles(values?.files);
                    break;
                case "plain":
                    let customFile: FileApiResponse = {
                        name: values.name,
                        isDirectory: false,
                        creation: new Date().toISOString(),
                        modification: new Date().toISOString(),
                    };
                    fileBrowserStore.setFiles(
                        [...$fileBrowserStore.files, customFile],
                        $fileDirectoryStore.current
                    );
                default:
                    break;
            }
            blockModal(false);
            closeModal();
        };
        const err = (err: ErrorApiResponse): void => {
            blockModal(false);
            finalError = err.message;
            setTimeout(() => {
                finalError = "";
            }, 10000);
        };
        if (["folder", "plain"].includes(values.type)) {
            if (values?.name?.trim().length === 0) {
                errors.name = formLang.validations.required;
                return;
            }
        }
        if (values.type === "plain") {
            if ($fileBrowserStore.files.find((f) => f.name === values?.name)) {
                errors.files = [formLang.validations.exist(values.name)];
                return;
            }
        }
        if (values.type === "file") {
            if (values?.files.length === 0) {
                errors.files = [formLang.validations.required];
                return;
            }
        }
        blockModal(true);
        FileService.create(values, cb, err);
    }

    onMount(() => focusElement.focus());
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div class="form-field-control">
        <label for="type">{formLang.labels.route}</label>
        <div class="form-field">
            <span class="inp-type disable p-3 w-100 f-08 t-left">
                {$fileDirectoryStore.current}
            </span>
        </div>
    </div>
    <div class="form-field-control">
        <label for="type">{itemSelect.label}</label>
        <div class="form-field">
            <select
                id="type"
                class="w-100"
                name="type"
                bind:value={values.type}
                bind:this={focusElement}
            >
                {#each itemSelect.options as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>
    </div>
    {#if ["folder", "plain"].includes(values.type)}
        <InputText
            name="name"
            label={formLang.labels.name}
            bind:value={values.name}
            bind:errors={errors.name}
            regex={FileBrowser.regexp.folderName}
            errorRegexp={formLang.validations.regexp}
        />
    {:else}
        <InputFile
            bind:errors={errors.files}
            bind:filesSelected={values.files}
            currentFiles={$fileBrowserStore.files}
            {formLang}
        />
    {/if}
    {#if finalError}
        <div class="f-08" style="color: red">
            * {finalError}
        </div>
    {/if}
    <div class="form-field-control d-flex">
        <button type="submit" class="btn m-auto w-25"
            >{formLang.options.submit}</button
        >
        <button on:click|preventDefault={closeModal} class="btn m-auto w-25">
            {formLang.options.cancel}
        </button>
    </div>
</form>
