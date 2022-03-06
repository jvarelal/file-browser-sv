import type { FileApiResponse, UserActionsType } from "./ApiTypes";

export type BooleanFunction = (value: boolean) => void
export type NumberFunction = (value: number) => void
export type FileUIFunction = (fileUI: FileUI) => void

export interface Select {
    value: string;
    label: string;
}

export interface ContextMenuOption {
    icon: string;
    label: string;
    action: VoidFunction;
    hide?: boolean;
    typeOperation: UserActionsType;
}

export interface FileSettingAction extends ContextMenuOption {
    cssClass?: string;
    disabled: boolean;
}

/**
 * 
 */
export interface Login {
    user: string;
    key?: string;
}

export interface UserApp extends Login {
    routes: string[];
    rol: number;
    actions: UserActionsType[];
    sessionTime: string;
}

export interface MediaIcon {
    icon: string;
    src?: string;
    asset?: boolean;
    preview: boolean;
    type: string;
    srcOriginal?: string;
}

export interface FileUI extends FileApiResponse, MediaIcon {
    checked?: boolean;
    newName?: string;
    index?: number;
    idxFocus?: number;
}

export interface FileUIPreview extends FileUI {
    next: VoidFunction;
    prev: VoidFunction;
}

export type FileFieldsDateType = 'creation' | 'modification'

export type FileDatesClasification = "Hoy" | "Esta Semana" | "Este Mes" | "Mes Previo" | "Este año" | "Hace mucho tiempo"

export type FileGroupTypes = 'type' | FileFieldsDateType

export interface FileUIGroup {
    group: string;
    files: FileUI[];
}


export interface FileUpload {
    route: string;
    type: string;
    name?: string;
    files: File[];
}

export interface FileMove {
    route: string;
    move: boolean;
    files: FileUI[];
}

export interface FileEdit {
    route: string;
    name: string;
    text: string;
}

export interface FileExcel {
    sheetName: string;
    data: string[];
    maxNumberOnCol?: number;
}

export interface ChangePassword {
    prevKey: string;
    key: string;
    validateKey: string;
}