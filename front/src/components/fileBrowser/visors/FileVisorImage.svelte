<script lang="ts">
    import { onMount } from "svelte";
    import ActionButton from "../../commons/ActionButton.svelte";
    import type { FileUIPreview } from "../../../types/UITypes";
    import { onInterval } from "../../../helpers/Date";

    export let preview: FileUIPreview;
    export let timer: boolean = false;

    let seconds: number = 0;
    let timerSet: boolean = false;
    let imageVisorWrapper: HTMLElement;
    let imageVisor: HTMLImageElement;
    let degre: number = 0;
    let porcentageOption: number[] = [0, 1, 0.75, 0.5, 0.33, 0.25];
    let porcentageIndex: number = 0;
    let select: HTMLSelectElement;
    let loading = false;

    function initImage(): void {
        imageVisor.style.maxHeight = "100%";
        imageVisor.style.maxWidth = "100%";
        imageVisor.removeAttribute("width");
        porcentageIndex = 0;
    }
    function zoom(): void {
        imageVisor.style.maxHeight = null;
        imageVisor.style.maxWidth = null;
        if (
            porcentageIndex >= porcentageOption.length ||
            porcentageIndex === 0
        ) {
            initImage();
        } else {
            imageVisor.width =
                imageVisor?.naturalWidth * porcentageOption[porcentageIndex];
        }
        select.value = porcentageIndex.toString();
    }
    function handleZoomOnClick(): void {
        porcentageIndex++;
        zoom();
    }
    function handleZoomOnSelect(): void {
        porcentageIndex = parseInt(select.value);
        zoom();
    }
    function rotate(g = 90): void {
        degre += g;
        degre = Math.abs(degre) === 360 ? 0 : degre;
        imageVisor.style.transform = `rotate(${degre}deg)`;
    }

    $: if (preview.src && imageVisor && preview.src !== imageVisor?.src) {
        loading = true;
        imageVisor.src = preview.src;
        imageVisorWrapper?.scrollTo(0, 0);
        seconds = 0;
    }
    $: if (timer) {
        if (seconds >= 30) {
            if (preview.next) {
                preview.next();
                seconds = 0;
            } else {
                timer = false;
            }
        }
        if (!timerSet) {
            seconds = 0;
            timerSet = true;
        }
    }
    onInterval(() => (seconds += 1), 1000);
    onMount(initImage);
</script>

<div class="scroll d-flex p-relative" bind:this={imageVisorWrapper}>
    <div class="file-visor-control">
        <div>
            <select bind:this={select} on:change={handleZoomOnSelect}>
                {#each porcentageOption as option, i}
                    <option value={i}>
                        {option === 0 ? "Auto" : option * 100 + "%"}
                    </option>
                {/each}
            </select>
        </div>
        <div class="d-flex">
            <ActionButton on:click={() => rotate(-90)} icon="fas fa-undo" />
            <ActionButton on:click={() => rotate()} icon="fas fa-redo" />
        </div>
    </div>
    {#if loading}
        <div class="loader m-t-10" />
    {/if}
    <img
        on:load={() => {
            loading = false;
            if (porcentageIndex > 0) {
                imageVisor.width =
                    imageVisor?.naturalWidth *
                    porcentageOption[porcentageIndex];
            }
        }}
        bind:this={imageVisor}
        alt="preview"
        class="m-auto"
        class:loading
        class:glass-in={porcentageIndex === 0}
        class:glass-out={porcentageIndex !== 0}
        on:click={handleZoomOnClick}
    />
</div>

<style>
    .file-visor-control {
        position: absolute;
        z-index: 5;
    }
    .loading {
        display: none;
    }
</style>
