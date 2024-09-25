<script setup lang="ts">
import { Size } from '../../../models/adaptive.enums'
import MVAdaptiveProgressBar from '../AdaptiveProgressBar'
import MVAdaptivePlayButton from '../AdaptivePlayButton'
import MVAdaptivePreviousButton from '../AdaptivePreviousButton'
import MVAdaptiveNextButton from '../AdaptiveNextButton'
import MVAdaptiveFastForwardButton from '../AdaptiveFastForwardButton'
import MVAdaptiveRewindButton from '../AdaptiveRewindButton'
import MVAdaptiveSetDurationButton from '../AdaptiveSetDurationButton'
import MVAdaptiveMeditationMixerButton from '../AdaptiveMeditationMixerButton'
import MVAdaptiveCollectionButton from '../AdaptiveCollectionButton'
import MVAdaptiveVolumeSlider from '../AdaptiveVolumeSlider'
import MVAdaptiveFullScreenButton from '../AdaptiveFullScreenButton'
import MVAdaptiveCloseButton from '../AdaptiveCloseButton'
import MVAdaptiveTrackInfoCard from '../AdaptiveTrackInfoCard'
import MVAdaptiveImmersiveButton from '../AdaptiveImmersiveButton'
import type { AdaptiveSize } from '../../../types/adaptive'

const props = defineProps({
  isPlaying: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  trackInfoCoverShape: {
    type: String as () => AdaptiveSize,
    default: 'round'
  },
  volume: {
    type: Number,
    default: 0.5
  },
  isFullScreen: {
    type: Boolean,
    default: false
  },
  isImmersive: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0
  },
  progressBarCurrentTime: {
    type: Number,
    default: 0
  },
  loopingEnabled: {
    type: Boolean,
    default: false
  },
  showRewindAndFastForward: {
    type: Boolean,
    default: false
  },
  showPreviousNext: {
    type: Boolean,
    default: false
  },
  showSetDuration: {
    type: Boolean,
    default: false
  },
  showMeditationMixer: {
    type: Boolean,
    default: false
  },
  showCollection: {
    type: Boolean,
    default: false
  },
  showImmersive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'rewind', seconds: number): void
  (e: 'fastForward', seconds: number): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'setDuration'): void
  (e: 'setVolume', volume: number): void
  (e: 'meditationMixer'): void
  (e: 'collection'): void
  (e: 'close'): void
  (e: 'seek', time: number): void
  (e: 'toggleFullScreen'): void
  (e: 'toggleImmersive'): void
}>()

const handlePlay = () => {
  emit('play')
}

const handlePause = () => {
  emit('pause')
}

const handleRewind = (seconds: number) => {
  emit('rewind', seconds)
}

const handleFastForward = (seconds: number) => {
  emit('fastForward', seconds)
}

const handlePrevious = () => {
  emit('previous')
}

const handleNext = () => {
  emit('next')
}

const handleSetVolume = (volume: number) => {
  emit('setVolume', volume)
}

const handleClose = () => {
  emit('close')
}

const hanldeSeek = (time: number) => {
  emit('seek', time)
}

const handleSetDurationClick = () => {
  emit('setDuration')
}

const handleMeditationMixerClick = () => {
  emit('meditationMixer')
}

const handleCollectionClick = () => {
  emit('collection')
}

const toggleFullScreen = () => {
  emit('toggleFullScreen')
}

const handleImmersiveClick = () => {
  emit('toggleImmersive')
}
</script>

<template>
  <div>
    <div v-if="isFullScreen" class="flex items-center mb-4">
      <MVTrackInfoCard
        :title="title"
        :sub-title="artistName"
        :image="posterUrl"
        :shape="trackInfoCoverShape"
        :size="Size.BIG"
      >
        <template #control>
          <MVAdaptiveSetDurationButton
            v-if="showSetDuration"
            is-text
            @click="handleSetDurationClick"
          />
        </template>
      </MVTrackInfoCard>
    </div>
    <div class="w-full">
      <MVAdaptiveProgressBar
        :duration="duration"
        class="text-white"
        :current-time="progressBarCurrentTime"
        :looping-enabled="loopingEnabled"
        @seek="hanldeSeek"
        :is-playing="isPlaying"
        :size="isFullScreen ? Size.BIG : Size.SMALL"
      />
    </div>

    <!-- Mobile/Tablet -->
    <div
      class="sm:hidden w-full py-3 items-center flex justify-between"
      :class="[isFullScreen ? 'px-0' : 'px-4']"
    >
      <div>
        <MVTrackInfoCard
          v-if="!isFullScreen"
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
          <MVAdaptivePlayButton @play="handlePlay" @pause="handlePause" :playing="isPlaying" />
        </div>
      </div>
    </div>

    <!-- Desktop -->
    <div class="hidden sm:block">
      <div
        class="w-full py-3 items-center flex justify-between"
        :class="[isFullScreen ? 'px-0' : 'px-4']"
      >
        <!-- Left column -->
        <div class="flex-1 flex items-center min-w-28 sm:min-w-48">
          <MVAdaptiveTrackInfoCard
            v-if="!isFullScreen"
            :title="title"
            :sub-title="artistName"
            :image="posterUrl"
            :shape="trackInfoCoverShape"
          />
        </div>

        <!-- Center column (always centered) -->
        <div class="flex-1 flex items-center justify-center">
          <div class="flex items-center space-x-6">
            <div v-if="showRewindAndFastForward" class="flex items-center">
              <MVAdaptiveRewindButton @rewind="handleRewind" />
            </div>
            <div v-if="showPreviousNext" class="flex items-center">
              <MVAdaptivePreviousButton @click="handlePrevious" />
            </div>
            <MVAdaptivePlayButton @play="handlePlay" @pause="handlePause" :playing="isPlaying" />
            <div v-if="showPreviousNext" class="flex items-center">
              <MVAdaptiveNextButton @click="handleNext" />
            </div>
            <div v-if="showRewindAndFastForward" class="flex items-center">
              <MVAdaptiveFastForwardButton @fastForward="handleFastForward" />
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="flex-1 flex items-center justify-end space-x-3">
          <div class="flex items-center" v-if="showImmersive && isFullScreen">
            <MVAdaptiveImmersiveButton :is-immersive="isImmersive" @click="handleImmersiveClick" />
          </div>
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
            <MVAdaptiveVolumeSlider @update:volume="handleSetVolume" :volume="volume" />
          </div>
          <div class="flex items-center">
            <MVAdaptiveFullScreenButton
              :is-full-screen="isFullScreen"
              @toggleFullScreen="toggleFullScreen"
            />
          </div>
          <div v-if="!isFullScreen" class="flex items-center">
            <MVAdaptiveCloseButton @click="handleClose" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
