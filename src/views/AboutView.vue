<template>
  <div class="about">
    <h1>This is About view</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
});
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>