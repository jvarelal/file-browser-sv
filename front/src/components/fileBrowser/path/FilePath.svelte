<script>
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import appViewStore from "../../../stores/appViewStore";
    //components
    import FilePathActions from "./FilePathActions.svelte";
    import ActionButton from "../../commons/ActionButton.svelte";
    import FilePathEdit from "./FilePathEdit.svelte";
</script>

<nav class="route">
    <FilePathActions />
    <FilePathEdit />
    <div class="file-search m-l-auto">
        <input
            type="text"
            class="w-100 m-l-auto"
            value={$fileBrowserStore.filter}
            on:input={(e) => fileBrowserStore.setFilter(e.target.value)}
        />
        <i class="fas fa-search icon m-l-auto" />
    </div>
    <div class="route-actions d-flex">
        <ActionButton icon="fas fa-cog" on:click={appViewStore.setUserControl} />
    </div>
</nav>

<style lang="scss">
    @import "../../../styles/vars";
    .route {
        border-bottom: 1px solid $border-medium;
        align-items: center;
        display: flex;
        input {
            height: 1.75rem;
            padding: 0 1rem 0 0.75rem;
            margin: 0;
            margin-left: auto;
            box-sizing: border-box;
            background-color: $bg-inp;
            color: $color-text;
            border: 0px;
            border-left: 1px solid $border-medium;
        }
        .file-search {
            display: flex;
            min-width: 160px;
            width: 20%;
            align-items: center;
            position: relative;
            .icon {
                position: absolute;
                right: 0;
                margin: 0 0.5rem;
            }
        }
    }
</style>
