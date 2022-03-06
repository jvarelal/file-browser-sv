import type { Select } from "../types/UITypes";

const IMG_PREVIEW: string[] = ["jpg", "png", "jpeg", "svg", "gif", "webp"]
const FILE_AS_TEXT: string[] = ["css", "md", "svelte", "ts", "json", "js", "txt", "yml"]
const EXCEL: string[] = ["csv", "ods", "pods", "xls", "xlsm", "xlsx"]
const AUDIO: string[] = ["mp3", "flac", "wav"]
const VIDEO: string[] = ["mp4", "webm"]
const EDITABLES: string[] = [...FILE_AS_TEXT, "html", "xml"]

interface FileBrowserSettings {
    baseUrl: string;
    secureKey: string;
    sessionTime: string[];
    localStorageKeys: {
        settings: string,
        bookmarks: string,
    },
    regexp: {
        folderName: RegExp;
    },
    themes: Select[];
    sortOptions: Select[];
    groupOptions: Select[];
    previews: {
        scalePreview: string[];
        image: string[];
        icons: {
            png: string[];
            svg: string[];
        },
        asText: string[],
        excel: string[],
        audio: string[],
        video: string[]
    };
    visor: string[],
    editables: string[]
}

const FileBrowser: FileBrowserSettings = {
    baseUrl: process.env.NODE_ENV === "build" ? `${window.location.origin}/api` : "http://localhost:4000/api",
    secureKey: "fB*",
    sessionTime: ["15m", "30m", "45m", "1h", "2h", "4h", "1d"],
    regexp: {
        folderName: /^["/?*:|<>\\]/
    },
    localStorageKeys: {
        settings: "fe-settings",
        bookmarks: "fe-bookmarks"
    },
    themes: [
        { value: "", label: "White" },
        { value: "night-light", label: "Wheat" },
        { value: "dark", label: "Dark" },
    ],
    sortOptions: [
        { value: "name", label: "Nombre" },
        { value: "size", label: "Tamaño" },
        { value: "modification", label: "Modificación" },
        { value: "creation", label: "Creación" },
    ],
    groupOptions: [
        { value: "", label: "---" },
        { value: "type", label: "Tipo de archivo" },
        { value: "creation", label: "Fecha Creación" },
        { value: "modification", label: "Fecha Modificación" },
    ],
    previews: {
        scalePreview: ["jpg", "png", "jpeg"],
        image: IMG_PREVIEW,
        icons: {
            png: ["dat", "jar"],
            svg: ["css", "csv", "exe", "html", "mp3", "mp4", "txt", "doc", "docx", "js", "pdf", "xlsx", "zip", "xml", "webm", "json"]
        },
        asText: FILE_AS_TEXT,
        excel: EXCEL,
        audio: AUDIO,
        video: VIDEO
    },
    visor: [...IMG_PREVIEW, ...EDITABLES, ...EXCEL, ...AUDIO, "pdf", "mp4", "webm"],
    editables: EDITABLES
}

export default FileBrowser;