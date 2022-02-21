import { writable } from "svelte/store";
import type { FileDirectoryStore } from "../types/StoreTypes";

const initialState: FileDirectoryStore = {
    current: "",
    backward: [],
    fordward: [],
    itemFocus: null,
}

function directoryStore() {
    const { subscribe, set, update } = writable<FileDirectoryStore>(initialState);
    return {
        subscribe,
        setInit: (directory: string) => update((s) => {
            return ({
                ...s,
                current: directory
            })
        }),
        setDirectory: (directory: string = "", itemFocus: string = null) => update((s) => {
            let elements = s.current.split("/")
            let isBack = directory === s.backward[s.backward.length - 1]
            return ({
                ...s,
                backward: !s.current || directory === s.current ? s.backward : [...s.backward, s.current],
                fordward: [],
                current: directory,
                itemFocus: itemFocus ? itemFocus : (isBack ? elements[elements.length - 1] : null),
            })
        }),
        backward: () => update((s) => {
            if (s.backward.length > 0) {
                let newCurrent = s.backward.pop()
                let elements = s.current.split("/")
                return ({
                    ...s,
                    backward: [...s.backward],
                    fordward: [...s.fordward, s.current],
                    current: newCurrent,
                    itemFocus: elements[elements.length - 1],
                })
            }
            return s
        }),
        fordward: () => update((s) => {
            if (s.fordward.length > 0) {
                let newCurrent = s.fordward.pop()
                return ({
                    ...s,
                    backward: [...s.backward, s.current],
                    fordward: [...s.fordward],
                    current: newCurrent,
                    itemFocus: null,
                })
            }
            return s
        }),
        reset: () => set(initialState)
    };
}

export default directoryStore()