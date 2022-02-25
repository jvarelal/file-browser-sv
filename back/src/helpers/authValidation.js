const jwt = require("jsonwebtoken")
const secure = require("./secure");
const config = require("../../config.json")
const filesService = require('../service/filesService')

const authValidation = (req, res, next) => {
    let { tmp } = req.query
    let token = tmp ? secure.process(decodeURIComponent(tmp)) : (req.headers["authorization"] || "").split(" ")[1];
    if (token) {
        jwt.verify(token, config.tokenKey, (error, authData = {}) => {
            let foundUser = config.users.find(u => u.user === authData.user)
            if (error || !foundUser) {
                res.status(401).send({ status: 401, message: "Invalid Session" })
            } else {
                req.body.user = foundUser
                req.appOperator = filesService(foundUser)
                next()
            }
        })
    } else {
        res.status(401).send({ status: 401, message: "Not logged" })
    }
}

module.exports = authValidation