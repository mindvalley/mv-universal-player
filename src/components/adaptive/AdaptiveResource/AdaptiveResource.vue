<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue-demi'
import MVAudioItem from '../../audio/AudioItem'
import type { Source } from './../../../types/audio'
import MVAdaptivePlayButton from '../AdaptivePlayButton'
import MVAdaptiveProgressBar from '../AdaptiveProgressBar'

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
    type: [Boolean, String],
    default: false
  },
  showPlaybackSpeed: {
    type: [Boolean, String],
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
  (e: 'meditationMixerClick'): void
  (e: 'collectionClick'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'playtime', { time }: any): void
  (e: any, payload: any): void
}>()

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

console.log('props', props)
</script>

<template>
  <MVAudioItem
    v-slot="{ state, seek, play, pause, rewind, fastForward }"
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
    <div class="w-full">
      <MVAdaptiveProgressBar
        :duration="duration"
        class="text-white"
        :current-time="state?.currentTime"
        @seek="seek"
      />
    </div>
    <div class="w-full h-20 bg-black items-center flex justify-center">
      <div><MVAdaptivePlayButton @play="play" @pause="pause" :playing="state?.playing" /></div>
    </div>
  </MVAudioItem>
</template>
