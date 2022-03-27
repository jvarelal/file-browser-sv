import { writable } from "svelte/store";
import type { AppViewStore } from "../types/StoreTypes";
import type { AppPages } from "../types/UITypes";

const initialState: AppViewStore = {
    browser: true,
    login: false,
    userControl: false,
    fordward: "browser"
}

function createAppViewStore() {
    const { subscribe, set, update } = writable<AppViewStore>(initialState);
    return {
        subscribe,
        login: (fordward: AppPages = "browser") => update(s => ({
            ...s,
            login: true,
            browser: false,
            userControl: false,
            fordward
        })),
        browser: () => update(s => ({
            ...s,
            login: false,
            browser: true,
            userControl: false
        })),
        config: () => update(s => ({
            ...s,
            login: false,
            browser: false,
            userControl: true
        })),
        reset: () => set(initialState)
    };
}

export default createAppViewStore();