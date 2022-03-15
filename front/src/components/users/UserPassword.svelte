<script lang="ts">
    import dialogStore from "../../stores/dialogStore";
    import userProfileStore from "../../stores/userProfileStore";
    import Accordion from "../commons/Accordion.svelte";
    import InputText from "../commons/InputText.svelte";
    import type { ChangePassword } from "../../types/UITypes";
    import UserService from "../../services/UserService";

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
            errors.validateKey = "Los valores ingresados no coinciden";
            return;
        }
        if (values.prevKey === values.key) {
            errors.key = "El nuevo password no puede ser igual al anterior";
            return;
        }
        if (values.prevKey !== $userProfileStore.key) {
            errors.prevKey = "El password actual es incorrecto";
            return;
        }
        dialogStore.showLoading();
        UserService.changePassword(
            values,
            () => {
                dialogStore.showMessage("Password actualizado");
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
    title={`<i class="fas fa-key m-r-5  m-l-5"></i> Cambiar Password`}
    id="changePassword"
    renderDefault={false}
    bind:collapse
>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="user-settings-row">
            <div>
                <InputText
                    name="key"
                    label="Password"
                    type="password"
                    bind:value={values.key}
                    bind:errors={errors.key}
                />
            </div>
            <div>
                <InputText
                    name="repeatkey"
                    label="Confirmar Password"
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
                    label="Password previo"
                    type="password"
                    bind:value={values.prevKey}
                    bind:errors={errors.prevKey}
                />
            </div>
            <div class="form-field-control d-flex">
                <button type="submit" class="btn m-auto w-50">
                    Actualizar
                </button>
            </div>
        </div>
    </form>
</Accordion>
