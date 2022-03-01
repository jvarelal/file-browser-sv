import { secure } from "../helpers/Misc"
import type {
    LoginApiResponse,
    ErrorApiResponse,
    FileApiResponse,
    ApiResponse,
} from "../types/ApiTypes"
import type { FileUI, Login } from "../types/UITypes";
import httpClient from "./HttpClient"

const UserService = {

    login: (
        loginData: Login,
        cb: (resp: LoginApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        console.log("ëntro")
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

}
export default UserService