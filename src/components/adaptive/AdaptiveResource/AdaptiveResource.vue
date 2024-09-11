<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue-demi'
import MVAdaptiveItem from '../AdaptiveItem'
import type { Source } from './../../../types/audio'
import MVAdaptivePlayButton from '../AdaptivePlayButton'
import MVAdaptiveProgressBar from '../AdaptiveProgressBar'
import MVAdaptivePlayer from '../AdaptivePlayer'
import MVTrackInfoCard from '../TrackInfoCard'
import { AdaptiveShape } from '../../../types/adaptive'
import { Shape, Size } from '../../../models/adaptive.enums'
import MVAdaptiveVolumeSlider from '../AdaptiveVolumeSlider'
import MVAdaptiveFastForwardButton from '../AdaptiveFastForwardButton'
import MVAdaptiveRewindButton from '../AdaptiveRewindButton'
import MVAdaptiveCollectionButton from '../AdaptiveCollectionButton'
import MVAdaptiveCloseButton from '../AdaptiveCloseButton'
import MVAdaptiveMeditationMixerButton from '../AdaptiveMeditationMixerButton'
import MVAdaptiveSetDurationButton from '../AdaptiveSetDurationButton'
import MVAdaptiveFullScreenButton from '../AdaptiveFullScreenButton'
import MVAdaptivePreviousButton from '../AdaptivePreviousButton'
import MVAdaptiveNextButton from '../AdaptiveNextButton'

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

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}

const handlePreviousClick = () => {
  emitEvent('previous')
}

const handleNextClick = () => {
  emitEvent('next')
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
          :looping-enabled="loopingEnabled"
          @seek="seek"
          :is-playing="state?.playing"
          :size="isFullScreen ? Size.BIG : Size.SMALL"
        />
      </div>

      <!-- Mobile/Tablet -->
      <div class="sm:hidden w-full py-3 px-4 bg-black items-center flex justify-between">
        <div>
          <MVTrackInfoCard
            :title="title"
            :sub-title="artistName"
            :image="posterUrl"
            :shape="trackInfoCoverShape"
          />
        </div>

        <div class="flex items-center justify-center space-x-3">
          <div class="flex items-center" v-if="showSetDuration">
            <MVAdaptiveSetDurationButton @click="handleSetDurationClick" />
          </div>
          <div class="flex items-center" v-if="showMeditationMixer">
            <MVAdaptiveMeditationMixerButton @click="handleMeditationMixerClick" />
          </div>
          <div class="flex items-center">
            <MVAdaptiveCollectionButton @click="handleCollectionClick" />
          </div>
          <div class="flex items-center">
            <MVAdaptivePlayButton @play="play" @pause="pause" :playing="state?.playing" />
          </div>
        </div>
      </div>

      <!-- Desktop -->
      <div class="hidden sm:block">
        <div class="w-full py-3 px-4 bg-black items-center flex justify-between">
          <div>
            <MVTrackInfoCard
              :title="title"
              :sub-title="artistName"
              :image="posterUrl"
              :shape="trackInfoCoverShape"
            />
          </div>
          <div class="flex items-center space-x-6">
            <div v-if="showRewindAndFastForward" class="flex items-center">
              <MVAdaptiveRewindButton @rewind="rewind" />
            </div>
            <div v-if="showPreviousNext" class="flex items-center">
              <MVAdaptivePreviousButton @click="previous" />
            </div>
            <MVAdaptivePlayButton @play="play" @pause="pause" :playing="state?.playing" />
            <div v-if="showPreviousNext" class="flex items-center">
              <MVAdaptiveNextButton @click="next" />
            </div>
            <div v-if="showRewindAndFastForward" class="flex items-center">
              <MVAdaptiveFastForwardButton @fastForward="fastForward" />
            </div>
          </div>
          <div class="flex items-center justify-center space-x-3">
            <div class="flex items-center" v-if="showSetDuration">
              <MVAdaptiveSetDurationButton @click="handleSetDurationClick" />
            </div>
            <div class="flex items-center" v-if="showMeditationMixer">
              <MVAdaptiveMeditationMixerButton @click="handleMeditationMixerClick" />
            </div>
            <div class="flex items-center">
              <MVAdaptiveCollectionButton @click="handleCollectionClick" />
            </div>
            <div>
              <MVAdaptiveVolumeSlider
                :muted="state?.muted"
                @update:volume="setVolume"
                :volume="state?.volume"
              />
            </div>
            <div class="flex items-center">
              <MVAdaptiveFullScreenButton
                :is-full-screen="isFullScreen"
                @click="toggleFullScreen"
              />
            </div>
            <div class="flex items-center">
              <MVAdaptiveCloseButton @click="handleClose" />
            </div>
          </div>
        </div>
      </div>
    </MVAdaptiveItem>
  </MVAdaptivePlayer>
</template>
