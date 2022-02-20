<script lang="ts">
    //stores
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import fileSettingStore from "../../../stores/fileSettingStore";
    import fileDirectoryStore from "../../../stores/fileDirectoryStore";
    //components
    import ActionButton from "../../commons/ActionButton.svelte";
    //helpers
    import { limitString } from "../../../helpers/Misc";

    let newRoute: string = $fileDirectoryStore.current;
    let input: HTMLElement;

    function parentFolder(index: number = 0): void {
        let splitRoute = $fileDirectoryStore.current.split("/");
        if (splitRoute.length !== index) {
            fileDirectoryStore.setDirectory(
                splitRoute.slice(0, index).join("/")
            );
        }
    }
    function validate(e: KeyboardEvent): boolean {
        let key = e.key;
        if (key === "Escape") {
            fileBrowserStore.setEditRoute(false);
            return false;
        }
        if (key === "Enter") {
            fileDirectoryStore.setDirectory(newRoute);
            return false;
        }
        if (/^["?*:|<>\\]/.test(key)) {
            e.preventDefault();
            return false;
        }
        return true;
    }

    function updateVal(e: Event): void {
        let value = (e.target as HTMLInputElement).value;
        newRoute = value;
    }

    $: if ($fileBrowserStore.editRoute && input) {
        input.focus();
    }
</script>

<div class="route-parts d-flex">
    {#if !$fileBrowserStore.viewBookmarks}
        {#if $fileBrowserStore.editRoute}
            <input
                type="text"
                class="w-100 m-l-auto"
                value={$fileDirectoryStore.current}
                list="cache"
                bind:this={input}
                on:keydown={validate}
                on:input={updateVal}
            />
            <datalist id="cache">
                {#each $fileSettingStore.cache as route}
                    <option value={route} />
                {/each}
            </datalist>
            <div class="route-actions m-l-auto d-flex">
                {#if $fileBrowserStore.editRoute}
                    <ActionButton
                        icon="fas fa-arrow-alt-circle-right"
                        on:click={() =>
                            fileDirectoryStore.setDirectory(newRoute)}
                    />
                    <ActionButton
                        icon="fas fa-times-circle"
                        on:click={() => fileBrowserStore.setEditRoute(false)}
                    />
                {/if}
            </div>
        {:else}
            {#each ($fileDirectoryStore.current || "").split("/") as folder, i}
                <button
                    on:click={() => parentFolder(i + 1)}
                    class="path-fragment"
                    disabled={$fileBrowserStore.waiting}
                    title={folder.length > 30 ? folder : ""}
                >
                    {limitString(folder, 30, "...")}
                </button>
            {/each}
            <div class="route-actions m-l-auto d-flex">
                <ActionButton
                    icon="fas fa-pencil-alt"
                    title="Set directory"
                    on:click={() => fileBrowserStore.setEditRoute(true)}
                />
                <ActionButton
                    on:click={() =>
                        fileDirectoryStore.setDirectory(
                            $fileDirectoryStore.current
                        )}
                    title="Cancel"
                    icon="fas fa-redo"
                />
            </div>
        {/if}
    {:else}
        <span class="m-l-5">Marcadores</span>
    {/if}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .route-parts {
        border-radius: 1px;
        text-align: left;
        flex-basis: 100%;
        .path-fragment {
            padding: 0 0.25rem;
            border: 1px solid transparent;
            background-color: transparent;
            font-size: 0.9rem;
            cursor: pointer;
            color: $color-route;
            height: 2rem;
            overflow: auto;
            &::after {
                content: ">";
                margin: 0 0.25rem;
            }
            &:hover,
            &:focus {
                background-color: #ddda;
            }
            &:disabled {
                cursor: default;
                color: $color-route-disable;
            }
            &:disabled {
                &:hover,
                &:focus {
                    background-color: transparent;
                }
            }
        }
        input {
            background-color: $bg-inp;
            color: $color-text;
        }
    }
    @media (max-width: $responsive-size) {
        .route-parts {
            display: none;
        }
    }
</style>
