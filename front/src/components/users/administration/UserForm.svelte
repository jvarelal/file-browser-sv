<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import InputText from "../../commons/InputText.svelte";
    import UserActions from "./UserActions.svelte";
    import type { UserApp } from "../../../types/UITypes";
    import userOperations from "../../../constants/UserOperations";
    import FileBrowser from "../../../constants/FileBrowser";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import type { UserActionsType } from "../../../types/ApiTypes";
    import InputLabel from "../../commons/InputLabel.svelte";
    import AdminService from "../../../services/AdminService";
    import dialogStore from "../../../stores/dialogStore";

    export let onCancel: VoidFunction;
    export let userTarget: UserApp = null;

    const allAction: UserActionsType[] = [
        userOperations.read,
        userOperations.write,
        userOperations.update,
        userOperations.delete,
    ];

    let route: string = "";
    let values: UserApp = userTarget
        ? { ...userTarget }
        : {
              user: "",
              key: "",
              actions: [userOperations.read],
              rol: "2",
              routes: [],
              sessionTime: "1h",
          };
    let errors = {
        user: "",
        key: "",
        actions: "",
        routes: "",
    };
    let disabledFields: string[] = [];

    function getDisabledFieldsEvent(e: Event): void {
        let target = e.target as HTMLInputElement;
        getDisabledFields(target.value);
    }

    function getDisabledFields(rol: string): void {
        if (rol === "0") {
            values.actions = allAction;
            disabledFields = allAction;
        } else if (rol === "1") {
            values.actions = allAction;
            disabledFields = [userOperations.read, userOperations.write];
        } else if (rol === "2") {
            values.actions = [userOperations.read];
            disabledFields = allAction;
        }
    }

    function onCheckboxChange(e: InputEvent, operation: UserActionsType): void {
        let target = e.target as HTMLInputElement;
        if (target.checked) {
            values.actions = [...values.actions, userOperations[operation]];
        } else {
            values.actions = values.actions.filter(
                (a) => a !== userOperations[operation]
            );
        }
    }

    function addRoute(): void {
        if (!route) {
            errors.routes = "Debe agregar una ruta";
            return;
        }
        let findRelatives = values.routes.filter(
            (r) => r.startsWith(route) || route.startsWith(r)
        );
        if (findRelatives.length > 0) {
            errors.routes = "Existe ya una ruta relacionada a la ingresada";
            return;
        }
        values.routes = [...values.routes, route];
        route = "";
    }
    function removeRoute(route: string): void {
        values.routes = values.routes.filter((r) => r !== route);
    }

    function onSubmit() {
        if (values.routes.length === 0) {
            errors.routes = "Es necesario ingresar al menos una ruta inicial";
            return;
        }
        if (userTarget) {
            AdminService.edit(values, onCancel, (err) => {
                dialogStore.showMessage(err.message);
            });
        } else {
            AdminService.add(values, onCancel, (err) => {
                dialogStore.showMessage(err.message);
            });
        }
    }

    onMount(() => {
        getDisabledFields(values.rol);
    });
</script>

<div class="user-settings">
    <section transition:fly={{ x: 200, duration: 250 }}>
        <div class="user-header">
            <button class="m-r-auto back" on:click={onCancel}>
                <i class="fas fa-arrow-left" />
            </button>
            <h4 class="user-header-name">
                {#if userTarget}
                    <i class="far fa-edit" /> Editar {userTarget.user}
                {:else}
                    <i class="fas fa-plus" /> Nuevo acceso
                {/if}
            </h4>
        </div>
        <form on:submit|preventDefault={onSubmit}>
            <div class="user-settings-row">
                <div>
                    {#if userTarget}
                        <InputLabel label="Usuario" value={values.user} />
                    {:else}
                        <InputText
                            name="user"
                            label="Usuario"
                            bind:value={values.user}
                            bind:errors={errors.user}
                            regex={/\W/}
                        />
                    {/if}
                </div>
                <div>
                    <InputText
                        name="key"
                        label="Password"
                        type="password"
                        bind:value={values.key}
                        bind:errors={errors.key}
                    />
                </div>
            </div>
            <div class="user-settings-row">
                <div>
                    <div class="form-field-control">
                        <label for="type">Rol</label>
                        <div class="form-field">
                            <select
                                id="rol"
                                class="w-100"
                                name="rol"
                                on:change={getDisabledFieldsEvent}
                                bind:value={values.rol}
                            >
                                {#each FileBrowser.roles as rol}
                                    <option value={rol.value}>
                                        {rol.label}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="form-field-control">
                        <label for="type">Tiempo de sesión</label>
                        <div class="form-field">
                            <select
                                id="type"
                                class="w-100"
                                name="type"
                                bind:value={values.sessionTime}
                            >
                                {#each FileBrowser.sessionTime as option}
                                    <option value={option}>
                                        {option}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="user-settings-row">
                <UserActions
                    onChange={onCheckboxChange}
                    userActions={values.actions}
                    row={false}
                    {disabledFields}
                />
                <div>
                    <InputText
                        name="route"
                        label="Rutas"
                        required={false}
                        list="cache"
                        bind:value={route}
                        bind:errors={errors.routes}
                        action={addRoute}
                        iconAction="fas fa-plus"
                    />
                    <datalist id="cache">
                        {#each $fileSettingStore.cache as route}
                            <option value={route} />
                        {/each}
                    </datalist>
                    <table class="tbl w-100 f-09">
                        <tbody>
                            {#each values.routes as r}
                                <tr>
                                    <td class="t-left">{r}</td>
                                    <td class="t-right">
                                        <button
                                            on:click|preventDefault={() =>
                                                removeRoute(r)}
                                            class="inp-type disable pointer"
                                        >
                                            <i class="fas fa-trash-alt" />
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="form-field-control d-flex">
                <button type="submit" class="btn m-auto w-25"
                    >{userTarget ? "Modificar" : "Agregar"}</button
                >
                <button
                    on:click|preventDefault={onCancel}
                    class="btn m-auto w-25"
                >
                    Cancelar
                </button>
            </div>
        </form>
    </section>
</div>
