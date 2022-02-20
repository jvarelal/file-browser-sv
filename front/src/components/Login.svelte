<script lang="ts">
    import FileService from "../services/FileService";
    import dialogStore from "../stores/dialogStore";
    import fileDirectoryStore from "../stores/fileDirectoryStore";
    import fileSettingStore from "../stores/fileSettingStore";
    import InputText from "./commons/InputText.svelte";
    import type { Login } from "../types/UITypes";

    export let navigate: (route: string) => void;

    let finalError: string = "";
    let values: Login = { user: "", key: "" };
    let errors: Login = { user: "", key: "" };

    function handleSubmit() {
        dialogStore.showLoading();
        FileService.login(
            values,
            (data) => {
                fileSettingStore.initCache(data.routes);
                fileDirectoryStore.setInit(data.routes[0]);
                dialogStore.closeDialog();
                navigate("/");
            },
            (err) => dialogStore.showMessage(err.message)
        );
    }
</script>

<div class="login">
    <fieldset class="login-container">
        <legend>File Browser</legend>
        <div class="login-section">
            <i class="fas fa-key login-icon" />
        </div>
        <div class="login-section">
            <form on:submit|preventDefault={handleSubmit}>
                <InputText
                    name="user"
                    label="Usuario"
                    bind:value={values.user}
                    bind:errors={errors.user}
                />
                <InputText
                    name="key"
                    label="Password"
                    type="password"
                    bind:value={values.key}
                    bind:errors={errors.key}
                />
                {#if finalError}
                    <div class="f-08" style="color: red">
                        * {finalError}
                    </div>
                {/if}
                <div class="form-field-control d-flex">
                    <button type="submit" class="btn m-auto w-50">
                        Ingresar
                    </button>
                </div>
            </form>
        </div>
    </fieldset>
</div>

<style lang="scss">
    @import "../styles/vars";
    .login {
        height: 100%;
        display: flex;
        fieldset {
            border: 0px;
            border-top: 1px solid $border-light;
            padding: 1rem;
            legend {
                margin: auto;
                font-size: 1.25rem;
            }
        }
        &-container {
            max-width: 600px;
            margin: auto;
            display: flex;
        }
        &-section {
            min-width: 280px;
            max-width: 25%;
            margin: auto;
        }
        &-icon {
            font-size: 3rem;
        }
    }
    @media (max-width: $responsive-size) {
        .login {
            &-container {
                max-width: 320px;
                margin: auto;
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>
