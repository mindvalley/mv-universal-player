<script setup lang="ts">
const props = defineProps({
  isText: {
    type: Boolean,
    default: false
  },
  isBackgroundEnabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="flex items-start justify-start">
    <button
      data-testid="adaptive-set-duration-button"
      v-if="isText"
      class="flex flex-row gap-1 text-teal-300 rounded-[4px] px-2 py-1 items-center"
      :class="[
        isBackgroundEnabled ? 'bg-black backdrop-blur-[2px] bg-opacity-20 hover:bg-opacity-30' : ''
      ]"
    >
      <span><svg v-svg symbol="stopwatch-outlined" class="h-3 w-3"></svg></span
      ><span class="body-2-xs">Set duration</span>
    </button>
    <button
      data-testid="adaptive-set-duration-button"
      v-else
      v-tooltip="'Set duration'"
      class="h-6 w-6 xl:h-5 xl:w-5 outline-none"
    >
      <svg
        v-svg
        symbol="stopwatch-outlined"
        class="h-full w-full text-white-70a hover:text-white"
      ></svg>
    </button>
  </div>
</template>
