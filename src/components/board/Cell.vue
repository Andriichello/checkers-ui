<template>
    <div :class="{'cell': true, 'white': isWhite, 'black': !isWhite, 'highlight': light && piece}" @click="onCellClick">
        <p>{{ cell.toString() }}</p>
        <div class="circle highlight" v-if="light && !piece"></div>
        <template v-if="piece">
            <Piece :piece="piece"/>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cell from "@/core/board/Cell";
import { Piece as CorePiece } from "@/core/pieces/Piece";
import Piece from "@/components/board/Piece.vue";

export default defineComponent({
    name: 'Cell',
    emits: ['cell-click'],
    components: {
        Piece,
    },
    props: {
        cell: Cell,
        piece: {
            type: CorePiece,
            default: null,
        },
        light: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        isWhite() {
            const cell = this.cell as Cell; 

            return (cell.row + cell.col) % 2;
        },
    },
    methods: {
        onCellClick() {
            this.$emit('cell-click', { cell: this.cell, piece: this.piece })
        },
    }
}) 
</script>

<style scoped>
.cell {
    @apply flex justify-center items-center btn-square;

    position: relative;
}

.white {
    background-color: var(--white-cell);
}

.black {
    background-color: var(--black-cell);
}

.circle {
    @apply absolute w-3.5 h-3.5;
    border-radius: 50%;
}

.highlight {
    background-color: var(--highlight-cell);
}

p {
    @apply select-none;

    position: absolute;
    font-size: 8px;

    top: 2px;
    left: 2px;
}
</style>