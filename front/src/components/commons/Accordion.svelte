<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { BasicOption } from "../../types/UITypes";

    export let title: string = "";
    export let id: string = "id";
    export let collapse: boolean = false;
    export let cssClass: string = "";
    export let renderDefault: boolean = true;
    export let labelCenter: boolean = false;
    export let options: BasicOption[] = [];

    const dispatch = createEventDispatcher();

    function handleFocusEnter(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            collapse = !collapse;
            onChange();
        }
    }
    function onChange() {
        dispatch("change", { collapse });
    }
</script>

<div class={"accordion " + cssClass}>
    <div class="accordion-option">
        {#each options as option}
            <button title={option.label} on:click={option.action}>
                <i class={option.icon} />
            </button>
        {/each}
    </div>
    <input
        type="checkbox"
        name={id}
        {id}
        bind:checked={collapse}
        on:change={onChange}
    />
    <label
        class="d-block"
        class:text-center={labelCenter}
        for={id}
        tabindex="0"
        on:keypress|preventDefault={handleFocusEnter}
    >
        <i
            class="fas fa-angle-right transition"
            class:fa-rotate-90={!collapse}
        />
        {@html title}
    </label>
    <section class="transition">
        {#if renderDefault || !collapse}
            <slot />
        {/if}
    </section>
</div>

<style lang="scss">
    @import "../../styles/vars";
    .accordion {
        border-bottom: 1px solid $border-medium;
        overflow-x: hidden;
        position: relative;
        > label {
            padding: 0.25rem 0.75rem;
            cursor: pointer;
            border-bottom: 1px solid $border-medium;
            &:focus {
                background-color: $bg-btn-focus;
            }
        }
        > input[type="checkbox"] {
            display: none;
            position: absolute;
            opacity: 0;
            &:checked + label + section {
                max-height: 0;
                opacity: 1;
                padding: 0;
                overflow: hidden;
            }
        }
        &-option {
            position: absolute;
            right: 0;
            top: 0;
            padding: 0.25rem 0;
            button {
                width: 2rem;
                border-radius: 0px;
                border-right: 1px solid $border-medium;
                border-left: 1px solid $border-medium;
                border-top: 0px;
                border-bottom: 0px;
                background: transparent;
                color: $color-text;
                cursor: pointer;
                font-size: 0.9rem;
                &:hover {
                    font-size: 1rem;
                }
            }
        }
    }
</style>
