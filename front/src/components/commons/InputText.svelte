<script lang="ts">
    export let name: string = "input";
    export let label: string = "";
    export let value: string = "";
    export let errors: string = "";
    export let regex: RegExp = null;
    export let errorRegexp: string = "";
    export let type: string = "text";
    export let required: boolean = true;
    export let list: string = "";
    export let minlength: number = 0;
    export let maxlength: number = 150;
    export let action: VoidFunction = null;
    export let iconAction: string = "";

    function validate(e: KeyboardEvent): boolean {
        let key = e.key;
        if (regex && regex.test(key)) {
            e.preventDefault();
            errors = errorRegexp;
            return false;
        }
        errors = ``;
        return true;
    }
</script>

<div class="form-field-control">
    <label for={name}>{label}</label>
    <div class="form-field">
        {#if type === "text"}
            <input
                type="text"
                class="w-100 p-2"
                id={name}
                {name}
                {list}
                bind:value
                on:input={() => (errors = "")}
                on:keypress={validate}
                autocomplete="off"
                maxlength={maxlength}
                minlength={minlength}
                {required}
            />
        {/if}
        {#if type === "password"}
            <input
                type="password"
                class="w-100 p-2"
                id={name}
                {name}
                bind:value
                on:change={() => (errors = "")}
                on:keypress={validate}
                autocomplete="off"
                {required}
            />
        {/if}
        {#if action}
            <button on:click|preventDefault={action} class="inp-type pointer">
                <i class={iconAction} />
            </button>
        {/if}
    </div>
    {#if errors}
        <div class="form-field-error m-t-4 f-08">* {errors}</div>
    {/if}
</div>
