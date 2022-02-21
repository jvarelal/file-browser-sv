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
    const { subscribe, set, update } = writable<ScrollStoreModel>(initialState);
    return {
        subscribe,
        setCurrentHeight: (start: number, end: number) => update(s => ({
            ...s,
            startHeight: start,
            endHeight: end
        })),
        setPreviousHeight: (previousHeight: number) => update(s => ({
            ...s,
            previousHeight: previousHeight
        })),
        triggerPrevious: () => update(s => ({
            ...s,
            updateScroll: true
        })),
        restore: () => update(s => ({
            ...s,
            updateScroll: false,
            previousHeight: 0,
            previewY: 0
        })),
        setPreviewHeight: (previewY: number) => update(s => ({
            ...s,
            previewY: previewY
        })),
        reset: () => set(initialState)
    };
}

export default createScrollStore();