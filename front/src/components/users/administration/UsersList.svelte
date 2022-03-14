<script lang="ts">
    import { secure } from "../../../helpers/Misc";

    import UserCard from "./UserCard.svelte";
    import type { UserApiResponse } from "../../../types/ApiTypes";

    export let list: UserApiResponse[];
</script>

<div class="m-8">
    {#if list.length > 0}
        {#each list.map( (u) => ({ ...u, routes: u.routes.map( (r) => secure.recover(r) ) }) ) as userData}
            <UserCard {userData} />
        {/each}
    {:else}
        <h1 class="m-auto">
            <i class="fas fa-users" />
        </h1>
    {/if}
</div>
