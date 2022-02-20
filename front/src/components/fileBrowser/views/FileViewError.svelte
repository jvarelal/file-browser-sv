<script lang="ts">
    import { onMount } from "svelte";
    import fileBrowserStore from "../../../stores/fileBrowserStore";
    import type { ErrorApiResponse } from "../../../types/ApiTypes";

    export let error: ErrorApiResponse;
    export let navigate: (route: string) => void;

    onMount(() => {
        if (error.status === 401 && navigate) {
            navigate("/login");
        }
        fileBrowserStore.setError();
    });
</script>

<div class="alert-danger">
    <h1 class="alert-icon"><i class="fas fa-exclamation-triangle" /></h1>
    <h2>{error.message}</h2>
</div>

<style>
    .alert-danger {
        color: red;
    }
    .alert-icon {
        font-size: 4rem;
        margin: 1rem;
    }
</style>
