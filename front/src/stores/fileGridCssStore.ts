import { writable } from "svelte/store";
import type { FileGridCssStoreType } from "../types/StoreTypes";

const initialState: FileGridCssStoreType = {
    windowWidth: 0,
    itemWidth: 0,
    perRow: 0,
    gap: 0,
    previousSet: false
}

function createfileGridGapStore() {
    const { subscribe, set, update } = writable(initialState);
    function calculatePerRow(itemWidth: number): FileGridCssStoreType {
        let scrollAprox: number = 9;
        let width: number = window.innerWidth - scrollAprox;
        let perRow: number = Math.trunc(width / Math.round(itemWidth));
        let gap: number = width % itemWidth;
        gap = Math.trunc((gap / perRow));
        return { itemWidth, windowWidth: width, perRow, gap };
    }
    return {
        subscribe,
        setGridInfo: (itemWidth: number) => update((): FileGridCssStoreType => ({
            ...calculatePerRow(itemWidth),
            previousSet: true
        })),
        updateGridInfo: () => update((s: FileGridCssStoreType): FileGridCssStoreType => {
            if (s.previousSet) {
                return ({ ...calculatePerRow(s.itemWidth), previousSet: true })
            }
            return s
        }),
        reset: () => set(initialState)
    };
}

export default createfileGridGapStore();