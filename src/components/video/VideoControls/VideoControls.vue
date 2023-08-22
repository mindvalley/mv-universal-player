<template>
  <div class="flex flex-row gap-x-2 video-controls">
    <button v-if="showPlay" class="video-control-button group" @click="togglePlay">
      <svg v-show="playing" v-svg symbol="pause-filled" size="20"></svg>
      <svg v-show="!playing" v-svg symbol="play-filled" size="20"></svg>
      <Transition>
        <span class="tooltip-text group-hover:block" v-if="!isTouchDevice"
          >{{ playing ? pauseLabel : playLabel }}
        </span>
      </Transition>
    </button>
    <button v-if="showMute" class="video-control-button group" @click="toggleMute">
      <svg v-show="mute" v-svg symbol="volume-2-filled" size="20"></svg>
      <svg v-show="!mute" v-svg symbol="volume-x-filled" size="20"></svg>
      <Transition>
        <span class="tooltip-text group-hover:block" v-if="!isTouchDevice"
          >{{ mute ? unmuteLabel : muteLabel }}
        </span>
      </Transition>
    </button>
    <button v-if="showFullScreen" class="video-control-button group" @click="handleFullScreen">
      <svg v-svg symbol="maximize-filled" size="20"></svg>
      <Transition>
        <span class="tooltip-text group-hover:block" v-if="!isTouchDevice"
          >{{ fullscreenLabel }}
        </span>
      </Transition>
    </button>
    <button v-if="showReplay" class="video-control-button group" @click="handleReplay">
      <svg v-svg symbol="rotate-ccw-filled" size="20"></svg>
      <Transition>
        <span class="tooltip-text group-hover:block" v-if="!isTouchDevice">{{ replayLabel }} </span>
      </Transition>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDetectBrowser } from '../../../composables/use-detect-browser'

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
const { isTouchDevice } = useDetectBrowser()

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
    @apply relative rounded-full bg-black text-white bg-opacity-70 text-opacity-80 hover:text-opacity-100 h-9 w-9 flex items-center justify-center;

    .tooltip-text {
      @apply absolute -top-1 hidden -translate-y-full animate-fade rounded bg-black px-3 py-1 text-center text-sm text-cool-grey-400 after:absolute after:left-1/2 after:top-[90%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-cool-grey-700 after:content-[''];
    }
  }
}
</style>
