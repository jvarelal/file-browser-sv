<script lang="ts">
    import { getContext } from "svelte";
    import TextLanguage from "../../../constants/TextLanguage";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import InputText from "../../commons/InputText.svelte";

    const closeModal = getContext<VoidFunction>("closeModal");
    let formLang = TextLanguage[$fileSettingStore.lang].forms.path;
    let route: string = $fileDirectoryStore.current;

    function handleSubmit(): void {
        fileDirectoryStore.setDirectory(route);
        closeModal();
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <InputText
        name="route"
        label={formLang.labels.route}
        regex={/^["?*:|<>\\]/}
        list="cache"
        bind:value={route}
    />
    <datalist id="cache">
        {#each $fileSettingStore.cache as route}
            <option value={route} />
        {/each}
    </datalist>
    <div class="form-field-control d-flex">
        <button type="submit" class="btn m-auto w-25">{formLang.options.submit}</button>
    </div>
</form>
