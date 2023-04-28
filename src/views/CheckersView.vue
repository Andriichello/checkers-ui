<template>
  <div class="checkers">
    <h1>This is Checkers view</h1>
    
    <div class="wrapper"> 
      <Board/>

      <div class="info"> 
        <Journal :moves="journal.getMoves()" :undos="undos.getMoves()" 
          @move-click="onJournalMoveClick"/>
      </div>
    </div>
    
    <button @click="onUndo">Undo</button>
    <button @click="onForward">Forward</button>
  </div>
</template>

<script lang="ts">
import Board from '@/components/board/Board.vue';
import Journal from '@/components/journal/Journal.vue';
import { defineComponent } from 'vue';
import { useCheckersStore } from '@/stores/checkers';

export default defineComponent({
  name: 'CheckersView',
  components: {
    Board,
    Journal,
  },
  computed: {
    journal() {
      return useCheckersStore().journal;
    },
    undos() {
      return useCheckersStore().undos;
    },
  },
  methods: {
    onUndo() {
      useCheckersStore().undo();
    },
    onForward() {
      useCheckersStore().forward();
    },
    onJournalMoveClick({ move }) {
      const moves = this.journal.getMoves();
      const index = moves.indexOf(move);

      if (index === -1) {
        const undos = this.undos.getMoves();
        const undoIndex = undos.indexOf(move);

        if (undoIndex === -1) {
          return;
        } 

        for (let i = undos.length - undoIndex; i > 0; i--) {
          this.onForward();
        }
      } else {
        for (let i = moves.length - (index + 1); i > 0; i--) {
          this.onUndo();
        }
      }
    }
  },
});
</script>

<style scoped>
.checkers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrapper {
  @apply flex flex-wrap items-center justify-center;
}

.info {
  @apply flex items-center justify-center;

  min-width: 200px;
}

button {
  @apply btn btn-ghost;
}
</style>