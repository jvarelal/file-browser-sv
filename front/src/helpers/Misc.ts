import CryptoJS from 'crypto-js';
import FileBrowser from '../constants/FileBrowser';
import type { Select } from '../types/UITypes';

export function limitString(str: string = '', size: number = str.length, complement: string = ''): string {
    if (str.length > size) {
        return str.substring(0, size) + complement
    }
    return str
}

//65 = A 90= z
export function getExcelColumnCode(index: number) {
    if (index > 25) {
        let firstWord = Math.trunc(index / 25)
        let secondWord = index % 25
        return String.fromCharCode(firstWord + 64) + String.fromCharCode(secondWord + 64)
    } else {
        return String.fromCharCode(index + 64)
    }
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

export const selectKeys = (data: any): Select[] => {
    let keys: string[] = Object.getOwnPropertyNames(data)
    return keys.map(key => ({ value: key, label: data[key] }))
}