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
    themeId: 0,
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
        setLocalSetting({ ...s })
        return settings;
    }

    function getLocalSettings(): FileSettingStore {
        try {
            let settings = localStorage.getItem(FileBrowser.localStorageKeys.settings)
            let localSettings: FileSettingStore = JSON.parse(settings)
            if (localSettings.cache.length > 0) {
                localSettings.cache = localSettings.cache.map(dir => secure.recover(dir))
            }
            document.documentElement.setAttribute("data-theme", FileBrowser.themes[localSettings.themeId].value)
            return localSettings
        } catch (e) {
            return defaultState
        }
    }

    function setLocalSetting(s: FileSettingStore) {
        if (s.cache?.length > 0) {
            s.cache = s.cache.map(dir => secure.digest(dir))
        }
        console.log(s.cache);
        
        localStorage.setItem(FileBrowser.localStorageKeys.settings, JSON.stringify(s))
    }

    return {
        subscribe,
        setSortBy: (sortSelected: string) => update((s) => localUpdate(s, "sortBy", sortSelected)),
        setGroupBy: (groupSelected: string) => update((s) => localUpdate(s, "groupBy", groupSelected)),
        setOrderAsc: () => update((s) => localUpdate(s, "orderAsc", !s.orderAsc)),
        setView: () => update((s) => localUpdate(s, "viewList", !s.viewList)),
        setViewOptions: () => update((s) => localUpdate(s, "viewOptions", !s.viewOptions)),
        updateCache: (dir: string) => update((s) => localUpdate(s, "cache", dir)),
        setThemeId: () => update((s) => {
            let val = s.themeId < FileBrowser.themes.length - 1 ? s.themeId + 1 : 0
            document.documentElement.setAttribute("data-theme", FileBrowser.themes[val].value)
            return localUpdate(s, "themeId", val)
        }),
        initCache: (routes: string[]) => update((s) => {
            let cache = new Set([...s.cache, ...routes])
            return ({
                ...s,
                cache: [...cache]
            })
        })
    };
}

export default createfileSettingStore();