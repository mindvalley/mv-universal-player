<template>
  <div class="flex flex-row gap-x-2 mv-video-controls">
    <button
      v-tooltip="playing ? pauseLabel : playLabel"
      v-if="showPlay"
      class="mv-video-control-button group/button"
      @click="togglePlay"
    >
      <svg v-show="playing" v-svg symbol="pause-filled" size="20"></svg>
      <svg v-show="!playing" v-svg symbol="play-filled" size="20"></svg>
    </button>
    <button
      v-tooltip="mute ? unmuteLabel : muteLabel"
      v-if="showMute"
      class="mv-video-control-button group/button"
      @click="toggleMute"
    >
      <svg v-show="mute" v-svg symbol="volume-x-filled" size="20"></svg>
      <svg v-show="!mute" v-svg symbol="volume-2-filled" size="20"></svg>
    </button>
    <button
      v-tooltip="fullscreenLabel"
      v-if="showFullScreen"
      class="mv-video-control-button group/button"
      @click="handleFullScreen"
    >
      <svg v-svg symbol="maximize-filled" size="20"></svg>
    </button>
    <button
      v-tooltip="replayLabel"
      v-if="showReplay"
      class="mv-video-control-button group/button"
      @click="handleReplay"
    >
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
  },
  playLabel: {
    type: String,
    default: 'Play'
  },
  pauseLabel: {
    type: String,
    default: 'Pause'
  },
  muteLabel: {
    type: String,
    default: 'Mute'
  },
  unmuteLabel: {
    type: String,
    default: 'Unmute'
  },
  fullscreenLabel: {
    type: String,
    default: 'Fullscreen'
  },
  replayLabel: {
    type: String,
    default: 'Replay'
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

<style lang="scss">
.mv-video-controls {
  .mv-video-control-button {
    @apply relative rounded-full bg-black text-white bg-opacity-70 text-opacity-80 hover:text-opacity-100 h-9 w-9 flex items-center justify-center;
  }
}
</style>
