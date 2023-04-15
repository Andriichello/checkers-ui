<template>
    <div class="board">
        <template v-for="cell in board.cells" :key="cell">
            <Cell :cell="cell" :piece="game.pieceAt(cell)"/>
        </template>
    </div>
</template>

<script lang="ts">
import { useCheckersStore } from "@/stores/checkers";
import { defineComponent } from "vue";
import Cell from "./Cell.vue";

export default defineComponent({
    name: 'Board',
    components: {
        Cell,
    },
    computed: {
        game() {
            return useCheckersStore().game;
        },
        board() {
            return useCheckersStore().board;
        },
    },
    mounted() {
        console.log('Board mounted')
    }
}) 
</script>

<style scoped>
.board {
    @apply grid grid-cols-8 gap-0.5 w-full p-2;
}
</style>