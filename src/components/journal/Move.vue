<template>
    <div :class="{ 'move': true, 'highlight': highlight }">
        <p>{{ move.toString() }}</p>
    </div>
</template>

<script lang="ts">
import CoreMove from "@/core/board/Move";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Move',
    props: {
        move: CoreMove,
        highlight: Boolean,
    },
}) 
</script>

<style scoped>
.move {
    @apply flex justify-center items-center btn-sm btn-ghost;

    font-size: 10px;
}

.highlight {   
    @apply bg-base-100;
}
</style>