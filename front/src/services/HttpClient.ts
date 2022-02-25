import FileBrowser from "../constants/FileBrowser";
import { secure } from "../helpers/Misc";
import type { ErrorApiResponse } from "../types/ApiTypes";

type Token = {
    Authorization: string;
}

let token: Token = { "Authorization": "Bearer " + sessionStorage.browserToken }

async function validateResponse(response: Response, dataType: string = "json"): Promise<any> {
    if (response.status === 200) {
        return response[dataType]();
    } else {
        let error: ErrorApiResponse = await response.json();
        throw processErrorApiResponse(error);
    }
}

function processErrorApiResponse(err: ErrorApiResponse): ErrorApiResponse {
    if (err.secure) {
        err.message = secure.recover(err.message)
        if (err.errors) {
            err.errors = err.errors.map((e) => ({
                route: secure.recover(e.route),
                name: secure.recover(e.name),
                message: secure.recover(e.message)
            }))
        }
    }
    return err
}

function generateUrl(base: string, params: Map<string, string>, key: boolean) {
    let url = new URL(base)
    params.forEach((val, key) => url.searchParams.append(key, encodeURIComponent(val)))
    if (key) {
        url.searchParams.append("tmp", encodeURIComponent(secure.digest(sessionStorage.browserToken)))
    }
    return url.toString()
}

async function getData(path: string, params: Map<string, string>, typeResponse:string): Promise<any> {
    let url = generateUrl(`${FileBrowser.baseUrl}/${path}`, params, false)
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: token,
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })
    return validateResponse(response, typeResponse)
}

async function postData(path: string = '', data: any = {},  typeResponse:string): Promise<any> {
    const response = await fetch(`${FileBrowser.baseUrl}/${path}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            ...token
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    })
    return validateResponse(response, typeResponse)
}

const httpClient = {

    setToken: (t: string): void => {
        if (t) {
            token = { "Authorization": "Bearer " + t }
            sessionStorage.browserToken = t
        }
    },

    getImageUrl: (path: string, params: Map<string, string>) => generateUrl(`${FileBrowser.baseUrl}/${path}`, params, false),

    getAuthUrl: (path: string, params: Map<string, string>) => generateUrl(`${FileBrowser.baseUrl}/${path}`, params, true),

    getTxt: async (path: string, params: Map<string, string>): Promise<any> => getData(path, params, "text"),

    getJson: async (path: string, params: Map<string, string>): Promise<any> => getData(path, params, "json"),

    post: async (path: string = '', data: any = {}): Promise<any> => postData(path, data, "json"),

    postDownload: async (path: string = '', data: any, error = (data: any) => null): Promise<Blob> => postData(path, data, "blob"),

    postForm: async (path: string = '', data: FormData): Promise<any> => {
        const response = await fetch(`${FileBrowser.baseUrl}/${path}`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: token,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: data
        })
        return validateResponse(response)
    },

}

export default httpClient