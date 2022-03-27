<script lang="ts">
    import { getContext, onMount } from "svelte";
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import userProfileStore from "../../../stores/userProfileStore";
    //components
    import FileService from "../../../services/FileService";
    import InputText from "../../commons/InputText.svelte";
    import InputLabel from "../../commons/InputLabel.svelte";
    //types
    import { getSizeMb } from "../../../helpers/Media";
    import type { BooleanFunction, FileUI } from "../../../types/UITypes";
    import type { ErrorApiResponse } from "../../../types/ApiTypes";
    //helpers
    import { setDateFormatStr } from "../../../helpers/Date";
    import FileBrowser from "../../../constants/FileBrowser";
    import userOperations from "../../../constants/UserOperations";
    import fileBookmarkGroupStore from "../../../stores/fileBookmarkGroupStore";

    export let file: FileUI;

    const closeModal = getContext<VoidFunction>("closeModal");
    const blockModal = getContext<BooleanFunction>("blockModal");
    let editName: boolean = false;
    let editVirutalGroup: boolean = false;
    let values = { name: file.name, virtualGroup: file.virtualGroup };
    let errors = { name: "" };
    let finalError: string = "";

    function handleSubmit(): void {
        let updatedFile = { ...file, newName: values.name };
        const cb = () => {
            fileBrowserStore.setFileNameUpdate(updatedFile);
            blockModal(false);
            closeModal();
        };
        const err = (err: ErrorApiResponse) => {
            blockModal(false);
            finalError = err.message;
            setTimeout(() => {
                finalError = "";
            }, 10000);
        };
        if (values?.name?.trim().length === 0) {
            errors.name = `* El campo es obligatorio`;
            return;
        }
        if (values?.name?.trim() === file.name) {
            errors.name = `* El campo no ha sido actualizado`;
            return;
        }
        if (
            $fileBrowserStore.files.find((f) => f.name === values.name.trim())
        ) {
            errors.name = `* El nombre del archivo ya existe en la ruta`;
            return;
        }
        blockModal(true);
        FileService.edit(updatedFile, cb, err);
    }

    function handleSubmitVirtualGroup(): void {
        fileBrowserStore.updateBookmarks({
            ...file,
            virtualGroup: Number(values.virtualGroup) || 0,
        });
        closeModal();
    }

    function goToRoute(): void {
        if ($fileBrowserStore.viewBookmarks) {
            fileBrowserStore.setViewBookmarks();
            fileDirectoryStore.setDirectory(file.route, file.name);
            closeModal();
        }
    }

    onMount(() => {
        if (file.isDirectory) {
            blockModal(true);
            FileService.information(
                file,
                (resp): void => {
                    if (resp.data) {
                        file = { ...file, ...resp.data };
                    } else {
                        finalError =
                            "No se puede completar la información de carpeta";
                    }
                    blockModal(false);
                },
                (data): void => {
                    finalError =
                        "No se puede completar la información de carpeta: " +
                        data.message;
                    blockModal(false);
                }
            );
        }
    });
</script>

<form
    on:submit|preventDefault={editVirutalGroup
        ? handleSubmitVirtualGroup
        : handleSubmit}
>
    <div class="form-field-control">
        <label for="type">Ruta</label>
        <div class="form-field">
            <span
                class={`inp-type disable p-3 w-100 f-08 t-left ${
                    $fileBrowserStore.viewBookmarks ? " pointer underline" : ""
                }`}
                on:click={goToRoute}
            >
                {file.route}
            </span>
        </div>
    </div>
    {#if editName}
        <InputText
            name="name"
            label="Nombre"
            bind:value={values.name}
            bind:errors={errors.name}
            regex={FileBrowser.regexp.folderName}
            errorRegexp={`* Los nombres de archivos no pueden contener los caracteres " / ? * : | < > \ `}
        />
    {:else}
        <InputLabel
            label="Nombre"
            value={file.name}
            action={$userProfileStore.actions.includes(userOperations.update) &&
            !editVirutalGroup
                ? () => (editName = !editName)
                : null}
            iconAction="fas fa-edit"
        />
    {/if}

    {#if $fileBrowserStore.viewBookmarks}
        {#if editVirutalGroup}
            <div class="form-field-control">
                <label for="type">Grupo Marcadores</label>
                <div class="form-field">
                    <select
                        id="type"
                        class="w-100"
                        name="type"
                        bind:value={values.virtualGroup}
                        required
                    >
                        {#each $fileBookmarkGroupStore.groupList as groupList}
                            <option value={groupList.id}
                                >{groupList.name}</option
                            >
                        {/each}
                    </select>
                </div>
            </div>
        {:else}
            <InputLabel
                label="Grupo Marcadores"
                value={$fileBookmarkGroupStore.groupList.find(
                    (g) => g.id === file.virtualGroup
                ).name}
                action={!editName
                    ? () => (editVirutalGroup = !editVirutalGroup)
                    : null}
                iconAction="fas fa-edit"
            />
        {/if}
    {/if}

    {#if !editVirutalGroup}
        {#if file.size !== undefined}
            <InputLabel label="Tamaño" value={getSizeMb(file.size)} />
        {/if}

        {#if file.creation}
            <InputLabel
                label="Creación"
                value={setDateFormatStr(file.creation, "dd/mm/yyyy HH24:MI")}
            />
        {/if}

        {#if file.modification}
            <InputLabel
                label="Ultima Modificación"
                value={setDateFormatStr(
                    file.modification,
                    "dd/mm/yyyy HH24:MI"
                )}
            />
        {/if}
    {/if}
    {#if finalError}
        <div class="f-08" style="color: red">
            * {finalError}
        </div>
    {/if}
    {#if editName || editVirutalGroup}
        <div class="form-field-control d-flex">
            <button type="submit" class="btn m-auto w-25">Modificar</button>
            <button
                on:click|preventDefault={() => (editName = false)}
                class="btn m-auto w-25"
            >
                Cancelar
            </button>
        </div>
    {/if}
</form>
