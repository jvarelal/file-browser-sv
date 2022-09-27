<script lang="ts">
    import FileBrowser from "../../constants/FileBrowser";
    import userProfileStore from "../../stores/userProfileStore";
    import type { FormLang } from "../../types/UITypes";

    import Accordion from "../commons/Accordion.svelte";
    import InputLabel from "../commons/InputLabel.svelte";
    import UserActions from "./administration/UserActions.svelte";

    export let lang: FormLang;

    let collapse: boolean = true;
</script>

<Accordion
    title={`<i class="fas fa-info-circle m-r-5  m-l-5"></i> ${lang.title}`}
    id="information"
    renderDefault={false}
    bind:collapse
>
    <div class="user-settings-row">
        <div>
            <InputLabel
                label={lang.labels.user}
                value={$userProfileStore.name}
            />
        </div>
        <div>
            <InputLabel
                label={lang.labels.rol}
                value={FileBrowser.roles.find(
                    (r) => r.value === $userProfileStore.rol
                )?.label}
            />
        </div>
    </div>
    <div class="user-settings-row">
        <div>
            <InputLabel
                label={lang.labels.scope}
                value={$userProfileStore.routes.join("<br/>")}
            />
        </div>
        <UserActions userActions={$userProfileStore.actions} disabled={true} />
    </div>
</Accordion>
