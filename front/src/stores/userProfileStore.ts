import { writable } from "svelte/store";
import type { UserActionsType } from "../types/ApiTypes";
import type { UserProfileStore } from "../types/StoreTypes";
import type { UserApp } from "../types/UITypes";

const initialState: UserProfileStore = {
    name: "",
    key: "",
    rol: "2",
    sessionTime: "",
    routes: [],
    actions: []
}

function creatUserProfileStore() {
    const { subscribe, set, update } = writable<UserProfileStore>(initialState);
    return {
        subscribe,
        setProfile: (userApp: UserApp) => update((s): UserProfileStore => ({
            ...s,
            name: userApp.user,
            key: userApp.key,
            rol: userApp.rol,
            routes: userApp.routes,
            sessionTime: userApp.sessionTime
        })),
        setSessionTime: (sessionTime: string) => update((s): UserProfileStore => ({
            ...s,
            sessionTime: sessionTime
        })),
        setActions: (actions: UserActionsType[]) => update((s): UserProfileStore => ({
            ...s,
            actions: actions,
        })),
        reset: () => set(initialState)
    };
}

export default creatUserProfileStore();