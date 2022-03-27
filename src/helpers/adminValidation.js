import jsonwebtoken from "jsonwebtoken";
import secure from "./secure.js";
import CONFIG from "../constants/config.js";
import { getUserByName } from "../service/userService.js"
import ROLES from "../constants/roles.js";

const adminValidation = (req, res, next) => {
    let { tmp } = req.query
    let token = tmp ? secure.process(decodeURIComponent(tmp)) : (req.headers["authorization"] || "").split(" ")[1];
    if (token) {
        jsonwebtoken.verify(token, CONFIG.tokenKey, (error, authData = {}) => {
            let foundUser = getUserByName(authData.user)
            if (error || !foundUser || foundUser.rol !== ROLES.ADMIN) {
                res.status(403).send({ status: 403, message: "Not an admin" })
            } else {
                req.body.user = foundUser
                next()
            }
        })
    } else {
        res.status(403).send({ status: 403, message: "Not an admin" })
    }
}

export default adminValidation