<script setup lang="ts">
import { MVAdaptiveMarqueeContent } from '../../info'

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
    default: ''
  },
  isBackgroundEnabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    data-testid="adaptive-meditation-mixer-button"
    v-if="isText"
    class="flex gap-1 text-teal-300 rounded-[4px] py-1 items-center"
    :class="[
      isBackgroundEnabled ? 'bg-black backdrop-blur-[2px] bg-opacity-20 hover:bg-opacity-30' : ''
    ]"
  >
    <span data-testid="icon"><svg v-svg symbol="sliders-outlined" class="h-3 w-3"></svg></span>
    <span data-testid="mixer-available" v-if="!mixerEnabled" class="body-2-xs"
      >Mixer available</span
    >
    <span data-testid="mixing-with" v-else class="w-[180px] overflow-hidden">
      <MVAdaptiveMarqueeContent>
        <span class="body-2-xs mr-6">Mixing with {{ trackTitle }}</span>
      </MVAdaptiveMarqueeContent>
    </span>
  </button>
  <button
    data-testid="adaptive-meditation-mixer-button"
    v-else
    v-tooltip="'Mixer'"
    class="h-6 w-6 xl:h-5 xl:w-5"
  >
    <svg
      data-testid="icon"
      v-svg
      symbol="sliders-outlined"
      :class="['h-full w-full', mixerEnabled ? 'text-red-500' : 'text-white-70a hover:text-white']"
    ></svg>
    <div data-testid="active-indicator" class="flex items-center justify-center">
      <span v-if="mixerEnabled" class="h-1 w-1 bg-red-500 rounded-full mt-[2px]"></span>
    </div>
  </button>
</template>
