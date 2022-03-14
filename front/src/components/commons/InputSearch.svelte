<script lang="ts">
    export let value: string = "";
    export let cssClass: string = "";
</script>

<div class={`inp-search ${cssClass}`}>
    <input type="text" class="w-100 m-l-auto" {value} on:input />
    <i class="fas fa-search icon m-l-auto" />
</div>

<style lang="scss">
    @import "../../styles/vars";
    .inp-search {
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
    }
</style>
