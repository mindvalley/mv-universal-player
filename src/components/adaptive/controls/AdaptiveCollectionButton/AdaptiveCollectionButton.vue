<script setup lang="ts"></script>
<template>
  <button
    data-testid="adaptive-collection-button"
    v-tooltip="'View collection'"
    class="h-6 w-6 outline-none"
  >
    <svg
      v-svg
      symbol="list-filled"
      class="h-full w-full text-white-70a hover:text-white"
      size="20"
    ></svg>
  </button>
</template>
