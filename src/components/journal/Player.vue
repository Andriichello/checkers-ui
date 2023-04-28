<template>
    <div class="player">
        <p>{{ move.toString() }}</p>
    </div>
</template>

<script lang="ts">
import CorePlayer from "@/core/Player";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Player',
    props: {
        player: CorePlayer,
    },
}) 
</script>

<style scoped>
.player {
    @apply flex justify-center items-center btn-sm btn-ghost;

    width: 64px;

    font-size: 10px;
}
</style>