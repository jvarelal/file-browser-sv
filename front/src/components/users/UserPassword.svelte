<script lang="ts">
    import dialogStore from "../../stores/dialogStore";
    import userProfileStore from "../../stores/userProfileStore";
    import Accordion from "../commons/Accordion.svelte";
    import InputText from "../commons/InputText.svelte";
    import type { ChangePassword, FormLang } from "../../types/UITypes";
    import UserService from "../../services/UserService";

    export let lang: FormLang;
    
    let collapse = true;

    let initialValues: ChangePassword = {
        prevKey: "",
        key: "",
        validateKey: "",
    };
    let values: ChangePassword = { ...initialValues };
    let errors: ChangePassword = { ...initialValues };

    function handleSubmit(): void {
        if (values.key !== values.validateKey) {
            errors.validateKey = lang.validations.validateKey;
            return;
        }
        if (values.prevKey === values.key) {
            errors.key = lang.validations.key;
            return;
        }
        if (values.prevKey !== $userProfileStore.key) {
            errors.prevKey = lang.validations.prevKey;
            return;
        }
        dialogStore.showLoading();
        UserService.changePassword(
            values,
            () => {
                dialogStore.showMessage(lang.success);
                values = { ...initialValues };
                collapse = true;
            },
            (err) => dialogStore.showMessage(err.message)
        );
    }
    $: if (collapse) {
        values = { ...initialValues };
    }
</script>

<Accordion
    title={`<i class="fas fa-key m-r-5  m-l-5"></i> ${lang.title}`}
    id="changePassword"
    renderDefault={false}
    bind:collapse
>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="user-settings-row">
            <div>
                <InputText
                    name="key"
                    label={lang.labels.password}
                    type="password"
                    bind:value={values.key}
                    bind:errors={errors.key}
                />
            </div>
            <div>
                <InputText
                    name="repeatkey"
                    label={lang.labels.confirmPassword}
                    type="password"
                    bind:value={values.validateKey}
                    bind:errors={errors.validateKey}
                />
            </div>
        </div>
        <div class="user-settings-row">
            <div>
                <InputText
                    name="prevKey"
                    label={lang.labels.prevPassword}
                    type="password"
                    bind:value={values.prevKey}
                    bind:errors={errors.prevKey}
                />
            </div>
            <div class="form-field-control d-flex">
                <button type="submit" class="btn m-auto w-50">
                    {lang.options.submit}
                </button>
            </div>
        </div>
    </form>
</Accordion>
