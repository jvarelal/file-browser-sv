<script>
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import appViewStore from "../../../stores/appViewStore";
    //components
    import FilePathActions from "./FilePathActions.svelte";
    import ActionButton from "../../commons/ActionButton.svelte";
    import FilePathEdit from "./FilePathEdit.svelte";
    import InputSearch from "../../commons/InputSearch.svelte";
</script>

<nav class="route">
    <FilePathActions />
    <FilePathEdit />
    <InputSearch
        cssClass="m-l-auto"
        value={$fileBrowserStore.filter}
        on:input={(e) => fileBrowserStore.setFilter(e.target.value)}
    />
    <div class="route-actions d-flex">
        <ActionButton
            icon="fas fa-cog"
            on:click={appViewStore.setUserControl}
        />
    </div>
</nav>

<style lang="scss">
    @import "../../../styles/vars";
    .route {
        border-bottom: 1px solid $border-medium;
        align-items: center;
        display: flex;
    }
</style>
