<script context="module" lang="ts">
    //control focus with keys
    let elements: HTMLElement[] = [];
    let current: number = 0;
    function validateKey(e: KeyboardEvent, index: number = 0) {
        if (e.key === "Enter") {
            (e.target as HTMLElement).click();
        } else if (
            ["ArrowRight", "ArrowDown"].includes(e.key) &&
            index < elements.length
        ) {
            current++;
            elements[current].focus();
        } else if (["ArrowLeft", "ArrowUp"].includes(e.key) && index > 0) {
            current--;
            elements[current].focus();
        }
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";

    export let icon: string = "";
    export let label: string = "";

    let index: number = 0;
    let element: HTMLElement;

    onMount(() => {
        index = elements.length;
        elements.push(element);
        if (index === 0) {
            element?.focus();
        }
        return () => {
            elements = [];
            current = 0;
        };
    });
</script>

<div
    class="context-menu-item"
    on:click
    tabindex="0"
    on:keydown={(e) => validateKey(e, index)}
    bind:this={element}
>
    <i class={`${icon} context-menu-icon`} />
    {label}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .context-menu {
        &-item {
            padding: 0.25rem;
            cursor: pointer;
            &:hover,
            &:focus {
                background: $bg-btn-focus;
            }
        }
        &-icon {
            margin: 0 0.5rem;
            width: 1rem;
            text-align: center;
        }
    }
</style>
