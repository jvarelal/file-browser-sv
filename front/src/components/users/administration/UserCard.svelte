<script lang="ts">
    import { getContext } from "svelte";
    import userProfileStore from "../../../stores/userProfileStore";
    import InputLabel from "../../commons/InputLabel.svelte";
    import UserActions from "./UserActions.svelte";
    import Accordion from "../../commons/Accordion.svelte";
    import FileBrowser from "../../../constants/FileBrowser";
    import ActionButton from "../../commons/ActionButton.svelte";
    import type { UserApiResponse } from "../../../types/ApiTypes";
    import type { FormLang, UserAppFunction } from "../../../types/UITypes";

    export let userData: UserApiResponse;
    export let lang: FormLang;

    let onEditUser: UserAppFunction = getContext<UserAppFunction>("onEditUser");
    let onDelete: UserAppFunction = getContext<UserAppFunction>("onDelete");
</script>

<Accordion
    title={`<i class="fas fa-user m-r-5 m-l-5"></i> ${userData.user}`}
    id={userData.user}
    cssClass="m-auto user-settings"
    collapse={true}
>
    <div class="user-settings-row">
        <div>
            <InputLabel
                label="Rol"
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
            <InputLabel label={lang.labels.sessionTime} value={userData.sessionTime} />
        </div>
        <div>
            <InputLabel label={lang.labels.creation} value={userData.creation} />
        </div>
    </div>
    <div class="user-settings-row">
        <UserActions userActions={userData.actions} disabled={true} />
        <div>
            <InputLabel
                label={lang.labels.routes}
                value={userData.routes?.join("<br/>")}
            />
        </div>
    </div>
</Accordion>
