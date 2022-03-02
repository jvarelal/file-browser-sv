import jsonwebtoken from "jsonwebtoken";
import secure from "./secure.js";
import CONFIG from "../constants/config.js";
import filesService from '../service/filesService.js';
import { getUserByName } from "../service/userService.js"

const authValidation = (req, res, next) => {
    let { tmp } = req.query
    let token = tmp ? secure.process(decodeURIComponent(tmp)) : (req.headers["authorization"] || "").split(" ")[1];
    if (token) {
        jsonwebtoken.verify(token, CONFIG.tokenKey, (error, authData = {}) => {
            let foundUser = getUserByName(authData.user)
            if (error || !foundUser) {
                res.status(401).send({ status: 401, message: "Invalid Session" })
            } else {
                req.body.user = foundUser
                req.appOperator = filesService({
                    ...foundUser,
                    initialFolder: foundUser.initialFolder.map(f => secure.process(f))
                })
                next()
            }
        })
    } else {
        res.status(401).send({ status: 401, message: "Not logged" })
    }
}

export default authValidation