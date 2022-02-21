import { writable } from "svelte/store";
import FileBrowser from "../constants/FileBrowser";
import { getFileIcon, isBookmark } from "../helpers/Media";
import { secure } from "../helpers/Misc";
import type { FileApiResponse } from "../types/ApiTypes";
import type { FileBrowserStore } from "../types/StoreTypes";
import type { FileUI } from "../types/UITypes";

const initialState = {
    waiting: true,
    files: [],
    checkAll: false,
    filter: "",
    numberItems: 0,
    numberItemsChecked: 0,
    viewBookmarks: false,
    editRoute: false,
    bookmarks: getLocalBookmarks(),
    clipboard: [],
    move: false,
    origin: "",
    error: false
}

function getLocalBookmarks(): FileUI[] {
    try {
        let data = localStorage.getItem(FileBrowser.localStorageKeys.bookmarks)
        let localBookmarks: FileApiResponse[] = JSON.parse(data)
        return localBookmarks.map((b): FileUI => {
            let data: FileApiResponse = ({
                route: secure.process(b.route),
                name: secure.process(b.name),
                isDirectory: false,
            })
            return { ...data, ...getFileIcon(data) }
        })
    } catch (e) {
        return []
    }
}

function setLocalBookmarks(bookmarks: FileUI[] = []): FileUI[] {
    let localBookmarks: FileApiResponse[] = bookmarks.map((b) => ({
        isDirectory: false,
        route: secure.digest(b.route),
        name: secure.digest(b.name)
    }))
    localStorage.setItem(FileBrowser.localStorageKeys.bookmarks, JSON.stringify(localBookmarks))
    return bookmarks
}

function createfileBrowserStore() {
    const { subscribe, set, update } = writable<FileBrowserStore>(initialState);

    return {
        subscribe,
        setWaiting: (waiting: boolean) => update((s) => ({
            ...s,
            waiting: waiting,
            editRoute: false,
            filter: "",
            checkAll: false,
            error: false,
            viewBookmarks: false,
        })),
        setViewBookmarks: () => update((s) => ({
            ...s,
            viewBookmarks: !s.viewBookmarks,
            numberItems: s[!s.viewBookmarks ? "bookmarks" : "files"].length,
            numberItemsChecked: s[!s.viewBookmarks ? "bookmarks" : "files"].filter((f: FileUI) => f.checked).length
        })),
        setFiles: (files: FileApiResponse[], origin: string) => update((s) => ({
            ...s,
            numberItems: files.length,
            numberItemsChecked: 0,
            files: files.map(f => {
                let nf = { ...f, route: origin, checked: false }
                return { ...nf, ...getFileIcon(nf) }
            }),
            origin: origin
        })),
        setFilter: (filter: string) => update((s) => ({ ...s, filter: filter })),
        setCheck: (file: FileUI) => update((s) => {
            let checkAll = s.checkAll
            let selectedItems = 0
            let updatedFiles = s[s.viewBookmarks ? "bookmarks" : "files"].map(f => {
                if (file.route === f.route && f.name === file.name) {
                    f.checked = !f.checked
                }
                if (!f.checked && checkAll) {
                    checkAll = false;
                }
                if (f.checked) {
                    selectedItems++
                }
                return f;
            })
            return ({
                ...s,
                files: s.viewBookmarks ? s.files : updatedFiles,
                bookmarks: s.viewBookmarks ? updatedFiles : s.bookmarks,
                checkAll: checkAll,
                numberItemsChecked: selectedItems,
            })
        }),
        setCheckAll: (status: boolean) => update((s) => {
            let updatedFiles = s[s.viewBookmarks ? "bookmarks" : "files"].map(f => {
                f.checked = status
                return f;
            })
            return {
                ...s,
                files: s.viewBookmarks ? s.files : updatedFiles,
                bookmarks: s.viewBookmarks ? updatedFiles : s.bookmarks,
                numberItemsChecked: status ? s.files.length : 0,
                checkAll: status,
            }
        }),
        updateBookmarks: (item: FileUI) => update((s) => {
            let updatedBookmarks = isBookmark(s.bookmarks, item) ?
                s.bookmarks.filter(b => b.route + b.name !== item.route + item.name) :
                [...s.bookmarks, item]
            return ({
                ...s,
                bookmarks: setLocalBookmarks(updatedBookmarks)
            })
        }),
        setEditRoute: (editRoute: boolean) => update((s) => ({ ...s, editRoute: editRoute })),
        setFileNameUpdate: (item: FileUI) => update((s) => {
            let nFiles = [...s.files];
            let nBookmarks = [...s.bookmarks]
            let idx = nFiles.findIndex((f) => f.name === item.name);
            let isInBookmarks = false
            let mediaInfo = getFileIcon({ ...nFiles[idx], name: item.newName })
            nFiles[idx] = {
                ...nFiles[idx],
                name: item.newName,
                ...mediaInfo
            }
            if (item.isDirectory) {
                let previousRoute = item.route + '/' + item.name
                for (let i = 0; i < nBookmarks.length; i++) {
                    if ((nBookmarks[i].route).startsWith(previousRoute)) {
                        let newRoutePart = (previousRoute).split('/')
                        let bookmarkRoutePart = nBookmarks[i].route.split('/')
                        let itemTreePosition = newRoutePart.length - 1
                        bookmarkRoutePart[itemTreePosition] = item.newName
                        nBookmarks[i].route = bookmarkRoutePart.join('/')
                        nBookmarks[i] = {
                            ...nBookmarks[i], ...getFileIcon(nBookmarks[i])
                        }
                        isInBookmarks = true
                    }
                }
            } else {
                let bookmarkIdx = nBookmarks.findIndex(b => item.route + item.name === b.route + b.name)
                if (bookmarkIdx >= 0) {
                    nBookmarks[bookmarkIdx] = nFiles[idx]
                    isInBookmarks = true
                }
            }
            return {
                ...s,
                files: nFiles,
                bookmarks: isInBookmarks ? setLocalBookmarks(nBookmarks) : s.bookmarks
            }
        }),
        setDelete: (files: FileUI[]) => update((s) => {
            let numberChecked = 0
            let nFiles = s.files.filter(f => {
                if (files.find(file => f.name === file.name)) {
                    return false;
                }
                if (f.checked) {
                    numberChecked++
                }
                return true
            });
            let nBookmarks = s.bookmarks.filter(b => files.find(f => b.route + b.name === f.route + f.name) === undefined)
            return ({
                ...s,
                files: nFiles,
                numberItems: nFiles.length,
                bookmarks: nBookmarks.length === s.bookmarks.length ? s.bookmarks : setLocalBookmarks(nBookmarks),
                numberItemsChecked: numberChecked
            })
        }),
        setCopy: (files: FileUI[]) => update((s) => ({
            ...s,
            clipboard: files.map(f => ({ ...f, checked: false })),
            move: false
        })),
        setMove: (files: FileUI[]) => update((s) => ({
            ...s,
            clipboard: files.map(f => ({ ...f, checked: false })),
            move: true
        })),
        setPaste: (files: FileUI[]) => update((s) => {
            let nBookmarks = [...s.bookmarks]
            let isInBookmarks = false
            for (let i = 0; i < nBookmarks.length; i++) {
                let match = files.find(f => f.route + f.name === nBookmarks[i].route + nBookmarks[i].name)
                if (match) {
                    nBookmarks[i] = { ...match, route: s.origin }
                    nBookmarks[i] = { ...nBookmarks[i], ...getFileIcon(nBookmarks[i]) }
                    isInBookmarks = true
                }
            }
            let updatedFiles = [
                ...s.files,
                ...files.map(f => {
                    let nFile = ({ ...f, route: s.origin })
                    return { ...nFile, ...getFileIcon(nFile) }
                })
            ]
            return ({
                ...s,
                clipboard: s.move ? [] : s.clipboard,
                move: false,
                bookmarks: isInBookmarks ? setLocalBookmarks(nBookmarks) : s.bookmarks,
                numberItems: updatedFiles.length,
                files: updatedFiles
            })
        }),
        setError: (e = true) => update((s) => ({
            ...s,
            error: e
        })),
        reset: () => set(initialState)
    };
}

export default createfileBrowserStore();