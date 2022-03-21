import { writable } from 'svelte/store';
import FileBrowser from '../constants/FileBrowser';
import type { FileBookmarkGroupStore } from '../types/StoreTypes';
import type { FileUI, VirtualGroup } from '../types/UITypes';

const defaultState: FileBookmarkGroupStore = {
    showForm: false,
    formTitle: "",
    formIcon: "",
    groupTarget: null,
    fileTarget: null,
    groupList: getLocalBookmarkGroups()
}


function getLocalBookmarkGroups(): VirtualGroup[] {
    let data = localStorage.getItem(FileBrowser.localStorageKeys.bookmarksGroups)
    if (!data) {
        return []
    }
    let groups: VirtualGroup[] = JSON.parse(data)
    return groups
}

function setLocalBookmarkGroups(groupList: VirtualGroup[]): VirtualGroup[] {
    localStorage.setItem(FileBrowser.localStorageKeys.bookmarksGroups, JSON.stringify(groupList))
    return groupList
}

function createFileBookmarkGroupStore() {
    const { update, subscribe } = writable<FileBookmarkGroupStore>(defaultState)
    return {
        subscribe,
        showForm: () => update((s) => ({
            ...s,
            showForm: true,
            formTitle: "Nuevo grupo",
            formIcon: "fas fa-folder-plus"
        })),
        setFileTarget: (fileTarget: FileUI) => update((s) => ({
            ...s,
            showForm: true,
            formTitle: "Nuevo marcador",
            formIcon: "fas fa-star",
            fileTarget: fileTarget
        })),
        hideForm: () => update((s) => ({
            ...s,
            showForm: false,
            formTitle: "",
            formIcon: "",
            fileTarget: null,
            groupTarget: null
        })),
        setGroupTarget: (groupTarget: VirtualGroup) => update((s) => ({
            ...s,
            showForm: true,
            formTitle: "Editar grupo",
            formIcon: "fas fa-edit",
            groupTarget
        })),
        setGroupList: (groupList: VirtualGroup[]) => update((s) => ({
            ...s,
            groupList: setLocalBookmarkGroups(groupList)
        })),
    }
}

export default createFileBookmarkGroupStore()