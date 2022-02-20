import { writable } from "svelte/store";
import type { DialogStore } from "../types/StoreTypes";

const initialState: DialogStore = {
    active: false,
    title: "",
    message: "",
    options: false,
    onAction: () => null,
    onHide: () => null,
    loading: false,
    textLoading: "Procesando...",
}

function dialogStore() {
    const { subscribe, set, update } = writable(initialState);
    return {
        subscribe,
        showDialog: (
            message: string,
            onAction = () => null,
            onHide = () => null
        ) => update((s: DialogStore): DialogStore => ({
            ...s,
            active: true,
            loading: false,
            message: message,
            options: true,
            onAction: onAction,
            onHide: onHide
        })),
        showLoading: (textLoading = initialState.textLoading) => update((s: DialogStore): DialogStore => ({
            ...s,
            active: true,
            loading: true,
            textLoading: textLoading
        })),
        showMessage: (message: string, onHide = () => null) => update((s: DialogStore): DialogStore => ({
            ...s,
            active: true,
            options: false,
            loading: false,
            message: message,
            onHide: onHide
        })),
        closeDialog: () => update(s => initialState),
        reset: () => set(initialState)
    };
}

export default dialogStore()