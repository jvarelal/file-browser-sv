import { writable } from "svelte/store";
import type { FileDownloadStore } from "../types/StoreTypes";
import type { FileUI } from "../types/UITypes";

const initialState: FileDownloadStore = {
    isDownloading: false,
    files: []
}

function fileDownloadStore() {
    const { subscribe, set, update } = writable<FileDownloadStore>(initialState);
    return {
        subscribe,
        setDownload: (files: FileUI[]) => update((s) => {
            return ({
                ...s,
                files: files.sort((a, b) => a.isDirectory ? -1 : 1),
                isDownloading: true
            })
        }),
        finishDownload: () => update((s) => {
            return ({
                ...s,
                files: [],
                isDownloading: false
            })
        }),
        reset: () => set(initialState)
    };
}

export default fileDownloadStore()