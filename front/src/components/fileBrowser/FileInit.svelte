<script lang="ts">
    import { onMount } from "svelte";
    //stores
    import fileBrowserStore from "../../stores/fileBrowserStore";
    import fileDirectoryStore from "../../stores/fileDirectoryStore";
    import fileSettingStore from "../../stores/fileSettingStore";
    import fileBookmarkGroupStore from "../../stores/fileBookmarkGroupStore";
    import userProfileStore from "../../stores/userProfileStore";
    //components
    import Modal from "../modal/Modal.svelte";
    import FileBookmarkGroupForm from "./forms/FileBookmarkGroupForm.svelte";
    import FileView from "./views/FileView.svelte";
    //types
    import type {
        ErrorApiResponse,
        FileListApiResponse,
    } from "../../types/ApiTypes";
    import type { BasicOption, VirtualGroup } from "../../types/UITypes";
    //helpers
    import { getLastTreeName } from "../../helpers/Media";
    import UserService from "../../services/UserService";
    import dialogStore from "../../stores/dialogStore";
    import TextLanguage from "../../constants/TextLanguage";

    export let apiResponse: FileListApiResponse;

    function setUpdatedBookmarks(data: FileListApiResponse): void {
        fileBrowserStore.setBookmarks(data.files);
    }

    function displayError(err: ErrorApiResponse): void {
        dialogStore.showMessage(err.message);
    }

    function getVGOptions(g: VirtualGroup): BasicOption[] {
        return [
            {
                label: "Edit group name",
                icon: "fas fa-edit",
                action: () => {
                    fileBookmarkGroupStore.setGroupTarget(g);
                },
            },
            {
                label: "Delete group",
                icon: "fas fa-trash",
                action: () => {
                    dialogStore.showDialog(
                        TextLanguage[$fileSettingStore.lang].dialogs.deleteGroup(
                            g.name
                        ),
                        () => {
                            UserService.deleteBookmarkGroup(
                                g,
                                (data) => {
                                    fileBookmarkGroupStore.setGroupList(
                                        $fileBookmarkGroupStore.groupList.filter(
                                            (group) => group.id !== g.id
                                        )
                                    );
                                    setUpdatedBookmarks(data);
                                    dialogStore.showMessage(data.message);
                                },
                                displayError
                            );
                        }
                    );
                },
            },
        ];
    }

    onMount(() => {
        fileBrowserStore.setFiles(
            apiResponse.files,
            $fileDirectoryStore.current
        );
        fileSettingStore.updateCache($fileDirectoryStore.current);
        userProfileStore.setActions(apiResponse.actions);

        document.title = `FileBrowser - ${getLastTreeName(
            $fileDirectoryStore.current
        )}`;
    });
</script>

<div class:inactive={$fileBrowserStore.viewBookmarks}>
    <FileView
        files={$fileBrowserStore.files}
        active={!$fileBrowserStore.viewBookmarks}
    />
</div>
{#if $fileBrowserStore.viewBookmarks}
    <FileView
        files={$fileBrowserStore.bookmarks}
        virtualGroups={$fileBookmarkGroupStore.groupList.map((g) => ({
            ...g,
            options: g.id === 0 ? [] : getVGOptions(g),
        }))}
    />
{/if}
{#if $fileBookmarkGroupStore.showForm}
    <Modal
        icon={$fileBookmarkGroupStore.formIcon}
        label={$fileBookmarkGroupStore.formTitle}
        onClose={fileBookmarkGroupStore.hideForm}
    >
        <FileBookmarkGroupForm />
    </Modal>
{/if}
