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
        <button class="m-r-auto back" on:click={appViewStore.setBrowser}>
            <i class="fas fa-arrow-left" /> Regresar
        </button>
        <h3 class="user-header-name"><i class="fas fa-cog" /> Configuración</h3>
    </div>
    <div class="user-settings">
        <UserPreferences />
        <UserInformation />
        <UserSession />
        <UserPassword />
    </div>
</section>

<style lang="scss">
    @import "../styles/vars";
    section {
        width: 100%;
        height: 100%;
    }
    .user {
        &-header {
            display: flex;
            align-items: center;
            padding: 1rem;
            position: relative;
            &-name {
                margin: auto;
                font-weight: lighter;
            }
        }
    }
    .back {
        background: transparent;
        border: 0px;
        color: $color-text;
        position: absolute;
        left: 0;
        padding: 0 1rem;
        cursor: pointer;
    }
</style>
