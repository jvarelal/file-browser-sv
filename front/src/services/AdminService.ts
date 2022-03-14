import { secure } from "../helpers/Misc";
import type {
    ApiResponse,
    ErrorApiResponse,
    UserListApiResponse,
} from "../types/ApiTypes"
import type { UserApp } from "../types/UITypes";
import httpClient from "./HttpClient"

const AdminService = {

    list: (): Promise<UserListApiResponse> => {
        return httpClient.getJson(`admin/users/list`)
    },

    add: (
        data: UserApp,
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let userData: UserApp = {
            ...data,
            key: secure.digest(data.key),
            routes: data.routes.map(r => secure.digest(r))
        }
        httpClient.post(`admin/users/add`, { userData })
            .then(cb)
            .catch(err)
    },

    edit: (
        data: UserApp,
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        let userData: UserApp = {
            ...data,
            key: secure.digest(data.key),
            routes: data.routes.map(r => secure.digest(r))
        }
        httpClient.post(`admin/users/edit`, { userData })
            .then(cb)
            .catch(err)
    },

    delete: (
        data: UserApp,
        cb: (data: ApiResponse) => void,
        err: (resp: ErrorApiResponse) => void
    ): void => {
        httpClient.post(`admin/users/delete`, { userData: { user: data.user } })
            .then(cb)
            .catch(err)
    }
}
export default AdminService