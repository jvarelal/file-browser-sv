import { writable } from "svelte/store";
import FileBrowser from "../constants/FileBrowser";
import { secure } from "../helpers/Misc";
import type { FileSettingProps, FileSettingStore } from "../types/StoreTypes";

const defaultState: FileSettingStore = {
    sortBy: FileBrowser.sortOptions[0].value,
    groupBy: FileBrowser.groupOptions[0].value,
    orderAsc: true,
    viewList: false,
    viewOptions: false,
    theme: FileBrowser.themes[0].value,
    transitions: true,
    cache: []
}

function createfileSettingStore() {
    const { subscribe, update } = writable<FileSettingStore>(getLocalSettings());

    function localUpdate(s: FileSettingStore, prop: FileSettingProps, value: any): FileSettingStore {
        let settings: FileSettingStore = s;
        if (prop === "cache") {
            if (value && !s.cache?.includes(value)) {
                settings = { ...s, cache: [...s.cache, value] };
            }
        } else {
            settings = { ...s, [prop]: value };
        }
        setLocalSetting({ ...settings })
        return settings;
    }

    function getLocalSettings(): FileSettingStore {
        try {
            let settings = localStorage.getItem(FileBrowser.localStorageKeys.settings)
            let localSettings: FileSettingStore = JSON.parse(settings)
            if (localSettings.cache.length > 0) {
                localSettings.cache = localSettings.cache.map(dir => secure.recover(dir))
            }
            document.documentElement.setAttribute("data-theme", localSettings.theme)
            return localSettings
        } catch (e) {
            return defaultState
        }
    }

    function setLocalSetting(s: FileSettingStore) {
        if (s.cache?.length > 0) {
            s.cache = s.cache.map(dir => secure.digest(dir))
        }
        localStorage.setItem(FileBrowser.localStorageKeys.settings, JSON.stringify(s))
    }

    return {
        subscribe,
        setSortBy: (sortSelected: string) => update((s) => localUpdate(s, "sortBy", sortSelected)),
        setGroupBy: (groupSelected: string) => update((s) => localUpdate(s, "groupBy", groupSelected)),
        setOrderAsc: () => update((s) => localUpdate(s, "orderAsc", !s.orderAsc)),
        setView: () => update((s) => localUpdate(s, "viewList", !s.viewList)),
        setViewOptions: () => update((s) => localUpdate(s, "viewOptions", !s.viewOptions)),
        setTransitions: () => update((s) => localUpdate(s, "transitions", !s.transitions)),
        updateCache: (dir: string) => update((s) => localUpdate(s, "cache", dir)),
        setTheme: (theme:string) => update((s) => {
            document.documentElement.setAttribute("data-theme", theme)
            return localUpdate(s, "theme", theme)
        }),
        initCache: (routes: string[]) => update((s) => {
            let cache = new Set([...s.cache, ...routes])
            console.log(cache)
            return ({
                ...s,
                cache: Array.from(cache)
            })
        })
    };
}

export default createfileSettingStore();