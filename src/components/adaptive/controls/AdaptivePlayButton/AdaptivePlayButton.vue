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
  showTooltip: {
    type: Boolean,
    default: true
  },
  showHoverEffect: {
    type: Boolean,
    default: true
  },
  iconColor: {
    type: String,
    default: 'text-white-70a'
  },
  isZooming: {
    type: Boolean,
    default: false
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
    : 'w-8 h-8 xl:w-10 xl:h-10' // 32px for mobile/tablet, 40px for desktop
})
</script>
<template>
  <button
    data-testid="adaptive-play-button"
    v-tooltip="showTooltip ? (playing ? 'Pause' : 'Play') : ''"
    @click="togglePlay"
    class="outline-none"
    :class="[buttonSizeClasses, { 'zoom-fade-effect cursor-default': isZooming }]"
  >
    <svg
      v-svg
      :symbol="playing ? 'pause-circle-filled' : 'play-circle-filled'"
      class="h-full w-full rounded-full text-white-70a transition-colors duration-200"
      :class="[iconColor, { 'hover:text-white': showHoverEffect }]"
    ></svg>
  </button>
</template>

<style scoped>
@keyframes zoom-fade {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.zoom-fade-effect {
  animation: zoom-fade 1s ease-out forwards;
}
</style>
