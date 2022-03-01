import { writable } from "svelte/store";
import type { AppViewStore } from "../types/StoreTypes";

const initialState: AppViewStore = {
    browser: true,
    login: false
}

function createAppViewStore() {
    const { subscribe, set, update } = writable<AppViewStore>(initialState);
    return {
        subscribe,
        setLogin: () => update(s => ({
            ...s,
            login: true,
            browser: false
        })),
        setBrowser: () => update(s => ({
            ...s,
            login: false,
            browser: true
        })),
        reset: () => set(initialState)
    };
}

export default createAppViewStore();