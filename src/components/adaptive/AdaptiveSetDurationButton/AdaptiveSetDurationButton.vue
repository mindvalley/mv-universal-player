<script setup lang="ts">
const props = defineProps({
  isText: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="flex items-start justify-start">
    <button
      v-if="isText"
      class="flex flex-row gap-1 text-teal-300 bg-black backdrop-blur-[2px] bg-opacity-20 hover:bg-opacity-30 rounded-[4px] px-2 py-1 items-center"
    >
      <span><svg v-svg symbol="stopwatch-outlined" class="h-3 w-3"></svg></span
      ><span class="caption-disclaimer">Set duration</span>
    </button>
    <button v-else v-tooltip="'Set duration'" class="h-5 w-5 outline-none">
      <svg
        v-svg
        symbol="stopwatch-outlined"
        class="h-full w-full text-white-70a hover:text-white"
      ></svg>
    </button>
  </div>
</template>
