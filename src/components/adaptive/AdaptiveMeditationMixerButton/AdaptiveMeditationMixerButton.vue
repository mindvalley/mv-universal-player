<script setup lang="ts">
import { AdaptiveMarqueeContent } from '../AdaptiveMarqueeContent'

const props = defineProps({
  mixerEnabled: {
    type: Boolean,
    default: false
  },
  isText: {
    type: Boolean,
    default: false
  },
  trackTitle: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button
    v-if="isText"
    class="flex flex-row gap-1 text-teal-300 bg-black backdrop-blur-[2px] bg-opacity-20 hover:bg-opacity-30 rounded-[4px] px-2 py-1 items-center"
  >
    <span><svg v-svg symbol="sliders-outlined" class="h-3 w-3"></svg></span>
    <span v-if="!mixerEnabled" class="caption-disclaimer">Mixer available</span>
    <span v-else class="w-[180px] overflow-hidden">
      <AdaptiveMarqueeContent>
        <span v-for="i in 10" :key="i" class="caption-disclaimer mr-6"
          >Mixing with {{ trackTitle }}</span
        >
      </AdaptiveMarqueeContent>
    </span>
  </button>
  <button v-else v-tooltip="'Mixer'" class="h-5 w-5">
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
