const CryptoJS = require("crypto-js")
const config = require("../../config.json")

const secure = {
    digest: (clearText) => CryptoJS.AES.encrypt(clearText, config.key).toString(),
    process: (text) => CryptoJS.AES.decrypt(text, config.key).toString(CryptoJS.enc.Utf8)
}

module.exports = secure