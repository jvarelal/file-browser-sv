<script lang="ts">
    export let label: string;
    export let value: string;
    export let action: any = null;
    export let iconAction: string = "";
</script>

<div class="form-field-control">
    <label for="type">{label}</label>
    <div class="form-field">
        <span class="inp-type disable p-3 w-100 f-08 t-left">
            {@html value}
        </span>
        {#if action}
            <button
                on:click|preventDefault={action}
                class="inp-type disable pointer"
            >
                <i class={iconAction} />
            </button>
        {/if}
    </div>
</div>
