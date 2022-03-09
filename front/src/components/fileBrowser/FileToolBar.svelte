<script lang="ts">
    import fileToolbarStore from "../../stores/fileToolbarStore";

    import FilePath from "./path/FilePath.svelte";
    import FileSettings from "./settings/FileSettings.svelte";

    export let numberItemsFiltered: number = 0;
</script>

<div class="browser-toolbar transition" class:show={$fileToolbarStore.show}>
    <FilePath />
    <FileSettings {numberItemsFiltered} />
</div>

<style lang="scss">
    @import "../../styles/vars";
    .browser-toolbar {
        position: fixed;
        top: 0;
        width: 100%;
        background-color: $bg-main;
        z-index: 8;
        transform: translateY(-100%);
        &.show {
            transform: translateY(0%);
        }
    }
</style>
