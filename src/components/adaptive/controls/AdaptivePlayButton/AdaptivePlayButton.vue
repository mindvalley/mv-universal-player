<script setup lang="ts">
import { computed } from 'vue-demi'
import type { AdaptiveSize } from '../../../../types/adaptive'
import { Size } from '../../../../models/adaptive.enums'

const props = defineProps({
  playing: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as () => AdaptiveSize,
    default: 'SMALL'
  },
  iconColor: {
    type: String,
    default: 'text-white-70a'
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
    : 'w-10 h-10' // 32px for mobile/tablet, 40px for desktop
})
</script>
<template>
  <button
    data-testid="adaptive-play-button"
    v-tooltip="playing ? 'Pause' : 'Play'"
    @click="togglePlay"
    class="outline-none transition-all duration-500"
    :class="[buttonSizeClasses]"
  >
    <svg
      v-svg
      v-show="playing"
      symbol="pause-circle-filled"
      class="h-full w-full rounded-full text-white-70a transition-colors duration-200 hover:text-white"
      :class="[iconColor]"
    ></svg>
    <svg
      v-svg
      v-show="!playing"
      symbol="play-circle-filled"
      class="h-full w-full rounded-full text-white-70a transition-colors duration-200 hover:text-white"
      :class="[iconColor]"
    ></svg>
  </button>
</template>
