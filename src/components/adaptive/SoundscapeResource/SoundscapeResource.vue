<script setup lang="ts">
import MVAdaptiveResource from '../AdaptiveResource'
import type { Source } from './../../../types/audio'
import { Shape } from '../../../models/adaptive.enums'
import MVAdaptiveDurationSelector from '../AdaptiveDurationSelector'
import { ref } from 'vue-demi'
import MVAdaptiveOverlay from '../AdaptiveOverlay'

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
  showPreviousNext: {
    type: Boolean,
    default: false
  },
  loopingEnabled: {
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
  (e: 'collectionOpen'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'playtime', { time }: any): void
  (e: 'playbackSpeedChange', { playbackSpeed }: any): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: any, payload: any): void
}>()

const localLoopingEnabled = ref(props.loopingEnabled)
const localDuration = ref(props.duration)
const showDurationSelector = ref(false)
const showOverlay = ref(false)

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

const handleNewTime = (duration: number) => {
  // emit('newTime', duration)
}

const handleForever = () => {
  localLoopingEnabled.value = true
}

const toggleDurationSelector = () => {
  showDurationSelector.value = !showDurationSelector.value
}

const handleCloseDurationSelector = () => {
  showDurationSelector.value = false
}
</script>

<template>
  <div>
    <button class="bg-yellow-400">Click me</button>

    <MVAdaptiveOverlay :show="showDurationSelector" @close="handleCloseDurationSelector">
      <MVAdaptiveDurationSelector
        :duration="localDuration"
        :is-looping="localLoopingEnabled"
        @new-time="handleNewTime"
        @forever="handleForever"
        @close="handleCloseDurationSelector"
      />
    </MVAdaptiveOverlay>

    <!-- Adaptive Resource -->
    <div class="fixed bottom-0 right-0 w-full z-30 bg-yellow-200">
      <MVAdaptiveResource
        :id="id"
        :audio-sources="audioSources"
        :duration="localDuration"
        :poster-url="posterUrl"
        :title="title"
        :artist-name="artistName"
        :looping-enabled="localLoopingEnabled"
        show-set-duration
        :track-info-cover-shape="Shape.SQUARE"
        :show-previous-next="showPreviousNext"
        @close="handleClose"
        @collection-open="handleCollectionOpen"
        @previous="handlePrevious"
        @next="handleNext"
        @set-duration="toggleDurationSelector"
      />
    </div>
  </div>
</template>
