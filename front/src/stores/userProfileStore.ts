import { writable } from "svelte/store";
import type { UserProfileStore } from "../types/StoreTypes";
import type { UserApp } from "../types/UITypes";

const initialState: UserProfileStore = {
    name: "",
    key: "",
    rol: 2,
    routes: [],
    actions: []
}

function creatUserProfileStore() {
    const { subscribe, set, update } = writable<UserProfileStore>(initialState);
    return {
        subscribe,
        setProfile: (userApp: UserApp) => update((s): UserProfileStore => ({
            name: userApp.user,
            key: userApp.key,
            actions: userApp.actions,
            rol: userApp.rol,
            routes: userApp.routes
        })),
        reset: () => set(initialState)
    };
}

export default creatUserProfileStore();