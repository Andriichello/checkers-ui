<template>
  <div class="home">
    <h1>This is Home view</h1>
    <button @click="onChangeTheme">Change theme</button>
  </div>
</template>

<script lang="ts">
import { useThemeStore } from '@/stores/theme';
import Board from '@/components/board/Board.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    Board,
  },
  methods: {
    onChangeTheme() {
      const store = useThemeStore();

      if (store.list[0] === store.theme) {
        store.apply(store.list[1]);
      } else {
        store.apply(store.list[0]);
      }
    },
  },
});
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  @apply btn btn-ghost;
}
</style>