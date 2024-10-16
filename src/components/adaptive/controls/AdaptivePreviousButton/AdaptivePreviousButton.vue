<script setup lang="ts"></script>

<template>
  <button
    data-testid="adaptive-previous-button"
    v-tooltip="'Previous'"
    class="h-5 w-5 outline-none"
  >
    <svg
      v-svg
      symbol="skip-back-outlined"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
