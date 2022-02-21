import FileBrowser from "../constants/FileBrowser"
import { secure } from "../helpers/Misc"
import type {
    FileListApiResponse,
    LoginApiResponse,
    ErrorApiResponse,
    ApiResponse,
    FileInformationApiResponse,
    FileApiResponse
} from "../types/ApiTypes"
import type { FileEdit, FileMove, FileUI, FileUpload, Login } from "../types/UITypes";
import httpClient from "./HttpClient"

const FileService = {

    login: (
        data: Login,
        cb: (resp: LoginApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        httpClient.post(`${FileBrowser.baseUrl}/login`, data)
            .then((data: LoginApiResponse): void => {
                if (data.token) {
                    httpClient.setToken(data.token)
                }
                cb(data)
            })
            .catch(err)
    },

    list: (route: string): Promise<FileListApiResponse> => {
        if (route) {
            return httpClient.post(`${FileBrowser.baseUrl}/files`, { route: secure.digest(route) })
        }
        return Promise.reject()
    },

    preview: (file: FileApiResponse, reduce: number = 0): string => {
        let digestDataToUri = encodeURIComponent(secure.digest(file.route + "/" + file.name))
        let setSizePreview = reduce > 0 ? `&preview=${reduce}` : ""
        return `${FileBrowser.baseUrl}/files?name=${digestDataToUri + setSizePreview}`
    },

    previewAsTxt: (file: FileApiResponse): string => {
        let digestDataToUri = encodeURIComponent(secure.digest(file.route + "/" + file.name))
        return `${FileBrowser.baseUrl}/files?name=${digestDataToUri}&txt=true`
    },

    getAsTxt: (file: FileApiResponse,
        cb: (data: string) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let digestDataToUri = encodeURIComponent(secure.digest(file.route + "/" + file.name))
        httpClient.getTxt(`${FileBrowser.baseUrl}/files?name=${digestDataToUri}&txt=true`).then((data: string) => {
            let processData = secure.process(data)
            cb(processData)
        }).catch(err)
    },

    information: (
        file: FileUI,
        cb: (data: FileInformationApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let request = {
            route: secure.digest(file.route),
            name: secure.digest(file.name)
        }
        httpClient.post(`${FileBrowser.baseUrl}/files/information`, request).then(cb).catch(err)
    },

    create: (
        data: FileUpload,
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        const formData = new FormData();
        formData.set("route", secure.digest(data.route));
        formData.set("type", data.type);
        formData.set("name", secure.digest(data.name?.trim() || ""));
        data.files?.forEach((f) => formData.append("file", f));
        httpClient.postForm(`${FileBrowser.baseUrl}/files/add`, formData).then(cb).catch(err)
    },

    edit: (
        file: FileUI,
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let data = {
            name: secure.digest(file.name),
            route: secure.digest(file.route),
            newName: secure.digest(file.newName)
        }
        httpClient.post(`${FileBrowser.baseUrl}/files/edit`, data)
            .then(cb)
            .catch((data: ErrorApiResponse): void => {
                if (data.message) {
                    data.message = secure.process(data.message)
                }
                err(data)
            })
    },

    setPlainFile: (
        file: FileEdit,
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let data = {
            name: secure.digest(file.name),
            route: secure.digest(file.route),
            text: secure.digest(file.text)
        }
        httpClient.post(`${FileBrowser.baseUrl}/files/editText`, data)
            .then(cb)
            .catch((data: ErrorApiResponse): void => {
                if (data.message) {
                    data.message = secure.process(data.message)
                }
                err(data)
            })
    },

    delete: (
        data: FileUI[],
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let files = data.map(f => ({
            name: secure.digest(f.name),
            route: secure.digest(f.route)
        }))
        httpClient.post(`${FileBrowser.baseUrl}/files/delete`, { files })
            .then(cb)
            .catch((data: ErrorApiResponse): void => {
                if (data.errors) {
                    data.errors = data.errors.map(e => ({
                        message: secure.process(e.message),
                        route: secure.process(e.route),
                        name: secure.process(e.name)
                    }))
                }
                err(data)
            })
    },

    paste: (
        data: FileMove,
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let route = secure.digest(data.route)
        let files = data.files.map(f => ({
            name: secure.digest(f.name),
            route: secure.digest(f.route)
        }))
        httpClient.post(`${FileBrowser.baseUrl}/files/${data.move ? "move" : "copy"}`, { route, files })
            .then(cb)
            .catch((data: ErrorApiResponse): void => {
                if (data.errors) {
                    data.errors = data.errors.map(e => ({
                        message: secure.process(e.message),
                        route: secure.process(e.route),
                        name: secure.process(e.name)
                    }))
                }
                err(data)
            })
    },

    download: (data: FileUI[],
        cb: () => void,
        err: (resp: ErrorApiResponse) => void) => {
        let routes = []
        let files = data.map(f => {
            if (!routes.includes(f.route)) {
                routes.push(f.route)
            }
            return ({
                name: secure.digest(f.name),
                route: secure.digest(f.route),
                isDirectory: f.isDirectory
            })
        })
        let downloadName: string;
        if (data.length === 1) {
            downloadName = data[0].name
        } else {
            let separateRoot = data[0].route.split("/");
            downloadName = `${routes.length === 1 ? separateRoot[separateRoot.length - 1] : "Bookmarks"}.zip`
        }
        httpClient.postDownload(`${FileBrowser.baseUrl}/files/download`, { files }, err).then((blob: Blob) => {
            cb()
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = downloadName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err)
    }
}

export default FileService