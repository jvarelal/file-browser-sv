<script lang="ts">
    import FilePath from "./path/FilePath.svelte";
    import FileSettings from "./settings/FileSettings.svelte";
    
    export let numberItemsFiltered: number = 0;

</script>

<div class="browser-toolbar">
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
    }
</style>