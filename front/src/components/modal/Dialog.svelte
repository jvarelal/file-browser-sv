<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import dialogStore from "../../stores/dialogStore";

    let accept: HTMLElement;

    function validateKey(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            dialogStore.closeDialog();
        }
    }

    $: if (!$dialogStore.options) {
        accept?.focus();
    }

    onMount(() => {
        setTimeout(() => {
            accept?.focus();
        }, 250);
    });
</script>

<svelte:window on:keydown={validateKey} />
<div class="modal-wrapper" transition:fly>
    <div class="dialog">
        {#if $dialogStore.title}
            <div class="dialog-title t-center p-5 m-b-5">
                {$dialogStore.title}
            </div>
        {/if}
        {#if $dialogStore.loading}
            <div class="dialog-body t-center p-5">
                <span class="m-l-5 m-r-5">Procesando...</span>
            </div>
        {:else}
            <div class="dialog-body t-center p-5">
                <span class="m-l-5 m-r-5">{@html $dialogStore.message}</span>
            </div>
            <div class="dialog-footer d-flex m-t-8">
                <button
                    class="btn m-auto w-25"
                    bind:this={accept}
                    on:click={() => {
                        $dialogStore.options
                            ? $dialogStore.onAction()
                            : dialogStore.closeDialog();
                    }}
                >
                    Aceptar
                </button>
                {#if $dialogStore.options}
                    <button
                        class="btn m-auto w-25"
                        on:click={() => {
                            $dialogStore.onHide();
                            dialogStore.closeDialog();
                        }}
                    >
                        Cancelar
                    </button>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../../styles/vars";
    .dialog {
        max-width: 50%;
        min-width: 275px;
        height: 50%;
        background-color: $bg-main;
        transition: all 0.3s;
        margin: auto;
        border-radius: 1rem;
        padding: 1.5rem 1.5rem;
        &-title {
            border-bottom: 1px solid $border-light;
        }
    }
</style>
