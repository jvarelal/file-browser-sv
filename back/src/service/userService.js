import { getConnection } from "../database.js";

export const getUserByName = (userName) => {
    const user = getConnection().data.users.find(u => u.user === userName);
    return user
};

export const updateUserBookmarks = async (userName = "", bookmarks = []) => {
    try {
        const db = getConnection();
        const user = db.data.users.find(u => u.user === userName);
        user.bookmarks = bookmarks
        db.data.users.map((u) => (u.user === userName ? user : u));
        await db.write();
    } catch (error) {
        throw new FileOperationError({ message: "Can not update bookmars " + error.message, status: 500 });
    }
}