<script lang="ts">
    import { onMount } from "svelte";
    import { secondsStrToTime } from "../../../helpers/Date";

    import FileService from "../../../services/FileService";

    import type { FileUI } from "../../../types/UITypes";

    export let file: FileUI;
    let init = false;
    let audioElement: HTMLAudioElement;
    let seekbar: HTMLInputElement;
    let volumenBar: HTMLInputElement;
    let playButton: HTMLElement;
    let isPaused = true;

    function resetAudio(): void {
        isPaused = true;
        audioElement.pause();
        audioElement.currentTime = 0;
        seekbar.value = "0";
        playButton?.focus()
    }

    function playAudio() {
        if (isPaused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
        isPaused = !isPaused;
    }

    $: if (file && init) {
        resetAudio();
    }

    onMount(resetAudio);
</script>

<div class="audio-data">
    <audio
        controls
        bind:this={audioElement}
        on:timeupdate={() =>
            (seekbar.value = audioElement?.currentTime.toString())}
        on:canplay={() => (seekbar.max = audioElement?.duration.toString())}
    >
        <source src={FileService.viewRawFile(file)} type="audio/mpeg" />
    </audio>
    <div class="audio-animation">
        <canvas height="100" width="480" />
    </div>
    <div class="d-flex w-100">
        <span class="p-8">{secondsStrToTime(seekbar?.value)}</span>
        <input
            type="range"
            class="audio-timestamp w-100"
            bind:this={seekbar}
            on:keydown|stopPropagation
            on:input={() => (audioElement.currentTime = Number(seekbar.value))}
        />
        <span class="p-8">{secondsStrToTime(seekbar?.max)}</span>
    </div>
    <div class="audio-controls">
        <button
            class="audio-control audio-play m-auto"
            bind:this={playButton}
            on:click={playAudio}
        >
            <i class={`far fa-${isPaused ? "play" : "pause"}-circle`} />
        </button>
        <button class="audio-control audio-play m-auto" on:click={resetAudio}>
            <i class="far fa-stop-circle" />
        </button>
        <div class="w-50 p-5 audio-volumen d-flex">
            <span class="p-8">
                <i class="fas fa-volume-mute" />
            </span>
            <input
                class="w-100"
                type="range"
                min="0"
                max="1"
                step="0.01"
                bind:this={volumenBar}
                on:keydown|stopPropagation
                on:input={() =>
                    (audioElement.volume = Number(volumenBar.value))}
            />
            <span class="p-8">
                <i class="fas fa-volume-up" />
            </span>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .audio {
        &-data {
            height: 50%;
            width: 90%;
            display: flex;
            flex-direction: column;
            margin: auto;
            background-color: $bg-btn;
        }
        &-controls {
            width: 100%;
            display: flex;
        }
        &-control {
            background-color: transparent;
            color: $color-text;
            border: 0px;
            font-size: 3.8rem;
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            padding: 0;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            cursor: pointer;
            &:hover,
            &:focus {
                font-size: 4rem;
                background-color: $bg-label;
                color: $color-label;
            }
        }
        &-volumen {
            font-size: 1.75rem;
        }
    }
    audio {
        display: none;
    }
    @media (max-width: $responsive-size) {
        .audio {
            &-data {
                height: auto;
                margin: 1rem auto;
            }
            &-control {
                font-size: 2.5rem;
                width: 3rem;
                height: 3rem;
                cursor: pointer;
                &:hover,
                &:focus {
                    font-size: 3rem;
                }
            }
            &-volumen {
                font-size: 1.25rem;
            }
        }
    }
</style>
