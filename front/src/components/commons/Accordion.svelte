<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let title: string = "";
    export let id: string = "id";
    export let collapse: boolean = false;
    export let cssClass: string = "";
    export let renderDefault: boolean = true;
    export let labelCenter: boolean = false;

    const dispatch = createEventDispatcher();

    function handleFocusEnter(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            collapse = !collapse;
            onChange()
        }
    }
    function onChange() {
        dispatch("change", { collapse });
    }
</script>

<div class={"accordion " + cssClass}>
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
        on:keypress={handleFocusEnter}
    >
        {title}
    </label>
    <section>
        {#if renderDefault || !collapse}
            <slot />
        {/if}
    </section>
</div>

<style lang="scss">
    @import "../../styles/vars";
    .accordion {
        border-bottom: 1px solid $border-medium;
        > section {
            transition: all 0.35s;
        }
        > label {
            padding: 0.25rem;
            cursor: pointer;
            border-bottom: 1px solid $border-medium;
            &::before {
                content: "❯";
                width: 1rem;
                height: 1rem;
                padding: 0 1rem;
                text-align: center;
                transition: all 0.35s;
            }
            &:focus {
                background-color: $bg-btn-focus;
            }
        }
        > input[type="checkbox"] {
            display: none;
            position: absolute;
            opacity: 0;
            &:checked + label {
                &::before {
                    padding: 0.25rem;
                    transform: rotate(90deg);
                }
            }
            &:checked + label + section {
                max-height: 0;
                opacity: 1;
                padding: 0;
                overflow: hidden;
            }
        }
    }
</style>
