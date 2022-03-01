interface FileApiError {
    name: string;
    message: string;
    route: string;
}

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

export interface LoginApiResponse extends ApiResponse {
    user: string;
    token: string;
    routes: string[];
    rol: number;
    actions: string[]
    bookmarks: FileApiResponse[]
}

export interface FileListApiResponse extends ApiResponse {
    files: FileApiResponse[];
}

export interface FileInformationApiResponse extends ApiResponse {
    data: FileApiResponse;
}

export interface ErrorApiResponse extends ApiResponse {
    errors?: FileApiError[];
    secure?: true;
}