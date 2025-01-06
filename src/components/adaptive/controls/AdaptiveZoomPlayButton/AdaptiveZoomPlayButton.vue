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

const buttonSizeClasses = computed(() => {
  return props.size === Size.BIG
    ? 'w-14 h-14' // 56px for both desktop and mobile/tablet
    : 'w-10 h-10' // 32px for mobile/tablet, 40px for desktop
})
</script>
<template>
  <button
    data-testid="adaptive-zoom-play-button"
    class="outline-none transition-all duration-500"
    :class="[buttonSizeClasses, 'zoom-fade-effect cursor-default']"
  >
    <svg
      v-svg
      v-show="playing"
      symbol="pause-circle-filled"
      class="h-full w-full rounded-full duration-200"
      :class="[iconColor]"
    ></svg>
    <svg
      v-svg
      v-show="!playing"
      symbol="play-circle-filled"
      class="h-full w-full rounded-full duration-200"
      :class="[iconColor]"
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
