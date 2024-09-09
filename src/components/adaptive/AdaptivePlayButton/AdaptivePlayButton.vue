<script setup lang="ts">
import { computed } from 'vue-demi'
import { useDetectBrowser } from './../../../composables/use-detect-browser'
import type { AdaptiveSize } from '../../../types/adaptive'
import { PlayerSize } from '../../../models/adaptive.enums'
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

const buttonSize = computed(() => {
  return props.size === PlayerSize.BIG ? '56px' : '40px'
})
</script>
<template>
  <button
    v-if="!playing"
    v-tooltip="'Play'"
    @click="togglePlay"
    :style="{ width: buttonSize, height: buttonSize }"
  >
    <svg
      v-show="!playing"
      v-svg
      symbol="play-circle-filled"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
  <button
    v-else
    v-tooltip="'Pause'"
    @click="togglePlay"
    :style="{ width: buttonSize, height: buttonSize }"
  >
    <svg
      v-svg
      symbol="pause-circle-filled"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
