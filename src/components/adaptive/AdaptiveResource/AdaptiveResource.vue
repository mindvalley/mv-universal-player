<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from 'vue-demi'
import MVAdaptiveItem from '../AdaptiveItem'
import type { Source } from './../../../types/audio'
import MVAdaptivePlayer from '../AdaptivePlayer'
import { AdaptiveShape } from '../../../types/adaptive'
import { Shape, Size } from '../../../models/adaptive.enums'
import MVAdaptivePlayerBar from '../AdaptivePlayerBar'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  audioSources: {
    type: Array<Source>,
    default: () => []
  },
  videoSources: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    default: ''
  },
  showBookmark: {
    type: Boolean,
    default: false
  },
  posterUrl: {
    type: String,
    default: ''
  },
  showMeditationMixer: {
    type: Boolean,
    default: false
  },
  showImmersive: {
    type: Boolean,
    default: false
  },
  showCollections: {
    type: Boolean,
    default: false
  },
  duration: {
    required: true,
    type: Number
  },
  showSetDuration: {
    type: Boolean,
    default: false
  },
  showPlaybackSpeed: {
    type: Boolean,
    String,
    default: false
  },
  loopingEnabled: {
    type: Boolean,
    default: false
  },
  trackInfoCoverShape: {
    type: String as () => AdaptiveShape,
    default: Shape.ROUND
  },
  showRewindAndFastForward: {
    type: Boolean,
    default: false
  },
  showPreviousNext: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'timeupdate', { currentTime }: any): void
  (e: 'play', { currentTime }: any): void
  (e: 'pause', { currentTime }: any): void
  (e: 'seeking', { seeking }: any): void
  (e: 'ended', { currentTime }: any): void
  (e: 'rewind', { previousTime, currentTime }: any): void
  (e: 'fastforward', { previousTime, currentTime }: any): void
  (e: 'reset', { currentTime }: any): void
  (e: 'error', payload: any): void
  (e: 'playtime', { time }: any): void
  (e: 'bookmark'): void
  (e: 'close'): void
  (e: 'meditationMixerOpen'): void
  (e: 'collectionOpen'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'playtime', { time }: any): void
  (e: 'collection'): void
  (e: 'close'): void
  (e: any, payload: any): void
}>()

const isFullScreen = ref(false)
const isTransitioning = ref(false)

const toggleFullScreen = () => {
  isTransitioning.value = true
  isFullScreen.value = !isFullScreen.value
  setTimeout(() => {
    isTransitioning.value = false
  }, 300) // Match this with your transition duration
}

const fullScreenClass = computed(() => {
  return isFullScreen.value || isTransitioning.value ? 'fixed inset-0 z-50 bg-black' : ''
})

const emitEvent = (eventName: string, payload?: any) => {
  const data = { assetId: props.id, ...payload }
  emit(eventName, data)
}

const playTime = ref(0) // Total time media has been played in seconds
const playTimerInterval = ref<ReturnType<typeof setInterval> | null>(null)

watch(
  () => playTime.value,
  (newPlayTime) => {
    if (newPlayTime !== 0) {
      emit('playtime', { time: newPlayTime })
    }
  }
)

const startPlayerTimer = () => {
  if (playTimerInterval.value === null) {
    playTimerInterval.value = setInterval(() => {
      playTime.value += 1
    }, 1000) // Increment every second
  }
}

const pausePlayerTimer = () => {
  if (playTimerInterval.value !== null) {
    clearInterval(playTimerInterval.value)
    playTimerInterval.value = null
  }
}

const resetPlayerTimer = () => {
  pausePlayerTimer()
  playTime.value = 0
}

const handleEnded = (event: any) => {
  resetPlayerTimer()
  emitEvent('ended', event)
}

const handlePlay = (event: any) => {
  emitEvent('play', event)
  startPlayerTimer()
}

const handlePause = (event: any) => {
  emitEvent('pause', event)
  pausePlayerTimer()
}

const handleCollectionClick = () => {
  emitEvent('collection-open')
}

const handleMeditationMixerClick = () => {
  emitEvent('meditationMixerOpen')
}

const handleClose = () => {
  emitEvent('close')
}

const handlePreviousClick = () => {
  emitEvent('previous')
}

const handleNextClick = () => {
  emitEvent('next')
}

const handleSetDurationClick = () => {
  emitEvent('setDuration')
}
</script>

<template>
  <MVAdaptivePlayer :loop="loopingEnabled">
    <MVAdaptiveItem
      v-slot="{ state, seek, play, pause, rewind, fastForward, setVolume }"
      :sources="audioSources"
      :id="id"
      @play="handlePlay"
      @pause="handlePause"
      @seeking="emitEvent('seeking', $event)"
      @ended="handleEnded"
      @rewind="emitEvent('rewind', $event)"
      @fastforward="emitEvent('fastforward', $event)"
      @playbackSpeed="emitEvent('playbackSpeed', $event)"
      @timeupdate="emitEvent('timeupdate', $event)"
      @reset="emitEvent('reset', $event)"
      @error="emitEvent('error', $event)"
    >
      <div
        :class="[
          fullScreenClass,
          'transition-all duration-300 ease-in-out',
          isFullScreen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        ]"
        data-testid="adaptive-full-screen-player"
      >
        <img
          v-if="isFullScreen || isTransitioning"
          :src="posterUrl"
          class="w-full h-full object-cover"
          alt="Full-screen background"
        />
      </div>
      <div
        data-testid="adaptive-mini-player"
        :class="[
          'transition-all duration-300 ease-in-out',
          isFullScreen
            ? 'fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-black-70a to-transparent px-10'
            : 'bg-black'
        ]"
      >
        <MVAdaptivePlayerBar
          :is-playing="state?.playing"
          :title="title"
          :artist-name="artistName"
          :poster-url="posterUrl"
          :track-info-cover-shape="trackInfoCoverShape"
          :volume="state?.volume"
          :duration="duration"
          :current-time="state?.currentTime"
          :is-full-screen="isFullScreen"
          :looping-enabled="loopingEnabled"
          :show-rewind-and-fast-forward="showRewindAndFastForward"
          :show-previous-next="showPreviousNext"
          :show-set-duration="showSetDuration"
          :show-playback-speed="showPlaybackSpeed"
          :show-meditation-mixer="showMeditationMixer"
          :show-collections="showCollections"
          @pause="pause"
          @play="play"
          @rewind="rewind"
          @fastForward="fastForward"
          @seek="seek"
          @previous="handlePreviousClick"
          @next="handleNextClick"
          @setVolume="setVolume"
          @close="handleClose"
          @collection="handleCollectionClick"
          @meditationMixer="handleMeditationMixerClick"
          @setDuration="handleSetDurationClick"
          @toggleFullScreen="toggleFullScreen"
        />
      </div>
    </MVAdaptiveItem>
  </MVAdaptivePlayer>
</template>

<style scoped>
.bg-gradient-to-t {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
}
</style>
