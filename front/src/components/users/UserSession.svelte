<script lang="ts">
    import FileBrowser from "../../constants/FileBrowser";
    import UserService from "../../services/UserService";
    import dialogStore from "../../stores/dialogStore";
    import userProfileStore from "../../stores/userProfileStore";
    import type { FormLang } from "../../types/UITypes";

    import Accordion from "../commons/Accordion.svelte";
    import InputLabel from "../commons/InputLabel.svelte";

    export let lang: FormLang;

    let edit: boolean = false;
    let value: string = $userProfileStore.sessionTime;
    let selectValue: string = value;
    let collapse: boolean = true;

    function toogleEdit(): void {
        edit = !edit;
    }

    function changeSession(): void {
        dialogStore.showLoading();
        UserService.changeSession(
            selectValue,
            () => {
                dialogStore.showMessage(lang.success);
                userProfileStore.setSessionTime(selectValue);
                value = selectValue;
                edit = false;
            },
            (err) => dialogStore.showMessage(err.message)
        );
    }
    $: if (collapse) {
        selectValue = value;
        edit = false;
    }
</script>

<Accordion
    title={`<i class="fas fa-clock m-r-5  m-l-5"></i> ${lang.title}`}
    id="session"
    renderDefault={false}
    bind:collapse
>
    <div class="user-settings-row">
        {#if edit}
            <div>
                <div class="form-field-control">
                    <label for="type">{lang.labels.duration}</label>
                    <div class="form-field">
                        <select
                            id="type"
                            class="w-100"
                            name="type"
                            bind:value={selectValue}
                        >
                            {#each FileBrowser.sessionTime as option}
                                <option
                                    value={option}
                                    selected={option === value}
                                >
                                    {option}
                                </option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
            <div class="d-flex">
                <div class="m-auto">
                    <button
                        class="btn"
                        disabled={selectValue === value}
                        on:click={changeSession}
                    >
                        {lang.options.submit}
                    </button>
                </div>
                <div class="m-auto">
                    <button class="btn" on:click={toogleEdit}>
                        {lang.options.cancel}
                    </button>
                </div>
            </div>
        {:else}
            <div>
                <InputLabel
                    label={lang.labels.duration}
                    {value}
                    action={toogleEdit}
                    iconAction="fas fa-edit"
                />
            </div>
        {/if}
    </div>
</Accordion>
