import fs from 'fs';
import ROLES from "../constants/roles.js"
import secure from "./secure.js"

const sessionDurations = ["15m", "30m", "45m", "1h", "2h", "4h", "1d"]
const userActions = {
    read: "r",
    write: "w",
    update: "u",
    delete: "d"
}
const listAllActions = [userActions.read, userActions.write, userActions.update, userActions.delete]


const userValidation = (userData = {}) => {
    let { user, key, rol, sessionTime, actions, routes } = userData
    if (!user || /\W/.test(user)) {
        throw new Error("Invalid user")
    }
    if (!key || key.length < 4) {
        throw new Error("A password has to had a least 4 words")
    }
    if (![ROLES.ADMIN, ROLES.USER, ROLES.READER].includes(rol)) {
        throw new Error("Invalid rol")
    }
    if (!sessionDurations.includes(sessionTime)) {
        throw new Error("Invalid session duration")
    }
    if (rol === ROLES.ADMIN && (actions.length !== 4 || !actions.every(action => listAllActions.includes(action)))) {
        throw new Error("Invalid actions for rol Admin")
    }
    if (rol === ROLES.USER && (!actions.includes(userActions.read) || !actions.includes(userActions.write))) {
        throw new Error("Invalid actions for rol User")
    }
    if (rol === ROLES.READER && (actions.length > 1 || !actions.includes(userActions.read))) {
        throw new Error("Invalid actions for rol Reader")
    }
    if (routes.length === 0) {
        throw new Error("At least one initial route is needed")
    }
    if (!routes.every(r => fs.existsSync(secure.process(r)))) {
        throw new Error("At least one initial route is invalid")
    }
}

export default userValidation