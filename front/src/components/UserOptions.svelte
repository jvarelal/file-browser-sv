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
    import TextLanguage from "../constants/TextLanguage";

    $: lang = TextLanguage[$fileSettingStore.lang];
    function existTransition(node: HTMLElement, options: any): any {
        if ($fileSettingStore.transitions) {
            return options.fn(node, options);
        }
    }
    onMount(() => {
        if (!$userProfileStore.name) {
            appViewStore.login("config");
        }
    });
</script>

<section transition:existTransition={{ fn: fly, x: 200, duration: 250 }}>
    <div class="user-header">
        <button class="m-r-auto header-options" on:click={appViewStore.browser}>
            <i class="fas fa-arrow-left" />
            {lang.label.goBack}
        </button>
        <h3 class="user-header-name">
            <i class="fas fa-cog" />
            {lang.label.config}
        </h3>
        <button
            class="m-l-auto header-options"
            on:click={() => appViewStore.login()}
        >
            <i class="fas fa-sign-out-alt" />
            {lang.label.logout}
        </button>
    </div>
    <div class="user-settings user-container scroll">
        <UserPreferences lang={lang.forms.settings} />
        <UserInformation lang={lang.forms.profile} />
        <UserSession lang={lang.forms.session} />
        <UserPassword lang={lang.forms.password} />
        {#if $userProfileStore.rol === "0"}
            <UsersAdministration lang={lang}/>
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
