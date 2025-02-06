<script setup lang="ts">
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
  <button @click="togglePlay" class="audio-play-button" v-tooltip="playing ? 'Pause' : 'Play'">
    <svg v-show="!playing" v-svg symbol="play-filled" size="30" class="ml-1"></svg>
    <svg v-show="playing" v-svg symbol="pause-filled" size="30" class="mt-1"></svg>
  </button>
</template>
<style scoped>
.audio-play-button {
  @apply relative mx-8 flex h-16 w-16 items-center justify-center rounded-full bg-cool-grey-300 text-black duration-200 ease-in hover:scale-105 hover:bg-white;
}
</style>
