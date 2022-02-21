import { writable } from "svelte/store";
import type { FileUIPreview } from "../types/UITypes";

const initialState: Map<string, FileUIPreview> = new Map();

function filePreviewStore() {
    const { subscribe, set, update } = writable<Map<string, FileUIPreview>>(initialState);
    return {
        subscribe,
        setPreview: (key: string, preview: FileUIPreview) => update(map => {
            map.set(key, preview)
            return map
        }),
        removePreview: (key: string) => update(map => {
            map.delete(key)
            return map
        }),
        reset: () => set(initialState)
    };
}

export default filePreviewStore()