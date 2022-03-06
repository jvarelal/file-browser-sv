<script lang="ts">
    import userOperations from "../../constants/UserOperations";

    import userProfileStore from "../../stores/userProfileStore";

    import Accordion from "../commons/Accordion.svelte";
    import InputLabel from "../commons/InputLabel.svelte";

    const roles: string[] = ["Admin", "User", "Reader"];
    let collapse: boolean = true;
</script>

<Accordion
    title="Informacion de Usuario"
    id="information"
    renderDefault={false}
    bind:collapse
>
    <div class="user-settings-row">
        <div>
            <InputLabel label="Usuario" value={$userProfileStore.name} />
        </div>
        <div>
            <InputLabel label="Perfil" value={roles[$userProfileStore.rol]} />
        </div>
    </div>
    <div class="user-settings-row">
        <div>
            <InputLabel
                label="Scope inicial"
                value={$userProfileStore.routes.join("<br/>")}
            />
        </div>
        <div class="d-flex f-08">
            <div class="w-25 m-auto">
                <div class="m-auto p-4">
                    <input
                        type="checkbox"
                        disabled
                        checked={$userProfileStore.actions.includes(
                            userOperations.read
                        )}
                        id="read"
                    />
                    <label for="read"> Read </label>
                </div>
                <div class="m-auto p-4">
                    <input
                        type="checkbox"
                        disabled
                        checked={$userProfileStore.actions.includes(
                            userOperations.delete
                        )}
                        id="delete"
                    />
                    <label for="delete"> Delete </label>
                </div>
            </div>
            <div class="w-25 m-auto">
                <div class="m-auto p-4">
                    <input
                        type="checkbox"
                        disabled
                        checked={$userProfileStore.actions.includes(
                            userOperations.write
                        )}
                        id="write"
                    />
                    <label for="write"> Write </label>
                </div>
                <div class="m-auto p-4">
                    <input
                        type="checkbox"
                        disabled
                        checked={$userProfileStore.actions.includes(
                            userOperations.update
                        )}
                        id="update"
                    />
                    <label for="update"> Update </label>
                </div>
            </div>
        </div>
    </div>
</Accordion>

<style lang="scss">
    @import "../../styles/vars";
    input[type="checkbox"] {
        border-radius: 10%;
        &:disabled {
            background-color: $bg-inp-disable;
        }
    }
</style>
