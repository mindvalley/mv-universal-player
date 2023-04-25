<script setup lang="ts">
import { useDetectBrowser } from './../../../composables/use-detect-browser'
const { isTouchDevice } = useDetectBrowser()
const props = defineProps({
  playing: {
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
</script>
<template>
  <button @click="togglePlay" class="audio-item">
    <svg v-show="!playing" v-svg symbol="play-filled" size="30" class="ml-1"></svg>
    <svg v-show="playing" v-svg symbol="pause-filled" size="30" class="mt-1"></svg>
    <div
      class="absolute -top-2 hidden w-max -translate-y-full animate-fade rounded bg-black px-3 py-1 text-center text-sm text-cool-grey-400 after:absolute after:left-1/2 after:top-[90%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-cool-grey-700 after:content-[''] group-hover:flex"
      v-if="!isTouchDevice"
    >
      <span v-if="playing">Pause</span>
      <span v-else>Play</span>
    </div>
  </button>
</template>
<style scoped>
.audio-item {
  @apply relative mx-8 flex h-16 w-16 items-center justify-center rounded-full bg-cool-grey-300 text-black duration-200 ease-in hover:scale-105 hover:bg-white;
}
</style>
