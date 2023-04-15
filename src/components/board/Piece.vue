<template>
    <div>
        <p>{{ piece.toString() }}</p>
    </div>
</template>

<script lang="ts">
import { Piece } from "@/core/board/pieces/Piece";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Piece',
    props: {
        piece: Piece,
    },
}) 
</script>

<style scoped>
.cell {
    @apply flex justify-center items-center btn-square;
}
</style>