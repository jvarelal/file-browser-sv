import { secure } from "../helpers/Misc"
import type {
    FileListApiResponse,
    LoginApiResponse,
    ErrorApiResponse,
    ApiResponse,
    FileInformationApiResponse,
    FileApiResponse
} from "../types/ApiTypes"
import type { FileEdit, FileExcel, FileMove, FileUI, FileUpload, Login } from "../types/UITypes";
import httpClient from "./HttpClient"

const FileService = {

    login: (
        loginData: Login,
        cb: (resp: LoginApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let loginDigest: Login = {
            user: secure.digest(loginData.user),
            key: secure.digest(loginData.key)
        }
        httpClient.post(`login`, loginDigest)
            .then((data: LoginApiResponse): void => {
                if (data.token) {
                    httpClient.setToken(data.token)
                }
                data.routes = data.routes.map(r => secure.recover(r)) 
                cb(data)
            })
            .catch(err)
    },

    list: (route: string): Promise<FileListApiResponse> => {
        if (route) {
            return httpClient.post(`files`, { route: secure.digest(route) })
        }
        return Promise.reject()
    },

    preview: (file: FileApiResponse, reduce: number = 0): string => {
        let parameters: Map<string, string> = new Map();
        parameters.set("name", secure.digest(file.route + "/" + file.name))
        if (reduce > 0) {
            parameters.set("preview", reduce.toString())
        }
        return httpClient.getImageUrl("files/view/image", parameters)
    },

    viewRawFile: (file: FileApiResponse, reduce: number = 0): string => {
        let parameters: Map<string, string> = new Map();
        parameters.set("name", secure.digest(file.route + "/" + file.name))
        return httpClient.getAuthUrl("files/view/raw", parameters)
    },

    getAsTxt: (file: FileApiResponse,
        cb: (data: string) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let parameters: Map<string, string> = new Map();
        parameters.set("name", secure.digest(file.route + "/" + file.name))
        httpClient.getTxt("files/view/text", parameters).then((data: string) => {
            let processData = secure.recover(data)
            cb(processData)
        }).catch(err)
    },

    getExcel: (file: FileApiResponse,
        cb: (data: FileExcel[]) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let parameters: Map<string, string> = new Map();
        parameters.set("name", secure.digest(file.route + "/" + file.name))
        httpClient.getJson("files/view/excel", parameters).then(cb).catch(err)
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
        httpClient.post(`files/information`, request)
            .then(cb)
            .catch(err)
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
        httpClient.postForm(`files/add`, formData)
            .then(cb)
            .catch(err)
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
        httpClient.post(`files/edit`, data)
            .then(cb)
            .catch(err)
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
        httpClient.post(`files/editText`, data)
            .then(cb)
            .catch(err)
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
        httpClient.post(`files/delete`, { files })
            .then(cb)
            .catch(err)
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
        httpClient.post(`files/${data.move ? "move" : "copy"}`, { route, files })
            .then(cb)
            .catch(err)
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
        httpClient.postDownload(`files/download`, { files }, err)
            .then((blob: Blob) => {
                cb()
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = downloadName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err)
    }
}

export default FileService