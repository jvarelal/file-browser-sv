import ROLES from "../constants/roles.js";
import fs from 'fs';
import { getConnection } from "../database.js";
import FileOperationError from "../errors/FileOperationError.js";
import secure from "../helpers/secure.js";

export const getUserByName = (userName) => {
    const user = getConnection().data.users.find(u => u.user === userName);
    return user
};

export const getUsers = () => getConnection().data.users

export const updateProp = async (userName = "", prop = "", value = null) => {
    try {
        const db = getConnection();
        const user = db.data.users.find(u => u.user === userName);
        user[prop] = value
        userValidation(user)
        db.data.users = db.data.users.map((u) => (u.user === userName ? user : u));
        await db.write();
    } catch (error) {
        throw new FileOperationError({ message: `Can not update data user: ` + error.message, status: 500 });
    }
}

export const addUser = async (userData = {}) => {
    try {
        const db = getConnection();
        const { user, key, rol, sessionTime, actions, routes } = userData
        let existUser = db.data.users.find(u => u.user === user)
        if (existUser) {
            throw new FileOperationError({ message: `The user ${user} already exist`, status: 500 });
        }
        userValidation(userData)
        db.data.users = [...db.data.users, {
            user, key, rol, sessionTime, actions, routes, creation: new Date().toISOString()
        }]
        await db.write();
    } catch (error) {
        throw new FileOperationError({ message: `Can not add data user: ` + error.message, status: 500 });
    }
}

export const editUser = async (userData = {}) => {
    try {
        const db = getConnection();
        const { user, key, rol, sessionTime, actions, routes } = userData
        let existUser = db.data.users.find(u => u.user === user)
        if (!existUser) {
            throw new FileOperationError({ message: `The user ${user} does not exist`, status: 500 });
        }
        userValidation(userData)
        db.data.users = db.data.users.map((u) => (u.user === userName ? {
            ...u, user, key, rol, sessionTime, actions, routes
        } : u));
        await db.write();
    } catch (error) {
        throw new FileOperationError({ message: `Can not update data user: ` + error.message, status: 500 });
    }
}

export const deleteUser = async (userName = "") => {
    try {
        const db = getConnection();
        if (!db.data.users.find(u => u.user === userName)) {
            throw new FileOperationError({ message: `The user ${user} does not exist`, status: 500 });
        }
        db.data.users = db.data.users.filter((u) => (u.user !== userName));
        await db.write();
    } catch (error) {
        throw new FileOperationError({ message: `Can not delete data user: ` + error.message, status: 500 });
    }
}


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