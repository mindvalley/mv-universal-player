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
      symbol="sliders-outlined"
      :class="['h-full w-full', mixerEnabled ? 'text-red-500' : 'text-white-70a hover:text-white']"
    ></svg>
    <div class="flex items-center justify-center">
      <span v-if="mixerEnabled" class="h-1 w-1 bg-red-500 rounded-full mt-[2px]"></span>
    </div>
  </button>
</template>
