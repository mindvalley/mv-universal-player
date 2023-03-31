<template>
  <div>progress bar</div>
</template>

<script setup lang="ts">
const props = defineProps({
  playing: {
    type: Boolean,
    default: false
  }
})
</script>
