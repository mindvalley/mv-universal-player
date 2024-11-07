<script setup lang="ts">
import { Size } from '../../../../models/adaptive.enums'
import { MVAdaptiveProgressBar } from '../../controls'
import {
  MVAdaptivePreviousButton,
  MVAdaptiveImmersiveButton,
  MVAdaptiveCloseButton,
  MVAdaptiveCollectionButton,
  MVAdaptivePlayButton,
  MVAdaptiveSetDurationButton,
  MVAdaptiveNextButton,
  MVAdaptiveFastForwardButton,
  MVAdaptiveRewindButton,
  MVAdaptiveMeditationMixerButton,
  MVAdaptiveVolumeSlider,
  MVAdaptiveFullScreenButton
} from '../../controls'
import { MVAdaptiveTrackInfoCard } from '../../info'
import type { AdaptiveSize } from '../../../../types/adaptive'

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
  isFullScreen: {
    type: Boolean,
    default: false
  },
  isImmersive: {
    type: Boolean,
    default: false
  },
  isMixerEnabled: {
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
  },
  mixerTrackTitle: {
    type: String,
    default: ''
  },
  isMiniBarVisible: {
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
  (e: 'trackInfoTitleClick'): void
  (e: 'trackInfoImageClick'): void
  (e: 'muted', muted: boolean): void
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

const handleTrackInfoTitleClick = () => {
  emit('trackInfoTitleClick')
}

const handleTrackInfoImageClick = () => {
  emit('trackInfoImageClick')
}

const handleMuted = (muted: boolean) => {
  emit('muted', muted)
}
</script>

<template>
  <div data-testid="adaptive-player-bar" class="fixed bottom-0 left-0 right-0">
    <div
      data-testid="container"
      :class="[
        'transition-transform duration-[600ms] ease-in-out bg-gradient-to-t from-black to-transparent',
        isFullScreen ? 'z-[60] px-4 sm:px-10  xl:pb-2' : 'bg-black',
        isFullScreen ? (showSetDuration || showMeditationMixer ? 'pb-[70px]' : 'pb-3') : 'pb-0',
        {
          'translate-y-[80px] xl:translate-y-full': isFullScreen && !isMiniBarVisible
        }
      ]"
    >
      <!-- Track Info Card -->
      <div
        data-testid="track-info-card"
        v-if="isFullScreen"
        class="flex items-center mb-3 sm:mb-4 w-full"
      >
        <MVAdaptiveTrackInfoCard
          :title="title"
          :sub-title="artistName"
          :image="posterUrl"
          :shape="trackInfoCoverShape"
          :size="Size.BIG"
          @title-click="handleTrackInfoTitleClick"
          @image-click="handleTrackInfoImageClick"
        >
          <template #control>
            <MVAdaptiveSetDurationButton
              class="hidden xl:flex"
              v-if="showSetDuration"
              is-text
              is-background-enabled
              @click.stop="handleSetDurationClick"
            />
            <MVAdaptiveMeditationMixerButton
              class="hidden xl:flex px-2"
              v-if="showMeditationMixer"
              :track-title="mixerTrackTitle"
              :mixer-enabled="isMixerEnabled"
              is-background-enabled
              is-text
              @click.stop="handleMeditationMixerClick"
            />
          </template>
        </MVAdaptiveTrackInfoCard>
      </div>

      <!-- Progress Bar -->
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
        class="xl:hidden w-full items-center flex justify-between"
        :class="[isFullScreen ? 'px-0 py-3' : 'px-4 pt-3 pb-4 md:px-6 md:py-3']"
      >
        <div class="flex items-center" :class="{ 'max-w-[60%] md:max-w-[60%]': !isFullScreen }">
          <div class="w-full">
            <MVAdaptiveTrackInfoCard
              v-if="!isFullScreen"
              :title="title"
              :sub-title="artistName"
              :image="posterUrl"
              :shape="trackInfoCoverShape"
              @image-click="handleTrackInfoImageClick"
              @title-click="handleTrackInfoTitleClick"
            />
          </div>
          <div class="ml-2">
            <MVAdaptiveFullScreenButton
              v-if="!isFullScreen"
              is-mobile-layout
              :is-full-screen="isFullScreen"
              @toggleFullScreen="toggleFullScreen"
            />
          </div>
        </div>

        <!-- When full screen -->
        <div
          data-testid="controls"
          v-if="isFullScreen"
          class="w-full transition-opacity duration-[600ms] ease-in-out"
          :class="{ 'opacity-0': !isMiniBarVisible, 'opacity-100': isMiniBarVisible }"
        >
          <div class="flex items-center justify-between space-x-3">
            <!-- Left column -->
            <div data-testid="left-column" class="flex items-center min-w-[20px]"></div>

            <!-- Center column -->
            <div data-testid="center-column" class="flex items-center justify-center">
              <MVAdaptivePlayButton
                @play="handlePlay"
                @pause="handlePause"
                :playing="isPlaying"
                :size="Size.BIG"
              />
            </div>

            <!-- Right column -->
            <div
              data-testid="right-column"
              class="flex items-center justify-end"
              v-if="showImmersive && isFullScreen"
            >
              <MVAdaptiveImmersiveButton
                :is-immersive="isImmersive"
                @click="handleImmersiveClick"
              />
            </div>
          </div>
        </div>

        <!-- When not full screen -->
        <div data-testid="mini-player" v-else class="flex items-center justify-end space-x-3">
          <div class="flex items-center" v-if="showSetDuration">
            <MVAdaptiveSetDurationButton @click="handleSetDurationClick" />
          </div>
          <div class="flex items-center" v-if="showMeditationMixer">
            <MVAdaptiveMeditationMixerButton
              :mixer-enabled="isMixerEnabled"
              @click="handleMeditationMixerClick"
            />
          </div>

          <div class="flex items-center">
            <MVAdaptivePlayButton @play="handlePlay" @pause="handlePause" :playing="isPlaying" />
          </div>
          <div class="flex items-center">
            <MVAdaptiveCloseButton @click="handleClose" />
          </div>
        </div>
      </div>

      <!-- Desktop -->
      <div data-testid="desktop-controls" class="hidden xl:block">
        <div
          class="w-full py-3 grid grid-cols-3 items-center"
          :class="[isFullScreen ? 'px-0' : 'px-6']"
        >
          <!-- Left column -->
          <div data-testid="left-column" class="min-w-28 sm:min-w-48 w-full">
            <MVAdaptiveTrackInfoCard
              v-if="!isFullScreen"
              :title="title"
              :sub-title="artistName"
              :image="posterUrl"
              :shape="trackInfoCoverShape"
              @title-click="handleTrackInfoTitleClick"
              @image-click="handleTrackInfoImageClick"
            />
          </div>

          <!-- Center column -->
          <div data-testid="center-column" class="flex justify-center">
            <div class="flex items-center space-x-6">
              <div v-if="showRewindAndFastForward" class="flex items-center">
                <MVAdaptiveRewindButton @rewind="handleRewind" />
              </div>
              <div v-if="showPreviousNext" class="flex items-center">
                <MVAdaptivePreviousButton @click="handlePrevious" />
              </div>
              <MVAdaptivePlayButton
                @play="handlePlay"
                @pause="handlePause"
                :playing="isPlaying"
                :size="isFullScreen ? Size.BIG : Size.SMALL"
              />
              <div v-if="showPreviousNext" class="flex items-center">
                <MVAdaptiveNextButton @click="handleNext" />
              </div>
              <div v-if="showRewindAndFastForward" class="flex items-center">
                <MVAdaptiveFastForwardButton @fastForward="handleFastForward" />
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div data-testid="right-column" class="flex items-center justify-end space-x-3">
            <div class="flex items-center" v-if="showImmersive && isFullScreen">
              <MVAdaptiveImmersiveButton
                :is-immersive="isImmersive"
                @click="handleImmersiveClick"
              />
            </div>
            <div class="flex items-center" v-if="showSetDuration">
              <MVAdaptiveSetDurationButton @click="handleSetDurationClick" />
            </div>
            <div class="flex items-center" v-if="showMeditationMixer">
              <MVAdaptiveMeditationMixerButton
                :mixer-enabled="isMixerEnabled"
                @click="handleMeditationMixerClick"
              />
            </div>
            <div class="flex items-center">
              <MVAdaptiveCollectionButton @click="handleCollectionClick" />
            </div>
            <div>
              <MVAdaptiveVolumeSlider @update:volume="handleSetVolume" @muted="handleMuted" />
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

    <!-- Set duration and meditation mixer -->
    <div
      data-testid="duration-or-meditation-mixer-container"
      class="xl:hidden pb-[34px] z-[65] bottom-0 left-0 right-0 absolute px-4 sm:px-10"
      v-if="isFullScreen"
    >
      <div class="inline-flex">
        <div class="flex items-center" v-if="showSetDuration">
          <MVAdaptiveSetDurationButton is-text @click="handleSetDurationClick" />
        </div>
        <div class="flex items-center" v-if="showMeditationMixer">
          <MVAdaptiveMeditationMixerButton
            :track-title="mixerTrackTitle"
            :mixer-enabled="isMixerEnabled"
            is-text
            @click="handleMeditationMixerClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-to-t {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
}
</style>
