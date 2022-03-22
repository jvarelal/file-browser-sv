<script lang="ts">
    import { onMount } from "svelte";
    import { secondsStrToTime } from "../../../helpers/Date";
    import { getVolumeIcon } from "../../../helpers/Media";
    import FileService from "../../../services/FileService";

    import type { FileUIPreview } from "../../../types/UITypes";

    export let preview: FileUIPreview;
    export let timer: boolean;

    let videoElement: HTMLVideoElement;
    let seekbar: HTMLInputElement;
    let volumenBar: HTMLInputElement;
    let playButton: HTMLElement;
    let init = false;
    let isPaused: boolean = true;
    let volumeIcon: string = getVolumeIcon("1");

    function playData(): void {
        if (isPaused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
        isPaused = !isPaused;
    }

    function resetData() {
        videoElement.pause();
        videoElement.currentTime = 0;
        seekbar.value = "0";
        playButton?.focus();
        init = true;
        videoElement.focus();
    }

    function handleFullscreen(): void {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            videoElement.setAttribute("data-fullscreen", "false");
        } else {
            if (videoElement.requestFullscreen)
                videoElement.requestFullscreen();
            videoElement.setAttribute("data-fullscreen", "true");
        }
    }

    function handleKeyPress(e: KeyboardEvent) {
        console.log(e);
        switch (e.key) {
            case "Enter":
            case " ":
                e.preventDefault();
                return playData();
            case "ArrowRight":
                e.preventDefault();
                videoElement.currentTime += 10;
                return;
            case "ArrowLeft":
                e.preventDefault();
                videoElement.currentTime -= 10;
                return;
            case "ArrowDown":
                e.preventDefault();
                updateVolume(Number(volumenBar.value) - 0.1);
                return;
            case "ArrowUp":
                e.preventDefault();
                updateVolume(Number(volumenBar.value) + 0.1);
                return;
            default:
                return;
        }
    }

    function updateVolume(value: string | number) {
        videoElement.volume = Number(value);
        volumeIcon = getVolumeIcon(value);
    }

    function endDataPlay(): void {
        if (timer) {
            if (!preview.next) {
                timer = false;
                return resetData();
            }
            return preview.next();
        }
        return resetData();
    }

    $: if (preview && init) {
        videoElement.src = FileService.viewRawFile(preview);
        resetData();
    }

    onMount(resetData);
</script>

<div class="video-player">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        bind:this={videoElement}
        on:timeupdate={() =>
            (seekbar.value = videoElement?.currentTime.toString())}
        on:canplay={() => (seekbar.max = videoElement?.duration.toString())}
        on:ended={endDataPlay}
        on:click={playData}
        on:keydown={handleKeyPress}
    >
        <source type={`audio/${preview?.type}`} />
    </video>
    <div class="video-player-controls w-100 transition">
        <div class="video-player-time w-100 d-flex">
            <span class="p-4">{secondsStrToTime(seekbar?.value)}</span>
            <input
                type="range"
                class="audio-timestamp w-100"
                bind:this={seekbar}
                on:keydown|stopPropagation
                on:input={() =>
                    (videoElement.currentTime = Number(seekbar.value))}
            />
            <span class="p-4">{secondsStrToTime(seekbar?.max)}</span>
        </div>
        <div class="video-player-options p-b-2 w-100">
            <div class="m-r-auto d-flex">
                <button on:click={playData}>
                    <i class={`fas fa-${isPaused ? "play" : "pause"}`} />
                </button>
                <button on:click={resetData}>
                    <i class="fas fa-stop" />
                </button>
            </div>
            <div class="m-l-auto d-flex w-50">
                <div class="w-50 video-player-volumen d-flex m-l-auto p-r-2">
                    <span class="w-25 d-flex m-auto">
                        <i class={`m-l-auto fas fa-volume-${volumeIcon}`} />
                    </span>
                    <input
                        class="w-75 m-auto"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        bind:this={volumenBar}
                        on:keydown|stopPropagation
                        on:input={() => updateVolume(volumenBar.value)}
                    />
                </div>
                <button on:click={handleFullscreen}>
                    <i class="fas fa-expand" />
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .video-player {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        position: relative;
        overflow: hidden;
        video {
            width: 100%;
            height: 100%;
            display: block;
            position: absolute;
        }
        &-controls {
            position: absolute;
            bottom: 0;
            background-color: $bg-label;
            color: $color-label;
            transform: translateY(50%);
            &:hover {
                transform: translateY(0%);
            }
        }
        &-options {
            display: flex;
            button {
                background-color: transparent;
                width: 1.5rem;
                height: 1.5rem;
                border: 0px;
                color: $color-label;
                font-size: 1rem;
            }
        }
    }
</style>
