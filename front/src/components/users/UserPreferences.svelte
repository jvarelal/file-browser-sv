<script lang="ts">
    import FileBrowser from "../../constants/FileBrowser";
    import fileSettingStore from "../../stores/fileSettingStore";

    import Accordion from "../commons/Accordion.svelte";

    let collapse: boolean = false;

    function updateTheme(e: Event) {
        let target = e.target as HTMLSelectElement;
        fileSettingStore.setTheme(target.value);
    }
</script>

<Accordion
    title="Preferencias"
    id="preferences"
    renderDefault={false}
    bind:collapse
>
    <div class="user-settings-row">
        <div>
            <div class="form-field-control">
                <label for="type">Tema</label>
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
                <label for="individualMark"> Animaciones de explorador </label>
            </div>
        </div>
    </div>
</Accordion>
