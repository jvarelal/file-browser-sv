import { secure } from "../helpers/Misc"
import type {
    UserApiResponse,
    ErrorApiResponse,
    ApiResponse,
    FileListApiResponse,
    BookmarkApiResponse,
} from "../types/ApiTypes"
import type { ChangePassword, FileUI, Login, VirtualGroup } from "../types/UITypes";
import httpClient from "./HttpClient"

const UserService = {

    login: (
        loginData: Login,
        cb: (resp: UserApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let loginDigest: Login = {
            user: secure.digest(loginData.user),
            key: secure.digest(loginData.key)
        }
        httpClient.post(`user/login`, loginDigest)
            .then((data: UserApiResponse): void => {
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

    updateBookmark: (
        item: FileUI,
        cb: (resp: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let bookmark: BookmarkApiResponse = {
            isDirectory: item.isDirectory,
            virtualGroup: item.virtualGroup,
            route: secure.digest(item.route),
            name: secure.digest(item.name)
        }
        httpClient.post(`user/bookmarks/update`, { bookmark })
            .then(cb)
            .catch(err)
    },

    updateBookmarks: (
        bookmarks: FileUI[],
        cb: (resp: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let transferBookmarks: BookmarkApiResponse[] = bookmarks.map((b) => ({
            isDirectory: b.isDirectory,
            virtualGroup: b.virtualGroup,
            route: secure.digest(b.route),
            name: secure.digest(b.name)
        }))
        httpClient.post(`user/bookmarks`, { bookmarks: transferBookmarks })
            .then(cb)
            .catch(err)
    },

    addBookmarkGroup: (
        bookmarkGroup: VirtualGroup,
        cb: (resp: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        httpClient.post(`user/bookmarks/groups`, { bookmarkGroup })
            .then(cb)
            .catch(err)
    },

    editBookmarkGroup: (
        bookmarkGroup: VirtualGroup,
        cb: (resp: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        httpClient.post(`user/bookmarks/groups/edit`, { bookmarkGroup })
            .then(cb)
            .catch(err)
    },

    deleteBookmarkGroup: (
        bookmarkGroup: VirtualGroup,
        cb: (resp: FileListApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        httpClient.post(`user/bookmarks/groups/delete`, { bookmarkGroup })
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