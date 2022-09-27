import USER_BOOKMARK_BASE from "../constants/userBookmarkBase.js";
import { getConnection } from "../database.js";
import FileOperationError from "../errors/FileOperationError.js";
import secure from "../helpers/secure.js";
import userValidation from "../helpers/userValidation.js";

export const getUserByName = (userName) => {
    const user = getConnection().data.users.find(u => u.user === userName);
    return user
};

export const getUsers = () => getConnection().data.users

const generalUserOperation = async (userName = "", userOperation = () => null) => {
    try {
        const db = getConnection();
        let userFound = db.data.users.find(u => u.user === userName)
        if (!userFound) {
            throw new Error(`The user ${userName} does not exist`);
        }
        userOperation(userFound)
        db.data.users = db.data.users.map((u) => (u.user === userName ? userFound : u));
        await db.write();
        return userFound
    } catch (error) {
        console.log(error)
        throw new FileOperationError({ message: `Can not update data user: ` + error.message, status: 500 });
    }
}

export const updateProp = async (userName = "", prop = "", value = null) => generalUserOperation(userName, (user) => {
    user[prop] = value
    userValidation(user)
})

export const updateBookmark = async (userName = "", bookmark = {}) => generalUserOperation(userName, (user) => {
    const recoverRouteName = (item) => {
        let { route, name } = item
        route = secure.process(route)
        name = secure.process(name)
        return route + name
    }
    let target = recoverRouteName(bookmark)
    let bookmarkIndex = user.bookmarks.findIndex(b => recoverRouteName(b) === target)
    if (bookmarkIndex >= 0) {
        if (user.bookmarks[bookmarkIndex].virtualGroup === bookmark.virtualGroup) {
            user.bookmarks.splice(bookmarkIndex, 1)
        } else {
            user.bookmarks[bookmarkIndex] = bookmark
        }
    } else {
        user.bookmarks = [...user.bookmarks, bookmark]
    }
})

export const addBookmarkGroup = async (userName = "", bookmarkGroup = {}) => generalUserOperation(userName, (user) => {
    if (user.bookmarksGroup.map(b => b.id).includes(bookmarkGroup.id)) {
        throw new Error(`The group id already exist`);
    }
    user.bookmarksGroup = [...user.bookmarksGroup, bookmarkGroup]
})

export const editBookmarkGroup = async (userName = "", bookmarkGroup = {}) => generalUserOperation(userName, (user) => {
    if (!user.bookmarksGroup.map(b => b.id).includes(bookmarkGroup.id)) {
        throw new Error(`The group id does not exist`);
    }
    user.bookmarksGroup = user.bookmarksGroup.map((bg) => (bg.id === bookmarkGroup.id ? bookmarkGroup : bg));
})

export const deleteBookmarkGroup = async (userName = "", bookmarkGroup = {}) => generalUserOperation(userName, (user) => {
    if (!user.bookmarksGroup.map(b => b.id).includes(bookmarkGroup.id)) {
        throw new Error(`The group id does not exist`);
    }
    user.bookmarksGroup = user.bookmarksGroup.filter((bg) => (bg.id !== bookmarkGroup.id));
    user.bookmarks = user.bookmarks.filter(b => b.virtualGroup !== bookmarkGroup.id)
})

export const addUser = async (userData = {}) => {
    try {
        const db = getConnection();
        const { user, key, rol, sessionTime, actions, routes } = userData
        let existUser = db.data.users.find(u => u.user === user)
        if (existUser) {
            throw new Error(`The user ${user} already exist`);
        }
        userValidation(userData)
        db.data.users = [...db.data.users, {
            user, key, rol, sessionTime, actions, routes, ...USER_BOOKMARK_BASE
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
            throw new Error(`The user ${user} does not exist`);
        }
        userValidation(userData)
        db.data.users = db.data.users.map((u) => (u.user === user ? {
            ...u, key, rol, sessionTime, actions, routes
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
            throw new Error(`The user ${user} does not exist`);
        }
        db.data.users = db.data.users.filter((u) => (u.user !== userName));
        await db.write();
    } catch (error) {
        throw new FileOperationError({ message: `Can not delete data user: ` + error.message, status: 500 });
    }
}
