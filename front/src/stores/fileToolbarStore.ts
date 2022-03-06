import { writable } from 'svelte/store';
import type { FileToolbarStore } from '../types/StoreTypes';

const defaultState: FileToolbarStore = {
    isCollapsed: true,
    show: true
}

function createFileToolbarStore() {
    const { update, subscribe } = writable<FileToolbarStore>(defaultState)
    return {
        subscribe,
        setCollapse: (isCollapsed: boolean) => update((s): FileToolbarStore => ({ ...s, isCollapsed: isCollapsed })),
        setShow: (show: boolean) => update((s): FileToolbarStore => ({ ...s, isCollapsed: true, show: show })),
    }
}

export default createFileToolbarStore()