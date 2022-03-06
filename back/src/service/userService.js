import { getConnection } from "../database.js";

export const getUserByName = (userName) => {
    const user = getConnection().data.users.find(u => u.user === userName);
    return user
};

export const updateProp = async (userName = "", prop = "", value = null) => {
    try {
        const db = getConnection();
        const user = db.data.users.find(u => u.user === userName);
        user[prop] = value
        db.data.users.map((u) => (u.user === userName ? user : u));
        await db.write();
    } catch (error) {
        throw new FileOperationError({ message: `Can not update data user: ` + error.message, status: 500 });
    }
}
