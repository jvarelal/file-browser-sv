<script lang="ts">
    import { getContext, onMount } from "svelte";
    import TextLanguage from "../../../constants/TextLanguage";
    import UserService from "../../../services/UserService";
    import dialogStore from "../../../stores/dialogStore";
    import fileBookmarkGroupStore from "../../../stores/fileBookmarkGroupStore";
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import type { VirtualGroup } from "../../../types/UITypes";
    import InputLabel from "../../commons/InputLabel.svelte";
    import InputText from "../../commons/InputText.svelte";

    const closeModal = getContext<VoidFunction>("closeModal");
    const currentGroupNames: string[] = $fileBookmarkGroupStore.groupList.map(
        (g) => g.name
    );
    const currentGroupIds: number[] = $fileBookmarkGroupStore.groupList.map(
        (g) => g.id
    );
    let formLang = TextLanguage[$fileSettingStore.lang].forms.bookmark;
    let updateGroup: boolean = $fileBookmarkGroupStore.fileTarget === null;
    let nameError: string = "";
    let focusElement: HTMLElement;

    let value: VirtualGroup = $fileBookmarkGroupStore.groupTarget || {
        id: updateGroup ? findNewId() : $fileBookmarkGroupStore.groupList[0].id,
        name: "",
    };
    function findNewId(): number {
        let newId = 1;
        while (currentGroupIds.includes(newId)) {
            newId++;
        }
        return newId;
    }
    function updateGroupListOnSuccess(newGroup: boolean): VirtualGroup[] {
        if (newGroup) {
            return [...$fileBookmarkGroupStore.groupList, value];
        }
        return $fileBookmarkGroupStore.groupList.map((g) =>
            g.id === value.id ? value : g
        );
    }

    function handleSubmitGroup(): void {
        const newGroup: boolean = $fileBookmarkGroupStore.groupTarget === null;
        if (currentGroupNames.includes(value.name?.trim())) {
            nameError = formLang.validations.exist(newGroup);
            return;
        }
        UserService[newGroup ? "addBookmarkGroup" : "editBookmarkGroup"](
            value,
            () => {
                fileBookmarkGroupStore.setGroupList(
                    updateGroupListOnSuccess(newGroup)
                );
            },
            (err) => dialogStore.showMessage(err.message)
        );
        closeModal();
    }

    function handleNewBookmark(): void {
        fileBrowserStore.updateBookmarks({
            ...$fileBookmarkGroupStore.fileTarget,
            virtualGroup: Number(value.id) || 0,
        });
        closeModal();
    }

    onMount(() => {
        if (!updateGroup) {
            focusElement?.focus();
        }
    });
</script>

<form
    on:submit|preventDefault={updateGroup
        ? handleSubmitGroup
        : handleNewBookmark}
>
    {#if updateGroup}
        <InputText
            name="virtualGroup"
            label={formLang.labels.title}
            maxlength={15}
            bind:value={value.name}
            bind:errors={nameError}
        />
    {:else}
        <InputLabel
            label={formLang.labels.target}
            value={$fileBookmarkGroupStore.fileTarget?.name}
        />
        <div class="form-field-control">
            <label for="type">{formLang.labels.group}</label>
            <div class="form-field">
                <select
                    id="type"
                    class="w-100"
                    name="type"
                    bind:value={value.id}
                    bind:this={focusElement}
                    required
                >
                    {#each $fileBookmarkGroupStore.groupList as groupList}
                        <option value={groupList.id}>{groupList.name}</option>
                    {/each}
                </select>
            </div>
        </div>
    {/if}
    <div class="form-field-control d-flex">
        <button type="submit" class="btn m-auto w-25">
            {$fileBookmarkGroupStore.groupTarget
                ? formLang.options.edit
                : formLang.options.create}
        </button>
        <button on:click|preventDefault={closeModal} class="btn m-auto w-25">
            {formLang.options.cancel}
        </button>
    </div>
</form>
