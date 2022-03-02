<script lang="ts">
    import { getContext, onMount } from "svelte";
    //stores
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
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

    const closeModal = getContext<VoidFunction>("closeModal");
    const blockModal = getContext<BooleanFunction>("blockModal");
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
                errors.name = `* El campo es obligatorio`;
                return;
            }
        }
        if (values.type === "plain") {
            if ($fileBrowserStore.files.find((f) => f.name === values?.name)) {
                errors.files = [
                    `El archivo ${values.name} ya existe en la ruta`,
                ];
                return;
            }
        }
        if (values.type === "file") {
            if (values?.files.length === 0) {
                errors.files = [`* El campo es obligatorio`];
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
        <label for="type">Ruta</label>
        <div class="form-field">
            <span class="inp-type disable p-3 w-100 f-08 t-left">
                {$fileDirectoryStore.current}
            </span>
        </div>
    </div>
    <div class="form-field-control">
        <label for="type">Tipo de elemento</label>
        <div class="form-field">
            <select
                id="type"
                class="w-100"
                name="type"
                bind:value={values.type}
                bind:this={focusElement}
            >
                <option value="folder">Folder</option>
                <option value="plain">Archivo</option>
                <option value="file">Carga multiple</option>
            </select>
        </div>
    </div>
    {#if ["folder", "plain"].includes(values.type)}
        <InputText
            name="name"
            label="Nombre"
            bind:value={values.name}
            bind:errors={errors.name}
            regex={FileBrowser.regexp.folderName}
        />
    {:else}
        <InputFile
            bind:errors={errors.files}
            bind:filesSelected={values.files}
            currentFiles={$fileBrowserStore.files}
        />
    {/if}
    {#if finalError}
        <div class="f-08" style="color: red">
            * {finalError}
        </div>
    {/if}
    <div class="form-field-control d-flex">
        <button type="submit" class="btn m-auto w-25">Agregar</button>
        <button on:click|preventDefault={closeModal} class="btn m-auto w-25">
            Cancelar
        </button>
    </div>
</form>
