import type { BookmarkApiResponse, FileApiResponse, UserActionsType, VirtualGroupApiResponse } from "./ApiTypes";

export type BooleanFunction = (value: boolean) => void
export type NumberFunction = (value: number) => void
export type FileUIFunction = (fileUI: FileUI) => void
export type UserAppFunction = (userData: UserApp) => void

export interface Select {
    value: string;
    label: string;
}

export interface VirtualGroup extends VirtualGroupApiResponse {
    options?: BasicOption[]
}

export interface BasicOption {
    icon: string;
    label: string;
    action: VoidFunction;
}

export interface ContextMenuOption extends BasicOption {
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
    rol: string;
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
    virtualGroup?: number;
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

export type AppPages = "browser" | "login" | "config"

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

export interface SelectLang {
    label: string;
    options: Select[]
}


export interface FormLang {
    title: string,
    validations?: any,
    labels: any,
    options?: any,
    success?: string,
    successEdit?: string
    selects?: SelectLang[]
}

export interface TxtLang {
    label: {
        view: string;
        itemName: string;
        filtered: string;
        selected: string;
        goBack: string;
        config: string;
        logout: string;
        usersControl: string;
        addElement: string;
        fileDetail: string;
        goTo: string;
    };
    dialogs: {
        deleteGroup: (data?: any) => string;
        uploadFile: (number: number, route: string) => string;
        deleteUser: (data?: any) => string;
        confirmDeleteUser: (data?: any) => string;
        usersListError: (data?: any) => string;
        fileListError: (data?: any) => string;
        deleteFiles: (data?: any) => string;
        fileNotSelected: (data?: any) => string;
        confirmDeletedFiles: (data?: any) => string;
        fileMoveCopy: (files: FileUI[], move: boolean) => string;
    };
    selectOptions: {
        sortBy: SelectLang;
        groupBy: SelectLang;
    };
    contextMenu: {
        parent: {
            addFiles: (data?: any) => string;
            fileOptions: (data?: any) => string;
            checkFiles: (data?: any) => string;
            pasteFile: (data?: any) => string;
            fileInfo: (data?: any) => string;
        };
        items: {
            ubication: (data?: any) => string;
            selection: (data?: any) => string;
            copy: (data?: any) => string;
            move: (data?: any) => string;
            trash: (data?: any) => string;
            download: (data?: any) => string;
            information: (data?: any) => string;
            bookmark: (data?: any) => string;
        };
    };
    forms: {
        file: FormLang;
        bookmark: FormLang;
        path: FormLang;
        password: FormLang;
        user: FormLang;
        settings: FormLang;
        profile: FormLang;
        session: FormLang;
    };
}