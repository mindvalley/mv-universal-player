<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue-demi'
import type { Source } from './../../../../types/audio'
import { Shape } from './../../../../models/adaptive.enums'
import { MVAdaptiveResource } from '../'
import { MVAdaptiveDurationSelector } from '../../duration'
import { MVAdaptiveOverlay } from '../../layers'
import { MVAdaptiveAboutThisInfo } from '../../info'
import { MVAdaptiveAboutThisInfoSetDurationButton } from '../../info/AdaptiveAboutThisInfo/AdaptiveAboutThisInfoSetDurationButton'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  audioSources: {
    type: Array<Source>,
    default: () => [],
    required: true
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
  posterUrl: {
    type: String,
    default: ''
  },
  backgroundPosterUrl: {
    type: String,
    default: ''
  },
  showCollection: {
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
  (e: 'error', payload: any): void
  (e: 'playtime', { time }: any): void
  (e: 'close'): void
  (e: 'collectionOpen'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'muted', { muted }: any): void
  (e: 'setDuration', { seconds }: any): void
  (e: any, payload: any): void
}>()

const fullscreenElement = ref<HTMLElement | null>(null)
const adaptiveResource = ref(null)
const localLoopingEnabled = ref(true)
const localDuration = ref(240) // 4 minutes
const showDurationSelector = ref(false)
const showAboutThisInfo = ref(false)

const elapsedTime = ref(0)
const timerInterval = ref<number | null>(null)
const localCurrentTime = ref(0)
const mainSoundVolume = ref(1)

onMounted(() => {
  if (props.autoPlay) {
    setTimeout(() => {
      adaptiveResource.value?.play()
    }, 0)
  }
})

const handleSetVolume = ({ volume }: { id: string; volume: number }) => {
  mainSoundVolume.value = volume
}

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
  emitEvent('play', { currentTime: Number(localCurrentTime.value.toFixed(2)) })
}

const stopSound = () => {
  adaptiveResource.value?.player?.player?.pause()
  adaptiveResource.value?.resetPlayerTimer()
  handleEnded()
}

const handlePause = () => {
  pauseTimer()
  emitEvent('pause', { currentTime: Number(localCurrentTime.value.toFixed(2)) })
}

onUnmounted(() => {
  pauseTimer()
})

const handlePrevious = () => {
  emitEvent('previous')
}

const handleNext = () => {
  emitEvent('next')
}

const handleSetNewTime = (duration: number) => {
  if (duration > 0) {
    adaptiveResource.value?.restartPlayerTimer()
    localDuration.value = duration
    localLoopingEnabled.value = false
    toggleDurationSelector()

    if (adaptiveResource.value?.player?.state.playing) {
      startTimer()
    }

    emitEvent('setDuration', { seconds: duration })
  }
}

const handleStayForever = () => {
  adaptiveResource.value?.restartPlayerTimer()
  localLoopingEnabled.value = true
  stopTimer()
  toggleDurationSelector()
  emitEvent('setDuration', { seconds: 0 })
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
  emitEvent('timeupdate', { currentTime: Number(localCurrentTime.value.toFixed(2)) })
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
  emitEvent('seeking', { seeking: Number(time.toFixed(2)) })
}

const handleEnded = () => {
  emitEvent('ended', { currentTime: Number(localCurrentTime.value.toFixed(2)) })
}

const handleMuted = ({ muted }: { id: string; muted: boolean }) => {
  emitEvent('muted', { muted: muted })
}

const handleClose = () => {
  emitEvent('close')
}

const handleCollectionOpen = () => {
  emitEvent('collectionOpen')
}

const handlePlaytime = ({ time }: any) => {
  emitEvent('playtime', { time })
}

const handleFullscreen = ({ isFullscreen }: any) => {
  if (isFullscreen) {
    adaptiveResource.value?.player?.player?.setAudioOnlyMode(false)
    emitEvent('maximize')
  } else {
    adaptiveResource.value?.player?.player?.setAudioOnlyMode(true)
    emitEvent('minimize')
  }
}

const toggleAboutThisInfo = () => {
  showDurationSelector.value = false
  showAboutThisInfo.value = !showAboutThisInfo.value
}

const handleError = (event: any) => {
  emitEvent('error', event)
}

const emitEvent = (eventName: string, payload?: any) => {
  const data = { id: props.id, ...payload }
  emit(eventName, data)
}
</script>

<template>
  <div data-testid="soundscape-resource" ref="fullscreenElement">
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

    <MVAdaptiveResource
      ref="adaptiveResource"
      :id="id"
      :before-fade-volume="mainSoundVolume"
      :fullscreen-element="fullscreenElement"
      :auto-play="autoPlay"
      :audio-sources="audioSources"
      :video-sources="videoSources"
      :duration="localDuration"
      :poster-url="posterUrl"
      :background-poster-url="backgroundPosterUrl"
      :title="title"
      :artist-name="artistName"
      :looping-enabled="localLoopingEnabled"
      show-set-duration
      show-immersive
      :show-collection="showCollection"
      :track-info-cover-shape="Shape.ROUND"
      :show-previous-next="showPreviousNext"
      :progress-bar-current-time="localCurrentTime"
      :override-progress-bar-current-time="!localLoopingEnabled"
      :now-playing-title="nowPlayingTitle"
      :now-playing-subtitle="nowPlayingSubtitle"
      @set-volume="handleSetVolume"
      @track-info-title-click="toggleAboutThisInfo"
      @track-info-image-click="toggleAboutThisInfo"
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
      @muted="handleMuted"
      @error="handleError"
      @playtime="handlePlaytime"
    />
  </div>
</template>
