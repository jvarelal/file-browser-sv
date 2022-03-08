import { secure } from "../helpers/Misc"
import type {
    LoginApiResponse,
    ErrorApiResponse,
    FileApiResponse,
    ApiResponse,
    FileListApiResponse,
} from "../types/ApiTypes"
import type { ChangePassword, FileUI, Login } from "../types/UITypes";
import httpClient from "./HttpClient"

const UserService = {

    login: (
        loginData: Login,
        cb: (resp: LoginApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let loginDigest: Login = {
            user: secure.digest(loginData.user),
            key: secure.digest(loginData.key)
        }
        httpClient.post(`user/login`, loginDigest)
            .then((data: LoginApiResponse): void => {
                if (data.token) {
                    httpClient.setToken(data.token)
                }
                data.routes = data.routes.map(r => secure.recover(r))
                cb(data)
            })
            .catch(err)
    },

    getBookmarks: (
        cb: (resp: FileListApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        httpClient.getJson(`user/bookmarks`, null)
            .then(cb)
            .catch(err)
    },

    updateBookmarks: (
        bookmarks: FileUI[],
        cb: (resp: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let transferBookmarks: FileApiResponse[] = bookmarks.map((b) => ({
            isDirectory: false,
            route: secure.digest(b.route),
            name: secure.digest(b.name)
        }))
        httpClient.post(`user/bookmarks`, { bookmarks: transferBookmarks })
            .then(cb)
            .catch(err)
    },

    changePassword: (
        data: ChangePassword,
        cb: (resp: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ) => {
        let key: string = secure.digest(data.key)
        let prevKey: string = secure.digest(data.prevKey)
        httpClient.post(`user/changekey`, { key, prevKey })
            .then(cb)
            .catch(err)

    },

    changeSession: (
        data: string,
        cb: (resp: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ) => {
        httpClient.post(`user/changesession`, { sessionTime: data })
            .then(cb)
            .catch(err)

    },

}
export default UserService