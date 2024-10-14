<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue-demi'
import type { Source } from './../../../types/audio'
import { Shape } from '../../../models/adaptive.enums'
import MVAdaptiveResource from '../AdaptiveResource'
import MVAdaptiveDurationSelector from '../AdaptiveDurationSelector'
import MVAdaptiveOverlay from '../AdaptiveOverlay'
import MVAdaptiveAboutThisInfo from '../AdaptiveAboutThisInfo'
import MVAdaptiveAboutThisInfoSetDurationButton from '../AdaptiveAboutThisInfo/AdaptiveAboutThisInfoSetDurationButton'

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
    type: Array<Source>,
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
  showCollections: {
    type: Boolean,
    default: false
  },
  showPlaybackSpeed: {
    type: Boolean,
    default: false
  },
  showPreviousNext: {
    type: Boolean,
    default: false
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  nowPlayingTitle: {
    type: String,
    default: 'NOW PLAYING'
  },
  nowPlayingSubtitle: {
    type: String,
    default: 'Soundscape'
  },
  description: {
    type: String,
    default: ''
  },
  ratings: {
    type: Number,
    default: 0
  },
  tags: {
    type: Array<string>,
    default: () => []
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
  (e: 'error', payload: any): void
  (e: 'playtime', { time }: any): void
  (e: 'bookmark'): void
  (e: 'close'): void
  (e: 'collectionOpen'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'playtime', { time }: any): void
  (e: 'playbackSpeedChange', { playbackSpeed }: any): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: any, payload: any): void
}>()

const adaptiveResource = ref(null)
const localLoopingEnabled = ref(true)
const localDuration = ref(240) // 4 minutes
const showDurationSelector = ref(false)
const isFullScreenEnabled = ref(false)
const showAboutThisInfo = ref(false)

const elapsedTime = ref(0)
const timerInterval = ref<number | null>(null)
const localCurrentTime = ref(0)

onMounted(() => {
  if (props.autoPlay) {
    adaptiveResource.value?.player?.player?.play()
  }
})

// This is for custom progress bar duration calculation.
const startTimer = () => {
  if (timerInterval.value === null) {
    timerInterval.value = setInterval(() => {
      elapsedTime.value += 1
      if (localDuration.value && elapsedTime.value >= localDuration.value) {
        stopSound()
        stopTimer()
      }
    }, 1000) as unknown as number
  }
}

const pauseTimer = () => {
  if (timerInterval.value !== null) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const resetTimer = () => {
  pauseTimer()
  elapsedTime.value = 0
}

const stopTimer = () => {
  pauseTimer()
  resetTimer()
}

const handlePlay = () => {
  if (!localLoopingEnabled.value) {
    startTimer()
  }
  emitEvent('play', { currentTime: localCurrentTime.value })
}

const stopSound = () => {
  adaptiveResource.value?.player?.player?.pause()
  handleEnded()
}

const handlePause = () => {
  pauseTimer()
  emitEvent('pause', { currentTime: localCurrentTime.value })
}

onUnmounted(() => {
  pauseTimer()
})

const handleClose = () => {
  emit('close')
}

const handleCollectionOpen = () => {
  emit('collectionOpen')
}

const handlePrevious = () => {
  emit('previous')
}

const handleNext = () => {
  emit('next')
}

const handleSetNewTime = (duration: number) => {
  if (duration > 0) {
    localDuration.value = duration
    localLoopingEnabled.value = false
    toggleDurationSelector()

    if (adaptiveResource.value?.player?.state.playing) {
      startTimer()
    }
  }
}

const handleStayForever = () => {
  localLoopingEnabled.value = true
  stopTimer()
  toggleDurationSelector()
}

const toggleDurationSelector = () => {
  showAboutThisInfo.value = false
  showDurationSelector.value = !showDurationSelector.value
}

const handleCloseDurationSelector = () => {
  showDurationSelector.value = false
}

const handleTimeUpdate = ({ currentTime }: any) => {
  if (!localLoopingEnabled.value) {
    localCurrentTime.value = Number(elapsedTime.value)
  } else {
    localCurrentTime.value = Number(currentTime)
  }
  emitEvent('timeupdate', { currentTime: localCurrentTime.value.toFixed(2) })
}

const handleSeek = ({ time }: any) => {
  let localSeekingTime = 0

  if (!localLoopingEnabled.value) {
    localSeekingTime = time === 0 ? 0 : localDuration.value % time
  } else {
    localSeekingTime = time
  }

  // We are setting the actual audio time and not what user sees on the progress bar. Because most of the times, the audio duration is less than what the user has manually set in case of loop scenario.
  adaptiveResource.value?.player?.player?.seek(localSeekingTime)
  elapsedTime.value = Number(time)
  emitEvent('seeking', { seeking: time.toFixed(2) })
}

const handleEnded = () => {
  emit('ended', { currentTime: localCurrentTime.value })
}

const handleFullscreen = ({ isFullScreen }: any) => {
  isFullScreenEnabled.value = isFullScreen

  if (isFullScreen) {
    adaptiveResource.value?.player?.player?.setAudioOnlyMode(false)
  } else {
    adaptiveResource.value?.player?.player?.setAudioOnlyMode(true)
  }
}

const toggleAboutThisInfo = () => {
  showDurationSelector.value = false
  showAboutThisInfo.value = !showAboutThisInfo.value
}

const emitEvent = (eventName: string, payload?: any) => {
  const data = { id: props.id, ...payload }
  emit(eventName, data)
}
</script>

<template>
  <div :class="{ 'fixed left-0 bottom-0 top-0 right-0': isFullScreenEnabled }">
    <MVAdaptiveOverlay :show="showDurationSelector" @close="handleCloseDurationSelector">
      <MVAdaptiveDurationSelector
        :duration="localDuration"
        :is-looping="localLoopingEnabled"
        @new-time="handleSetNewTime"
        @forever="handleStayForever"
        @close="handleCloseDurationSelector"
      />
    </MVAdaptiveOverlay>

    <MVAdaptiveOverlay :show="showAboutThisInfo" @close="toggleAboutThisInfo">
      <MVAdaptiveAboutThisInfo
        header-title="About this soundscape"
        :title="title"
        :artist-name="artistName"
        :image="posterUrl"
        :description="description"
        :ratings="ratings"
        :tags="tags"
        :shape="Shape.ROUND"
        @close="toggleAboutThisInfo"
      >
        <template #control>
          <MVAdaptiveAboutThisInfoSetDurationButton @click="toggleDurationSelector" />
        </template>
      </MVAdaptiveAboutThisInfo>
    </MVAdaptiveOverlay>

    <!-- Adaptive Resource -->
    <div class="h-full w-full">
      <MVAdaptiveResource
        ref="adaptiveResource"
        :id="id"
        :auto-play="autoPlay"
        :audio-sources="audioSources"
        :video-sources="videoSources"
        :duration="localDuration"
        :poster-url="posterUrl"
        :title="title"
        :artist-name="artistName"
        :looping-enabled="localLoopingEnabled"
        show-set-duration
        show-immersive
        :track-info-cover-shape="Shape.ROUND"
        :show-previous-next="showPreviousNext"
        :progress-bar-current-time="localCurrentTime"
        :override-progress-bar-current-time="!localLoopingEnabled"
        :now-playing-title="nowPlayingTitle"
        :now-playing-subtitle="nowPlayingSubtitle"
        @track-info-title-click="toggleAboutThisInfo"
        @close="handleClose"
        @collection-open="handleCollectionOpen"
        @previous="handlePrevious"
        @next="handleNext"
        @set-duration="toggleDurationSelector"
        @timeupdate="handleTimeUpdate"
        @play="handlePlay"
        @pause="handlePause"
        @seek="handleSeek"
        @ended="handleEnded"
        @fullscreen="handleFullscreen"
      />
    </div>
  </div>
</template>
