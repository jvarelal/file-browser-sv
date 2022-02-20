import { writable } from "svelte/store";
import type { ScrollStoreModel } from "../types/StoreTypes";

const initialState: ScrollStoreModel = {
    startHeight: 0,
    endHeight: window.innerHeight,
    previewY: 0,
    updateScroll: false,
    previousHeight: 0
}

function createScrollStore() {
    const { subscribe, set, update } = writable(initialState);
    return {
        subscribe,
        setCurrentHeight: (start: number, end: number) => update((s: ScrollStoreModel): ScrollStoreModel => ({
            ...s,
            startHeight: start,
            endHeight: end
        })),
        setPreviousHeight: (previousHeight: number) => update((s: ScrollStoreModel): ScrollStoreModel => ({
            ...s,
            previousHeight: previousHeight
        })),
        triggerPrevious: () => update((s: ScrollStoreModel): ScrollStoreModel => ({
            ...s,
            updateScroll: true
        })),
        restore: () => update((s: ScrollStoreModel): ScrollStoreModel => ({
            ...s,
            updateScroll: false,
            previousHeight: 0,
            previewY: 0
        })),
        setPreviewHeight: (previewY: number) => update((s: ScrollStoreModel): ScrollStoreModel => ({
            ...s,
            previewY: previewY
        })),
        reset: () => set(initialState)
    };
}

export default createScrollStore();