<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue-demi'
import MVAdaptiveItem from '../AdaptiveItem'
import type { Source } from './../../../types/audio'
import MVAdaptivePlayButton from '../AdaptivePlayButton'
import MVAdaptiveProgressBar from '../AdaptiveProgressBar'
import MVAdaptivePlayer from '../AdaptivePlayer'
import MVTrackInfoCard from '../TrackInfoCard'
import { AdaptiveShape } from '../../../types/adaptive'
import { Shape } from '../../../models/adaptive.enums'
import MVAdaptiveVolumeSlider from '../AdaptiveVolumeSlider'
import MVAdaptiveFastForwardButton from '../AdaptiveFastForwardButton'
import MVAdaptiveRewindButton from '../AdaptiveRewindButton'
import MVAdaptiveCollectionButton from '../AdaptiveCollectionButton'

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
  },
  loopingEnabled: {
    type: Boolean,
    default: false
  },
  trackInfoCoverShape: {
    type: String as () => AdaptiveShape,
    default: Shape.ROUND
  },
  showRewindButton: {
    type: Boolean,
    default: false
  },
  showFastForwardButton: {
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
  (e: 'meditationMixerClick'): void
  (e: 'collectionClick'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'playtime', { time }: any): void
  (e: 'collection'): void
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

const handleCollectionOpen = () => {
  emitEvent('collection')
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
      <div class="w-full">
        <MVAdaptiveProgressBar
          :duration="duration"
          class="text-white"
          :current-time="state?.currentTime"
          @seek="seek"
          :is-playing="state?.playing"
        />
      </div>
      <div class="w-full py-3 px-4 bg-black items-center flex justify-between">
        <div>
          <MVTrackInfoCard
            :title="title"
            :sub-title="artistName"
            :image="posterUrl"
            :shape="trackInfoCoverShape"
          />
        </div>
        <div class="flex items-center">
          <div class="flex items-center mr-6">
            <MVAdaptiveRewindButton @rewind="rewind" />
          </div>
          <MVAdaptivePlayButton @play="play" @pause="pause" :playing="state?.playing" />
          <div class="flex items-center ml-6">
            <MVAdaptiveFastForwardButton @fastForward="fastForward" />
          </div>
        </div>
        <div class="flex items-center justify-center">
          <div class="flex items-center mr-3">
            <MVAdaptiveCollectionButton @click="handleCollectionOpen" />
          </div>
          <MVAdaptiveVolumeSlider
            :muted="state?.muted"
            @update:volume="setVolume"
            :volume="state?.volume"
          />
        </div>
      </div>
    </MVAdaptiveItem>
  </MVAdaptivePlayer>
</template>
