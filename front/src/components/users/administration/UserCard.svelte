<script lang="ts">
    import { getContext } from "svelte";
    import userProfileStore from "../../../stores/userProfileStore";
    import InputLabel from "../../commons/InputLabel.svelte";
    import UserActions from "./UserActions.svelte";
    import Accordion from "../../commons/Accordion.svelte";
    import FileBrowser from "../../../constants/FileBrowser";
    import ActionButton from "../../commons/ActionButton.svelte";
    import type { UserApiResponse } from "../../../types/ApiTypes";
    import type { UserAppFunction } from "../../../types/UITypes";

    export let userData: UserApiResponse;
    let onEditUser: UserAppFunction = getContext<UserAppFunction>("onEditUser");
    let onDelete: UserAppFunction = getContext<UserAppFunction>("onDelete");
</script>

<Accordion
    title={`<i class="fas fa-user m-r-5 m-l-5" /> ${userData.user}`}
    id={userData.user}
    cssClass="m-auto user-settings"
    collapse={true}
>
    <div class="user-settings-row">
        <div>
            <InputLabel
                label="Perfil"
                value={FileBrowser.roles.find((r) => r.value === userData.rol)
                    ?.label}
            />
        </div>
        {#if $userProfileStore.name !== userData.user}
            <div class="d-flex">
                <ActionButton
                    className="m-auto"
                    icon="fas fa-edit"
                    on:click={() => onEditUser({ ...userData })}
                />
                <ActionButton
                    className="m-auto"
                    icon="fas fa-trash"
                    on:click={() => onDelete({ ...userData })}
                />
            </div>
        {/if}
    </div>
    <div class="user-settings-row">
        <div>
            <InputLabel label="Tiempo de sesión" value={userData.sessionTime} />
        </div>
        <div>
            <InputLabel label="Creación" value={userData.creation} />
        </div>
    </div>
    <div class="user-settings-row">
        <UserActions userActions={userData.actions} disabled={true} />
        <div>
            <InputLabel
                label="Rutas acceso"
                value={userData.routes?.join("<br/>")}
            />
        </div>
    </div>
</Accordion>
