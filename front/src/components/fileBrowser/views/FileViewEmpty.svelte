<script>
    import fileBrowserStore from "../../../stores/fileBrowserStore";
</script>

<div class="browser-empty">
    <i class="far fa-folder-open m-auto" />
    <p>
        {$fileBrowserStore.filter
            ? `No se encontraron elementos con el filtro ${$fileBrowserStore.filter}`
            : "Sin elementos por el momento"}
    </p>
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .browser-empty {
        display: flex;
        align-items: center;
        align-content: center;
        flex-direction: column;
        width: 100%;
        color: $color-inp-disable;
        i {
            font-size: 6rem;
            margin: 2.5rem;
        }
    }
</style>
