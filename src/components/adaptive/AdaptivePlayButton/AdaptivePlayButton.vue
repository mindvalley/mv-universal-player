<script setup lang="ts">
import { computed } from 'vue-demi'
import { useDetectBrowser } from './../../../composables/use-detect-browser'
const { isTouchDevice } = useDetectBrowser()
const props = defineProps({
  playing: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as () => 'BIG' | 'SMALL',
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
  return props.size === 'BIG' ? '56px' : '40px'
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
      class="h-full w-full text-[#ABABA6]"
    ></svg>
  </button>
  <button
    v-else
    v-tooltip="Pause"
    @click="togglePlay"
    :style="{ width: buttonSize, height: buttonSize }"
  >
    <svg v-svg symbol="pause-filled" class="h-full w-full text-cool-grey-250"></svg>
  </button>
</template>
