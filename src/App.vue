<template>
  <div class="content">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="128" height="128" />

    <nav>
      <RouterLink to="/" class="link">Home</RouterLink>
      <RouterLink to="/about" class="link">About</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {
    RouterLink, 
    RouterView,
  }
})
</script>

<style scoped>
.logo {
  @apply mt-4 mb-2 ml-2 mr-2
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-basis: 100%;
}

nav {
  @apply flex mt-2 mb-2 ml-2 mr-2 gap-4;
}
</style>
