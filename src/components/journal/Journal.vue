<template>
    <div class="journal">
        <template v-for="move in list" :key="move.toString()">
            <Move :move="move" :highlight="move === current" 
                @click="onMoveClick(move)" class="move"/>
        </template>
    </div>
</template>

<script lang="ts">
import CoreJournal from "@/core/Journal";
import CoreMove from "@/core/board/Move";
import { Piece } from "@/core/pieces/Piece";
import Move from "@/components/journal/Move.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Journal',
    emits: ['move-click'],
    components: {
        Move,
    },
    props: {
        moves: Array,
        undos: Array,
    },
    computed: {
        list() {            
            const list = [];

            list.push(...this.moves);
            list.push(...[...this.undos].reverse());

            return list;
        },
        current() {
            if (this.moves && !this.moves.length) {
                return null;
            }

            return this.moves[this.moves.length - 1];
        },
    },
    methods: {
        onMoveClick(move) {
            if (move) {
                this.$emit('move-click', { move });
            }
        },
    },
}) 
</script>

<style scoped>
.journal {
    @apply flex flex-wrap justify-start items-start p-2 bg-base-300;

    align-content: flex-start;

    min-width: 152px;
    max-width: 152px;
    min-height: 240px;
    max-height: 240px;

    overflow: auto;
}

.move {
    @apply basis-1/2 cursor-pointer;
}
</style>