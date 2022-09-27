<script lang="ts">
    import FileBrowser from "../../constants/FileBrowser";
    import fileSettingStore from "../../stores/fileSettingStore";
    import type { FormLang } from "../../types/UITypes";

    import Accordion from "../commons/Accordion.svelte";

    export let lang: FormLang;

    let collapse: boolean = false;

    function updateTheme(e: Event) {
        let target = e.target as HTMLSelectElement;
        fileSettingStore.setTheme(target.value);
    }

    function updateLang(e: Event) {
        let target = e.target as HTMLSelectElement;
        fileSettingStore.setLanguage(target.value);
        console.log(lang);
    }
</script>

<Accordion
    title={`<i class="fab fa-themeco m-r-5  m-l-5"></i> ${lang.title}`}
    id="preferences"
    renderDefault={false}
    bind:collapse
>
    <div class="user-settings-row">
        <div>
            <div class="form-field-control">
                <label for="type">{lang.labels.theme}</label>
                <div class="form-field">
                    <select
                        id="type"
                        class="w-100"
                        name="type"
                        on:change={updateTheme}
                    >
                        {#each FileBrowser.themes as theme}
                            <option
                                value={theme.value}
                                selected={theme.value ===
                                    $fileSettingStore.theme}
                            >
                                {theme.label}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="form-field-control">
                <label for="type">{lang.labels.language}</label>
                <div class="form-field">
                    <select
                        id="type"
                        class="w-100"
                        name="type"
                        on:change={updateLang}
                    >
                        {#each FileBrowser.langs as lang}
                            <option
                                value={lang.value}
                                selected={lang.value === $fileSettingStore.lang}
                            >
                                {lang.label}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
        <div class="d-flex f-08">
            <div class="m-auto">
                <input
                    type="checkbox"
                    class="check"
                    id="individualMark"
                    checked={$fileSettingStore.transitions}
                    on:change={fileSettingStore.setTransitions}
                />
                <label for="individualMark"> {lang.labels.animations}</label>
            </div>
        </div>
    </div>
</Accordion>
