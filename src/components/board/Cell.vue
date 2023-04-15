<template>
    <div :class="{'cell': true, 'bg-slate-200': isWhite, 'bg-slate-600': !isWhite}">
        <p v-if="!piece">{{ cell.toString() }}</p>
        <Piece v-else :piece="piece"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cell from "@/core/board/Cell";
import { Piece as CorePiece } from "@/core/board/pieces/Piece";
import Piece from "@/components/board/Piece.vue";

export default defineComponent({
    name: 'Cell',
    components: {
        Piece,
    },
    props: {
        cell: Cell,
        piece: {
            type: CorePiece,
            default: null,
        },
    },
    computed: {
        isWhite() {
            const cell = this.cell as Cell; 

            return (cell.row + cell.col) % 2;
        }
    }
}) 
</script>

<style scoped>
.cell {
    @apply flex justify-center items-center btn-square;
}
</style>