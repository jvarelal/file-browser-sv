import { writable } from "svelte/store";
import type { AppViewStore } from "../types/StoreTypes";

const initialState: AppViewStore = {
    browser: true,
    login: false,
    userControl: false
}

function createAppViewStore() {
    const { subscribe, set, update } = writable<AppViewStore>(initialState);
    return {
        subscribe,
        setLogin: () => update(s => ({
            ...s,
            login: true,
            browser: false,
            userControl: false
        })),
        setBrowser: () => update(s => ({
            ...s,
            login: false,
            browser: true,
            userControl: false
        })),
        setUserControl: () => update(s => ({
            ...s,
            login: false,
            browser: false,
            userControl: true
        })),
        reset: () => set(initialState)
    };
}

export default createAppViewStore();