import CryptoJS from 'crypto-js';
import FileBrowser from '../constants/FileBrowser';

export function limitString(str: string = '', size: number = str.length, complement: string = ''): string {
    if (str.length > size) {
        return str.substring(0, size) + complement
    }
    return str
}

export const secure = {
    digest: (clearText: string): string => {
        try {
            return CryptoJS.AES.encrypt(clearText, FileBrowser.secureKey).toString()
        } catch (e) {
            console.log(e)
            return ""
        }
    },
    recover: (text: string): string => {
        try {
            return CryptoJS.AES.decrypt(text, FileBrowser.secureKey).toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.log(e);
            return "";
        }
    }
}
