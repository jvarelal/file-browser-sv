type Token = {
    Authorization: string;
}

let token: Token = JSON.parse(sessionStorage.browerToken || "{}")
async function validateResponse(response: Response, dataType:string = "json"): Promise<any> {
    if (response.status === 200) {
        return response[dataType]();
    } else {
        let error = await response.json();
        throw error;
    }
}
const httpClient = {
    getTxt: async (url: string = ''): Promise<any> => {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: token,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
        return validateResponse(response, "text")
    },
    setToken: (t: string): void => {
        if (t) {
            token = { "Authorization": "Bearer " + t }
            sessionStorage.browerToken = JSON.stringify(token)
        }
    },
    post: async (url: string = '', data: any = {}): Promise<any> => {
        const response = await fetch(url, {
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
        return validateResponse(response)
    },
    postForm: async (url: string = '', data: FormData): Promise<any> => {
        const response = await fetch(url, {
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
    postDownload: async (url: string = '', data: any, error = (data: any) => null): Promise<Blob> => {
        const response = await fetch(url, {
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
        return validateResponse(response, "blob")
    },
}

export default httpClient