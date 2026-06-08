<script setup lang="ts">
import { RouterView } from 'vue-router';
import TopNavbar from './components/TopNavbar.vue';
</script>

<template>
  <div class="app-wrapper">
    <TopNavbar />
    <main class="main-container">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global Layout Reset */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  flex: 1;
  width: 100%;
}

/* Animations for route transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
