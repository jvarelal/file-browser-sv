<script lang="ts">
    export let className: string = "";
    export let title: string = "";
    export let icon: string = "";
    export let style: string = "";
    export let small: boolean = false;
    export let disabled: boolean = false;
</script>

<button
    on:click|stopPropagation
    class={"action-button " + className}
    class:small
    {disabled}
    {title}
    {style}
>
    <i class={icon} />
</button>

<style lang="scss">
    @import "../../styles/vars";
    .action-button {
        width: 2rem;
        height: 2rem;
        font-size: 1.2rem;
        border: 1px solid $border-light;
        background: $bg-btn;
        cursor: pointer;
        color: $color-text;
        &:disabled {
            color: $color-inp-disable;
            cursor: default;
            &:hover,
            &:focus {
                background: $bg-btn;
                border: 1px solid $border-medium;
            }
        }
        &:hover,
        &:focus {
            background: $bg-btn-focus;
            border: 1px solid $border-strong;
        }
        &.small {
            width: 1.75rem;
            height: 1.75rem;
            font-size: 0.9rem;
        }
    }
</style>
