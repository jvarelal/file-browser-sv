interface FileApiError {
    name: string;
    message: string;
    route: string;
}


export type UserActionsType = 'r' | 'w' | 'u' | 'd'

export interface ApiResponse {
    status: number;
    message: string;
}

export interface FileApiResponse {
    route?: string;
    isDirectory: boolean;
    name: string;
    size?: number;
    creation?: string;
    modification?: string;
    width?: number;
    height?: number;
    key?: boolean;
}

export interface UserApiResponse extends ApiResponse {
    user: string;
    token: string;
    routes: string[];
    rol: string;
    actions: UserActionsType[];
    bookmarks: FileApiResponse[];
    sessionTime: string;
    creation: string;
}

export interface FileListApiResponse extends ApiResponse {
    files: FileApiResponse[];
    actions: UserActionsType[];
}

export interface UserListApiResponse extends ApiResponse {
    users: UserApiResponse[];
}

export interface FileInformationApiResponse extends ApiResponse {
    data: FileApiResponse;
}

export interface ErrorApiResponse extends ApiResponse {
    errors?: FileApiError[];
    secure?: true;
}