<script>
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    //components
    import FilePathActions from "./FilePathActions.svelte";
    import ActionButton from "../../commons/ActionButton.svelte";
    import FilePathEdit from "./FilePathEdit.svelte";
    //helpers
    import FileBrowser from "../../../constants/FileBrowser";
</script>

<nav class="route">
    <FilePathActions />
    <FilePathEdit />
    <div class="file-search m-l-auto">
        <input
            type="text"
            class="w-100 m-l-auto"
            on:input={(e) => fileBrowserStore.setFilter(e.target.value)}
        />
        <i class="fas fa-search icon m-l-auto" />
    </div>
    <div class="route-actions d-flex">
        <ActionButton
            on:click={fileSettingStore.setThemeId}
            icon={FileBrowser.themes[$fileSettingStore.themeId].label}
        />
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
            padding: 0 2rem 0 0.75rem;
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
            min-width: 180px;
            max-width: 20%;
            align-items: center;
            position: relative;
            .icon {
                position: absolute;
                right: 0;
                margin: 0 0.5rem;
            }
        }
    }
    @media (max-width: $responsive-size) {
        .file-search {
            max-width: 100%;
            width: 100%;
        }
    }
</style>
