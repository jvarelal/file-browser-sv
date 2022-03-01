import type { FileBrowserSettings } from "../types/UITypes";

const IMG_PREVIEW: string[] = ["jpg", "png", "jpeg", "svg", "gif", "webp"]
const FILE_AS_TEXT: string[] = ["css", "md", "svelte", "ts", "json", "js", "txt", "yml"]
const EXCEL: string[] = ["csv", "ods", "pods", "xls", "xlsm", "xlsx"]
const AUDIO: string[] = ["mp3", "flac", "wav"]
const VIDEO: string[] = ["mp4", "webm"]
const EDITABLES: string[] = [...FILE_AS_TEXT, "html", "xml"]

const FileBrowser: FileBrowserSettings = {
    baseUrl: process.env.NODE_ENV === "build" ? `${window.location.origin}/api` : "http://localhost:4000/api",
    secureKey: "fB*",
    regexp: {
        folderName: /^["/?*:|<>\\]/
    },
    localStorageKeys: {
        settings: "fe-settings",
        bookmarks: "fe-bookmarks"
    },
    themes: [
        { value: "", label: "fas fa-adjust" },
        { value: "night-light", label: "far fa-moon" },
        { value: "dark", label: "far fa-sun" },
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