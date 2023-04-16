<template>
    <div :class="{'piece': true, 'white': isWhite, 'non-white': !isWhite}">
        <p>{{ piece.toString() }}</p>
    </div>
</template>

<script lang="ts">
import { Piece } from "@/core/pieces/Piece";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Piece',
    props: {
        piece: Piece,
    },
    computed: {
        isWhite() {
            const piece = this.piece as Piece;
            return piece.color === 'white';
        },
    },
}) 
</script>

<style scoped>
.piece {
    @apply flex flex-1 self-stretch justify-center items-center m-2 rounded-full cursor-pointer;
}

.white {
    background-color: var(--white-piece);
}

.non-white {
    background-color: var(--black-piece);
}

p {
    @apply select-none;

    font-size: 6px;
}
</style>