<template>
  <div class="flex flex-row gap-x-2 video-controls">
    <button v-if="showPlay" class="video-control-button" @click="togglePlay">
      <svg v-show="playing" v-svg symbol="pause-filled" size="20"></svg>
      <svg v-show="!playing" v-svg symbol="play-filled" size="20"></svg>
    </button>
    <button v-if="showMute" class="video-control-button" @click="toggleMute">
      <svg v-show="mute" v-svg symbol="volume-filled" size="20"></svg>
      <svg v-show="!mute" v-svg symbol="volume-x-filled" size="20"></svg>
    </button>
    <button v-if="showFullScreen" class="video-control-button" @click="handleFullScreen">
      <svg v-svg symbol="maximize-filled" size="20"></svg>
    </button>
    <button v-if="showReplay" class="video-control-button" @click="handleReplay">
      <svg v-svg symbol="rotate-ccw-filled" size="20"></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  playing: {
    type: Boolean,
    default: false
  },
  mute: {
    type: Boolean,
    default: false
  },
  showFullScreen: {
    type: Boolean,
    default: true
  },
  showReplay: {
    type: Boolean,
    default: true
  },
  showPlay: {
    type: Boolean,
    default: true
  },
  showMute: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['play', 'pause', 'mute', 'unmute', 'fullscreen', 'replay'])

const togglePlay = () => {
  if (props.playing) {
    emit('pause')
  } else {
    emit('play')
  }
}

const toggleMute = () => {
  if (props.mute) {
    emit('unmute')
  } else {
    emit('mute')
  }
}

const handleFullScreen = () => {
  emit('fullscreen')
}

const handleReplay = () => {
  emit('replay')
}
</script>

<style lang="scss" scoped>
.video-controls {
  .video-control-button {
    @apply rounded-full bg-black text-white h-9 w-9 flex items-center justify-center;
  }
}
</style>
