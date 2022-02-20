import { writable } from "svelte/store";
import type { FileApiResponse } from "../types/ApiTypes";
import type { ContextMenuPosition, FileContextMenuStore } from "../types/StoreTypes";
import type { FileUI } from "../types/UITypes";

const initialState: FileContextMenuStore = {
    active: false,
    minHeight: 100,
    width: 220,
    top: 0,
    left: 0,
    item: null,
    parent: null,
    showItem: false,
}

function fileContextStore() {
    const { subscribe, set, update } = writable(initialState);
    function calculateDisplay(x: number, y: number, type: string): ContextMenuPosition {
        let { innerWidth, innerHeight } = window;
        let aproxHeight = initialState.minHeight
        if (type === "item") {
            aproxHeight *= 1.5
        }
        let left = x + initialState.width >= innerWidth ? x - initialState.width : x;
        let top = y + aproxHeight >= innerHeight ? y - aproxHeight : y;
        return { left, top };
    }
    return {
        subscribe,
        showContextItem: (item: FileUI, x: number, y: number) => update((s: FileContextMenuStore): FileContextMenuStore => {
            return ({
                ...s,
                active: true,
                item: item,
                showItem: true,
                ...calculateDisplay(x, y, "item")
            })
        }),
        showContextParent: (parent: FileApiResponse, x: number, y: number) => update((s: FileContextMenuStore): FileContextMenuStore => {
            return ({
                ...s,
                active: true,
                parent: parent,
                showItem: false,
                ...calculateDisplay(x, y, "parent")
            })
        }),
        closeContext: () => update((s: FileContextMenuStore): FileContextMenuStore => ({ ...s, active: false })),
        reset: () => set(initialState)
    };
}

export default fileContextStore()