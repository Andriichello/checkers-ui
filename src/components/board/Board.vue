<template>
    <div class="board">
        <template v-for="cell in board.cells" :key="cell">
            <Cell :cell="cell" :piece="game.pieceAt(cell)"
                :light="highlights && highlights.includes(cell)"
                @cell-click="onCellClick" class="cell"/>
        </template>
    </div>
</template>

<script lang="ts">
import CoreCell from "@/core/board/Cell";
import Move from "@/core/board/Move";
import { Piece as CorePiece } from "@/core/pieces/Piece";
import { useCheckersStore } from "@/stores/checkers";
import { defineComponent } from "vue";
import Cell from "./Cell.vue";

export default defineComponent({
    name: 'Board',
    components: {
        Cell,
    },
    computed: {
        flex() {
            return `0 0 ${ 100 /this.board.cols }%`
        },
        game() {
            return useCheckersStore().game;
        },
        board() {
            return useCheckersStore().board;
        },
        selected() {
            return useCheckersStore().selected;
        },
        highlights() {
            return useCheckersStore().highlights;
        },
    },
    methods: {
        onCellClick({ cell, piece }) {
            const checkers = useCheckersStore();
            
            cell = cell as CoreCell;

            if (piece) {
                piece = piece as CorePiece;

                if (piece.color === checkers.player.color) {
                    checkers.select(piece);
                } else {
                    checkers.select(null);
                }
            } else {
                const moves = checkers.currentMoves;
                
                if (!moves || !moves.length) {
                    checkers.select(null);
                } else {
                    let move = null;

                    moves.forEach((m: Move) => {
                        if (cell === m.to) {
                            move = m;
                            return;
                        }
                    });

                    if (!move) {
                        checkers.select(null);
                    } else {
                        checkers.move(move);
                    }
                }
            }
        },
    },
}) 
</script>

<style scoped>
.board {
    @apply flex flex-wrap;
    max-width: 400px;
}

.cell {
    flex: v-bind(flex);
    height: auto;
}

.cell:before {
    content: "";
    display: block;
    padding-top: 100%;
    float: left;
}
</style>