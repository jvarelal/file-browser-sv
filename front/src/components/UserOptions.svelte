<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    import appViewStore from "../stores/appViewStore";
    import fileSettingStore from "../stores/fileSettingStore";
    import userProfileStore from "../stores/userProfileStore";
    import UserInformation from "./users/UserInformation.svelte";
    import UserPassword from "./users/UserPassword.svelte";
    import UserPreferences from "./users/UserPreferences.svelte";
    import UserSession from "./users/UserSession.svelte";
    import UsersAdministration from "./users/UsersAdministration.svelte";

    function existTransition(node: HTMLElement, options: any): any {
        if ($fileSettingStore.transitions) {
            return options.fn(node, options);
        }
    }
    onMount(() => {
        if (!$userProfileStore.name) {
            appViewStore.setLogin();
        }
    });
</script>

<section transition:existTransition={{ fn: fly, x: 200, duration: 250 }}>
    <div class="user-header">
        <button class="m-r-auto header-options"  on:click={appViewStore.setBrowser}>
            <i class="fas fa-arrow-left" /> Regresar
        </button>
        <h3 class="user-header-name"><i class="fas fa-cog" /> Configuración</h3>
        <button  class="m-l-auto header-options" on:click={appViewStore.setLogin}>
            <i class="fas fa-sign-out-alt"></i> Salir
        </button>
    </div>
    <div class="user-settings user-container scroll">
        <UserPreferences />
        <UserInformation />
        <UserSession />
        <UserPassword />
        {#if $userProfileStore.rol === "0"}
            <UsersAdministration />
        {/if}
    </div>
</section>

<style lang="scss">
    @import "../styles/vars";
    section {
        width: 100%;
        height: 100%;
    }
    .header-options {
        background-color: transparent;
        border: 0px;
        color: $color-text;
        padding: 0 1rem;
        cursor: pointer;
    }
</style>
