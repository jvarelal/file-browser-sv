<script lang="ts">
    import { setContext } from "svelte";
    import Accordion from "../commons/Accordion.svelte";
    import ActionButton from "../commons/ActionButton.svelte";
    import InputSearch from "../commons/InputSearch.svelte";
    import UserForm from "./administration/UserForm.svelte";
    import UsersList from "./administration/UsersList.svelte";
    import type {
        TxtLang,
        UserApp,
        UserAppFunction,
    } from "../../types/UITypes";
    import type { UserListApiResponse } from "../../types/ApiTypes";
    import AdminService from "../../services/AdminService";
    import dialogStore from "../../stores/dialogStore";

    export let lang: TxtLang;

    let collapse: boolean = true;
    let filterValue: string = "";
    let showForm: boolean = false;
    let userTarget: UserApp = null;

    let usersData: Promise<UserListApiResponse> = AdminService.list();

    function closeForm(): void {
        userTarget = null;
        showForm = !showForm;
        usersData = AdminService.list();
    }

    function onEditUser(userData: UserApp): void {
        userTarget = { ...userData };
        showForm = true;
    }

    function onDelete(userData: UserApp): void {
        let cb = () => {
            usersData = AdminService.list();
            dialogStore.showMessage(lang.dialogs.deleteUser(userData.user));
        };
        dialogStore.showDialog(
            lang.dialogs.confirmDeleteUser(userData.user),
            (): void => {
                dialogStore.showLoading();
                AdminService.delete(userData, cb, (data) => {
                    dialogStore.showMessage(data.message);
                });
            }
        );
    }

    setContext<UserAppFunction>("onEditUser", onEditUser);
    setContext<UserAppFunction>("onDelete", onDelete);
</script>

<Accordion
    title={`<i class="fas fa-users m-r-5  m-l-5"></i> ${lang.label.usersControl}`}
    id="userList"
    renderDefault={false}
    bind:collapse
>
    {#if showForm}
        <UserForm onCancel={closeForm} {userTarget} lang={lang.forms.user} />
    {:else}
        <div class="d-flex p-5">
            <InputSearch
                cssClass="m-r-auto border-medium"
                value={filterValue}
            />
            <ActionButton
                icon="fas fa-plus"
                className="m-l-auto"
                on:click={closeForm}
            />
        </div>
        {#await usersData}
            <div class="loader m-t-10" />
        {:then list}
            <UsersList list={list.users} lang={lang.forms.user} />
        {:catch error}
            <div class="d-flex">
                <h3 class="m-auto">
                    {lang.dialogs.usersListError(error.message)}
                </h3>
            </div>
        {/await}
    {/if}
</Accordion>
