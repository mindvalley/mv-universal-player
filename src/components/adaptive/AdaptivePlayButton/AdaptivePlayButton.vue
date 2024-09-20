<script setup lang="ts">
import { computed } from 'vue-demi'
import { useDetectBrowser } from './../../../composables/use-detect-browser'
import type { AdaptiveSize } from '../../../types/adaptive'
import { Size } from '../../../models/adaptive.enums'
const { isTouchDevice } = useDetectBrowser()

const props = defineProps({
  playing: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as () => AdaptiveSize,
    default: 'SMALL'
  }
})

const emit = defineEmits(['play', 'pause'])

const togglePlay = () => {
  if (props.playing) {
    emit('pause')
  } else {
    emit('play')
  }
}

const buttonSizeClasses = computed(() => {
  return props.size === Size.BIG
    ? 'w-14 h-14' // 56px for both desktop and mobile/tablet
    : 'w-8 h-8 md:w-10 md:h-10' // 32px for mobile/tablet, 40px for desktop
})
</script>
<template>
  <button
    v-tooltip="playing ? 'Pause' : 'Play'"
    @click="togglePlay"
    class="outline-none"
    :class="[buttonSizeClasses]"
  >
    <svg
      v-svg
      :symbol="playing ? 'pause-circle-filled' : 'play-circle-filled'"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
