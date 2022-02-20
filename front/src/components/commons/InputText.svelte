<script lang="ts">
    export let name: string = "input";
    export let label: string = "";
    export let value: string = "";
    export let errors: string = "";
    export let regex: RegExp = null;
    export let type: string = "text";
    export let required: boolean = true;
    export let list: string = "";

    function validate(e: KeyboardEvent): boolean {
        let key = e.key;
        if (regex && regex.test(key)) {
            e.preventDefault();
            errors = `* Los nombres de archivos no pueden contener los caracteres " / ? * : | < > \ `;
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
                on:keypress={validate}
                autocomplete="off"
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
                on:keypress={validate}
                autocomplete="off"
                {required}
            />
        {/if}
    </div>
    {#if errors}
        <div class="form-field-error m-t-4 f-08">{errors}</div>
    {/if}
</div>
