<script setup lang="ts"></script>

<template>
  <button data-testid="adaptive-close-button" v-tooltip="'Close'" class="w-5 h-5 outline-none">
    <svg
      v-svg
      symbol="x-circle-outlined"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
