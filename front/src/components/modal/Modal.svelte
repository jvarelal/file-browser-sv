<script lang="ts">
    import { setContext } from "svelte";
    import { fade } from "svelte/transition";
    import type { BooleanFunction } from "../../types/UITypes";

    export let onClose: VoidFunction;
    export let label: string = "";
    export let icon: string = "";

    let translatePorcentage: number = 100;
    let timerTranslate: number = 300;
    let block: boolean = false;

    function closeModal(): void {
        if (!block) {
            translatePorcentage = 100;
            setTimeout(onClose, timerTranslate);
        }
    }
    function blockModal(status: boolean): void {
        block = status;
    }
    function validateKey(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            closeModal();
        }
    }

    setContext<VoidFunction>("closeModal", closeModal);
    setContext<BooleanFunction>("blockModal", blockModal);
</script>

<svelte:window on:keydown={validateKey} />
<div
    class="modal-wrapper"
    transition:fade
    on:introend={() => (translatePorcentage = 0)}
>
    <div
        class="modal"
        style={`transform: translateX(-${translatePorcentage}%);`}
    >
        <div class="modal-title d-flex">
            <div class="modal-title-content m-r-auto">
                <i class={icon} />
                <span class="p-l-5">
                    {label}
                </span>
            </div>
            <button
                class="m-l-auto close-arrow "
                style={block ? "color: #aaaa" : ""}
                on:click={closeModal}
            >
                <i class="fas fa-arrow-left" />
            </button>
        </div>
        {#if block}
            <div class="modal-body scroll" transition:fade>
                <div class="loader" />
                <div class="t-center m-5">Procesando...</div>
            </div>
        {/if}
        <div class="modal-body scroll" style={block ? `display: none;` : ""}>
            <slot />
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../styles/vars";
    .modal {
        max-width: 25%;
        min-width: 320px;
        height: 100vh;
        background-color: $bg-main;
        transition: all 0.3s;
        height: 100vh;
        &-title {
            border-bottom: 1px solid $color-text;
            &-content {
                padding: 0.5rem 1rem;
            }
        }
        &-body {
            padding: 1rem;
            max-height: 90vh;
            overflow-y: auto;
        }
    }
</style>
