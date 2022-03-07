<script lang="ts">
    import { onMount } from "svelte";
    import FileService from "../../../services/FileService";
    import type { FileUIPreview } from "../../../types/UITypes";
    import { secondsStrToTime } from "../../../helpers/Date";
    import { getVolumeIcon } from "../../../helpers/Media";

    export let preview: FileUIPreview;
    export let timer: boolean;

    let init = false;
    let audioElement: HTMLAudioElement;
    let seekbar: HTMLInputElement;
    let volumenBar: HTMLInputElement;
    let playButton: HTMLElement;
    let isPaused: boolean = true;
    let isStoped: boolean = false;
    let volumeIcon: string = getVolumeIcon("1");

    function resetAudio(): void {
        isPaused = true;
        isStoped = true;
        audioElement.src = FileService.viewRawFile(preview);
        audioElement.pause();
        audioElement.currentTime = 0;
        seekbar.value = "0";
        playButton?.focus();
        init = true;
    }

    function playData(): void {
        if (isPaused) {
            isStoped = false;
            audioElement.play();
        } else {
            audioElement.pause();
        }
        isPaused = !isPaused;
    }

    function endDataPlay() {
        if (timer) {
            if (!preview.next) {
                timer = false;
                return resetAudio();
            }
            return preview.next();
        }
        return resetAudio();
    }

    $: if (preview && init) {
        resetAudio();
        playData();
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
        on:ended={endDataPlay}
    >
        <source type={`audio/${preview.type}`} />
    </audio>
    <div class="audio-animation w-100">
        <i
            class="fas fa-compact-disc m-auto"
            class:rotate={!isStoped}
            class:paused={isPaused}
        />
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
            on:click={playData}
        >
            <i class={`far fa-${isPaused ? "play" : "pause"}-circle`} />
        </button>
        <button class="audio-control audio-play m-auto" on:click={resetAudio}>
            <i class="far fa-stop-circle" />
        </button>
        <div class="w-50 p-8 audio-volumen d-flex">
            <span class="p-8 w-25 d-flex">
                <i class={`m-l-auto fas fa-volume-${volumeIcon}`} />
            </span>
            <input
                class="w-100"
                type="range"
                min="0"
                max="1"
                step="0.01"
                bind:this={volumenBar}
                on:keydown|stopPropagation
                on:input={() => {
                    audioElement.volume = Number(volumenBar.value);
                    volumeIcon = getVolumeIcon(volumenBar.value);
                }}
            />
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .audio {
        &-data {
            width: 90%;
            display: flex;
            flex-direction: column;
            margin: auto;
            background-color: $bg-btn;
        }
        &-animation {
            font-size: 10rem;
            display: flex;
            background-color: $bg-label;
            color: $color-label;
            padding: 1rem 0;
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
    .rotate {
        animation: rotate 3s linear infinite;
        &.paused {
            animation-play-state: paused;
        }
    }
    audio {
        display: none;
    }
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
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
