import { getConnection } from "../database.js";

export const getUserByName = (userName) => {
    const user = getConnection().data.users.find(u => u.user === userName);
    return user
};