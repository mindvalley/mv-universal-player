<script setup lang="ts"></script>

<template>
  <button
    data-testid="adaptive-previous-button"
    v-tooltip="'Previous'"
    class="h-6 w-6 xl:h-5 xl:w-5 outline-none"
  >
    <svg
      v-svg
      symbol="skip-back-outlined"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
