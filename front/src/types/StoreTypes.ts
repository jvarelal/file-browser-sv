import type { FileApiResponse, UserActionsType } from "./ApiTypes"
import type { FileUI } from "./UITypes"

export type UserProfileStore = {
    name: string;
    key: string;
    routes: string[];
    rol: number;
    sessionTime: string;
    actions: UserActionsType[]
}

export type AppViewStore = {
    login: boolean;
    browser: boolean;
    userControl: boolean
}

export type DialogStore = {
    active: boolean;
    title: string;
    message: string;
    options: boolean;
    onAction: VoidFunction;
    onHide?: VoidFunction;
    loading?: boolean;
    textLoading?: string;
}

export type FileDirectoryStore = {
    current: string;
    backward: string[];
    fordward: string[];
    itemFocus: string;
}

export type FileToolbarStore = {
    isCollapsed: boolean;
    show: boolean;
}

export type FileSettingStore = {
    sortBy: string;
    groupBy: string;
    orderAsc: boolean;
    viewList: boolean;
    viewOptions: boolean;
    theme: string;
    cache: string[];
}

export type FileSettingProps = "sortBy" | "groupBy" | "orderAsc" | "viewList" | "viewOptions" | "theme" | "cache";

export type FileBrowserStore = {
    waiting: boolean,
    files: FileUI[],
    checkAll: boolean,
    filter: string,
    numberItems: number,
    numberItemsChecked: number,
    viewBookmarks: boolean,
    editRoute: boolean,
    bookmarks: FileUI[],
    clipboard: FileUI[],
    move: boolean,
    origin: string,
    error: boolean
}

export type ScrollStoreModel = {
    startHeight: number;
    endHeight: number;
    updateScroll: boolean;
    previousHeight: number;
}

export type FileGridCssStoreType = {
    windowWidth: number;
    itemWidth: number;
    perRow: number;
    gap: number;
    previousSet?: boolean;
}

export interface ContextMenuPosition {
    top: number;
    left: number;
}

export interface FileContextMenuStore extends ContextMenuPosition {
    active: boolean;
    minHeight: number;
    width: number;
    item: FileUI;
    parent: FileApiResponse;
    showItem: boolean;
}

export interface FileDownloadStore {
    isDownloading: boolean;
    files: FileUI[]
}