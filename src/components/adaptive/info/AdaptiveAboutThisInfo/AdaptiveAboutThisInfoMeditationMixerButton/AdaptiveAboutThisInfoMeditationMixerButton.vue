<script setup lang="ts">
import { AdaptiveMarqueeContent } from '../../AdaptiveMarqueeContent'

const props = defineProps({
  mixerEnabled: {
    type: Boolean,
    default: false
  },
  trackTitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <button
    data-testid="adaptive-about-this-info-meditation-mixer-button"
    class="flex flex-row w-full pl-4 pr-2 text-teal-300 bg-white-12a hover:bg-white-24a border border-white-12a rounded-lg items-center"
    :class="[mixerEnabled ? 'py-2' : 'py-3']"
  >
    <span data-testid="mixer-icon" class="flex items-center mr-2">
      <svg v-svg symbol="sliders-outlined" class="h-4 w-4"></svg>
    </span>
    <span data-testid="mixer-available" v-if="!mixerEnabled" class="heading-9 flex-grow text-start"
      >Mixer available</span
    >
    <div data-testid="mixer-mixing" v-else class="flex-grow overflow-hidden">
      <AdaptiveMarqueeContent>
        <span class="heading-9 mr-12">Mixing with {{ trackTitle }}</span>
      </AdaptiveMarqueeContent>
    </div>
    <span data-testid="mixer-chevron" class="ml-2">
      <svg v-svg symbol="chevron-right-outlined" class="h-4 w-4 text-white"></svg>
    </span>
  </button>
</template>
