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
    class="flex flex-row w-full pl-4 pr-2 text-teal-300 bg-white-12a border border-white-12a rounded-lg items-center"
    :class="[mixerEnabled ? 'py-2' : 'py-3']"
  >
    <span class="flex items-center mr-2">
      <svg v-svg symbol="sliders-outlined" class="h-4 w-4"></svg>
    </span>
    <span v-if="!mixerEnabled" class="title-9 flex-grow text-start">Mixer available</span>
    <div v-else class="flex-grow overflow-hidden">
      <AdaptiveMarqueeContent>
        <span class="title-9 mr-12">Mixing with {{ trackTitle }}</span>
      </AdaptiveMarqueeContent>
    </div>
    <span class="ml-2">
      <svg v-svg symbol="chevron-right-outlined" class="h-4 w-4 text-white"></svg>
    </span>
  </button>
</template>
