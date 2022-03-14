<script lang="ts">
    import userOperations from "../../../constants/UserOperations";

    export let userActions: string[] = [];
    export let disabled: boolean = false;
    export let disabledFields: string[] = [];
    export let row: boolean = true;
    export let onChange: any = () => null;

    const userListOperations: string[] = ["read", "write", "update", "delete"];
</script>

<div class="f-08" class:d-row={row} class:d-column={!row}>
    {#each userListOperations as operation}
        <div class="p-4">
            <input
                type="checkbox"
                disabled={disabled ||
                    disabledFields.includes(userOperations[operation])}
                checked={userActions.includes(userOperations[operation])}
                id={operation}
                on:change={(e) => onChange(e, operation)}
            />
            <label for={operation}> {operation} </label>
        </div>
    {/each}
</div>

<style lang="scss">
    @import "../../../styles/vars";
    .d-row {
        display: flex;
        > div {
            margin: auto;
        }
    }
    .d-column {
        display: flex;
        flex-direction: column;
        > div {
            width: 50%;
            margin-left: auto;
        }
    }
    input[type="checkbox"] {
        border-radius: 10%;
        &:disabled {
            background-color: $bg-inp-disable;
        }
    }
</style>
