import CryptoJS from "crypto-js"
import CONFIG from "../constants/config.js"

const secure = {
    digest: (clearText) => CryptoJS.AES.encrypt(clearText, CONFIG.key).toString(),
    process: (text) => CryptoJS.AES.decrypt(text, CONFIG.key).toString(CryptoJS.enc.Utf8)
}


export default secure