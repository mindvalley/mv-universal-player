<script setup lang="ts">
const props = defineProps({
  mixerEnabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button v-tooltip="'Mixer'" class="h-5 w-5">
    <svg
      v-svg
      symbol="sliders-outline"
      :class="['h-full w-full', mixerEnabled ? 'text-red-500' : 'text-white-70a hover:text-white']"
    ></svg>
  </button>
</template>
