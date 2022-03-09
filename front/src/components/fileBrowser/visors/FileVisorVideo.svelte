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

    function endDataPlay() {
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
    >
        <source type={`audio/${preview?.type}`} />
    </video>
    <div class="video-player-controls w-100">
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
        <div class="video-player-options  w-100">
            <div class="m-r-auto d-flex">
                <button on:click={playData}>
                    <i class={`fas fa-${isPaused ? "play" : "pause"}`} />
                </button>
                <button on:click={resetData}>
                    <i class="fas fa-stop" />
                </button>
            </div>
            <div class="m-l-auto d-flex w-50">
                <div class="w-50 video-player-volumen d-flex m-l-auto">
                    <span class="p-8 w-25 d-flex">
                        <i class={`m-l-auto fas fa-volume-${volumeIcon}`} />
                    </span>
                    <input
                        class="w-75"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        bind:this={volumenBar}
                        on:keydown|stopPropagation
                        on:input={() => {
                            videoElement.volume = Number(volumenBar.value);
                            volumeIcon = getVolumeIcon(volumenBar.value);
                        }}
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
            background-color: #888888aa;
            transform: translateY(50%);
            &:hover {
                transform: translateY(0%);
            }
        }
        &-options {
            display: flex;
            color: white;
            button {
                background-color: transparent;
                width: 2.25rem;
                height: 2.25rem;
                border: 0px;
                color: white;
                font-size: 1.5rem;
            }
        }
    }
</style>
