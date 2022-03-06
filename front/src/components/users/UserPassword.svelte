<script lang="ts">
    import dialogStore from "../../stores/dialogStore";
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
    let finalError: string = "";

    function handleSubmit(): void {
        if (values.key !== values.validateKey) {
            finalError = "Los valores ingresados no coinciden";
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
    title="Cambiar Password"
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
                />
            </div>
            <div>
                <InputText
                    name="repeatkey"
                    label="Confirmar Password"
                    type="password"
                    bind:value={values.validateKey}
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
                />
            </div>
            <div class="form-field-control d-flex">
                <button type="submit" class="btn m-auto w-50"> Actualizar </button>
            </div>
        </div>
        {#if finalError}
            <div class="f-08" style="color: red">
                * {finalError}
            </div>
        {/if}
    </form>
</Accordion>
