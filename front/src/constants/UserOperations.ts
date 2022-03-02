import type { UserActionsType } from "../types/ApiTypes"

interface UserOperations {
    read: UserActionsType;
    write: UserActionsType;
    update: UserActionsType;
    delete: UserActionsType;
}

const userOperations: UserOperations = {
    read: "r",
    write: "w",
    update: "u",
    delete: "d"
}

export default userOperations