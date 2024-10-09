<script setup lang="ts">
import { ref, watch, nextTick } from 'vue-demi'
import type { Source } from './../../../types/audio'
import { AdaptiveShape } from '../../../types/adaptive'
import { Shape } from '../../../models/adaptive.enums'
import MVAdaptiveItem from '../AdaptiveItem'
import MVAdaptivePlayer from '../AdaptivePlayer'
import MVAdaptivePlayerBar from '../AdaptivePlayerBar'
import MVAdaptiveImmersiveLayer from '../AdaptiveImmersiveLayer'
import MVAdaptivePlayButton from '../AdaptivePlayButton'
import MVAdaptiveNowPlayingInfoCard from '../AdaptiveNowPlayingInfoCard'
import MVAdaptiveFullScreenButton from '../AdaptiveFullScreenButton'
import BaseImage from '../../global/BaseImage.vue'

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
  },
  progressBarCurrentTime: {
    type: Number,
    default: 0
  },
  overrideProgressBarCurrentTime: {
    type: Boolean,
    default: false
  },
  audioOnlyMode: {
    type: Boolean,
    default: false
  },
  autoPlay: {
    type: Boolean,
    default: false
  },
  nowPlayingTitle: {
    type: String,
    default: 'NOW PLAYING'
  },
  nowPlayingSubtitle: {
    type: String,
    default: ''
  },
  isMixerEnabled: {
    type: Boolean,
    default: false
  },
  mixerTrackTitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'timeupdate', { currentTime }: any): void
  (e: 'play', { currentTime }: any): void
  (e: 'pause', { currentTime }: any): void
  (e: 'seeking', { seeking }: any): void
  (e: 'seek', { time }: any): void // This is to perform the action
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
  (e: 'fullscreen', { isFullScreen }: any): void
  (e: 'toggleImmersive', { isImmersive }: any): void
  (e: 'playbackSpeed', { playbackSpeed }: any): void
  (e: 'trackInfoTitleClick'): void
  (e: any, payload: any): void
}>()

const isFullScreen = ref(false)
const isMiniBarVisible = ref(true)
let hideTimeout: number | null = null
const adaptiveItem = ref(null)
const localCurrentTime = ref(0)
const isImmersive = ref(false)
const immersiveSetOnce = ref(false)
const loopingVideoAdaptiveItemRef = ref(null)
const showPlayButton = ref(false)

// Add this new ref
const lastActivityTimestamp = ref(Date.now())
const isMouseOverMiniPlayer = ref(false)

watch(isFullScreen, (newVal) => {
  if (newVal) {
    if (!immersiveSetOnce.value) {
      isImmersive.value = true
      immersiveSetOnce.value = true
      if (adaptiveItem?.value?.state?.playing) {
        playLoopingVideo()
      }
    }
  }
})

const playLoopingVideo = async () => {
  if (isFullScreen.value && isImmersive.value) {
    await nextTick()
    loopingVideoAdaptiveItemRef.value?.player?.play()
  }
}

const pauseLoopingVideo = async () => {
  if (isFullScreen.value && isImmersive.value) {
    await nextTick()
    loopingVideoAdaptiveItemRef.value?.player?.pause()
  }
}

// Modify the handleMouseEnter function
const handleMouseEnter = (isMiniPlayer = false) => {
  if (isFullScreen.value) {
    isMouseOverMiniPlayer.value = isMiniPlayer
    showMiniBar()
  }
}

// Modify the handleMouseLeave function
const handleMouseLeave = (isMiniPlayer = false) => {
  if (isFullScreen.value) {
    if (isMiniPlayer) {
      isMouseOverMiniPlayer.value = false
    }
    startHideTimer()
  }
}

// Add these new functions
const showMiniBar = () => {
  isMiniBarVisible.value = true
  lastActivityTimestamp.value = Date.now()
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
  startHideTimer()
}

const startHideTimer = () => {
  hideTimeout = setTimeout(() => {
    if (Date.now() - lastActivityTimestamp.value >= 3000 && !isMouseOverMiniPlayer.value) {
      isMiniBarVisible.value = false
    }
  }, 3000) as unknown as number
}

const handleMouseMove = () => {
  if (isFullScreen.value) {
    showMiniBar()
  }
}

// Modify the toggleFullScreen function
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  showMiniBar()
  emitEvent('fullscreen', { isFullScreen: isFullScreen.value })
}

const emitEvent = (eventName: string, payload?: any) => {
  const data = { id: props.id, ...payload }
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
  localCurrentTime.value = 0
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

const handleImmersiveClick = () => {
  isImmersive.value = !isImmersive.value
  emitEvent('toggleImmersive')
}

const handleSeek = (seeking: any) => {
  emitEvent('seek', { time: seeking })
}

const play = () => {
  adaptiveItem.value.player?.play()
  playLoopingVideo()
}

const pause = () => {
  adaptiveItem.value.player?.pause()
  pauseLoopingVideo()
}

const rewind = (event: any) => {
  adaptiveItem.value.player?.rewind(event)
}

const fastForward = (event: any) => {
  adaptiveItem.value.player?.fastForward(event)
}

const setVolume = (event: any) => {
  adaptiveItem.value.player?.setVolume(event)
}

const togglePlayPause = () => {
  if (adaptiveItem?.value?.state?.playing) {
    pause()
  } else {
    play()
  }

  // Show the play button briefly when toggling
  showPlayButton.value = true
  setTimeout(() => {
    showPlayButton.value = false
  }, 1000) // Hide after 1 second, adjust as needed
}

const handleTimeUpdate = (event: any) => {
  localCurrentTime.value = Number(event.currentTime)
  emitEvent('timeupdate', { currentTime: localCurrentTime.value })
}

const handleTrackInfoTitleClick = () => {
  emitEvent('track-info-title-click')
}

defineExpose({
  player: adaptiveItem
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <MVAdaptivePlayer
      :loop="loopingEnabled"
      :poster-url="posterUrl"
      :audio-only-mode="true"
      :auto-play="autoPlay"
    >
      <MVAdaptiveItem
        ref="adaptiveItem"
        :sources="audioSources"
        :id="id"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @rewind="emitEvent('rewind', $event)"
        @fastforward="emitEvent('fastforward', $event)"
        @playbackSpeed="emitEvent('playbackSpeed', $event)"
        @timeupdate="handleTimeUpdate"
        @reset="emitEvent('reset', $event)"
        @error="emitEvent('error', $event)"
      >
      </MVAdaptiveItem>
    </MVAdaptivePlayer>

    <Transition name="fade">
      <div
        v-show="isFullScreen"
        class="fixed inset-0 z-50"
        @mouseenter="handleMouseEnter(false)"
        @mouseleave="handleMouseLeave(false)"
        @mousemove="handleMouseMove"
        @click="togglePlayPause"
      >
        <!-- Top Bar -->
        <div class="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-b-subtle px-4 sm:px-10 py-7">
          <div class="flex items-center justify-between sm:justify-start">
            <div class="sm:hidden">
              <MVAdaptiveFullScreenButton is-mobile-layout @toggleFullScreen="toggleFullScreen" />
            </div>
            <div
              class="absolute left-1/2 transform -translate-x-1/2 sm:static sm:left-auto sm:transform-none"
            >
              <MVAdaptiveNowPlayingInfoCard
                :title="nowPlayingTitle"
                :sub-title="nowPlayingSubtitle"
              />
            </div>
            <!-- Add an empty div to balance the layout on mobile -->
            <div class="sm:hidden w-10"></div>
          </div>
          <div class="h-1 w-1"></div>
        </div>

        <!-- Show looping video when there is one -->
        <div class="h-full w-full" v-show="videoSources.length > 0 && isImmersive">
          <MVAdaptivePlayer :poster-url="posterUrl" loop muted auto-play>
            <MVAdaptiveItem
              ref="loopingVideoAdaptiveItemRef"
              :sources="videoSources"
              :id="id + '-looping-video'"
            >
            </MVAdaptiveItem>
          </MVAdaptivePlayer>
        </div>

        <!-- Show dynamic video when there is no looping video -->
        <div class="h-full w-full" v-if="videoSources.length === 0 && isImmersive">
          <MVAdaptiveImmersiveLayer
            :image="posterUrl"
            is-immersive-mode-active
            :playing="adaptiveItem?.state?.playing"
          />
        </div>

        <!-- Show poster when there is no looping video and immersive if off -->
        <div class="h-full w-full" v-else>
          <BaseImage
            class="w-full h-full"
            img-class="object-cover h-full"
            :src="posterUrl"
            :width="1024"
          />
        </div>

        <!-- Full screen play button -->
        <Transition name="fade">
          <div
            v-show="showPlayButton"
            class="fixed inset-0 h-full w-full flex items-center justify-center"
          >
            <MVAdaptivePlayButton
              :playing="!adaptiveItem?.state?.playing"
              :show-tooltip="false"
              :show-hover-effect="false"
              icon-color="text-black-70a"
            />
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Mini Player -->
    <div
      @mouseenter="handleMouseEnter(true)"
      @mouseleave="handleMouseLeave(true)"
      @mousemove="handleMouseMove"
      data-testid="adaptive-mini-player"
      :class="[
        'transition-all duration-[600ms] ease-in-out',
        isFullScreen
          ? 'fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-black to-transparent px-4 sm:px-10'
          : 'bg-black',
        { 'translate-y-full': isFullScreen && !isMiniBarVisible }
      ]"
    >
      <MVAdaptivePlayerBar
        :is-playing="adaptiveItem?.state?.playing"
        :title="title"
        :artist-name="artistName"
        :poster-url="posterUrl"
        :track-info-cover-shape="trackInfoCoverShape"
        :volume="adaptiveItem?.state?.volume"
        :duration="duration"
        :progress-bar-current-time="
          overrideProgressBarCurrentTime ? progressBarCurrentTime : localCurrentTime
        "
        :is-full-screen="isFullScreen"
        :is-immersive="isImmersive"
        :is-mixer-enabled="isMixerEnabled"
        :looping-enabled="loopingEnabled"
        :show-rewind-and-fast-forward="showRewindAndFastForward"
        :show-previous-next="showPreviousNext"
        :show-set-duration="showSetDuration"
        :show-playback-speed="showPlaybackSpeed"
        :show-meditation-mixer="showMeditationMixer"
        :show-collections="showCollections"
        :show-immersive="showImmersive"
        :mixer-track-title="mixerTrackTitle"
        @track-info-title-click="handleTrackInfoTitleClick"
        @pause="pause"
        @play="play"
        @rewind="rewind"
        @fastForward="fastForward"
        @seek="handleSeek"
        @previous="handlePreviousClick"
        @next="handleNextClick"
        @setVolume="setVolume"
        @close="handleClose"
        @collection="handleCollectionClick"
        @meditationMixer="handleMeditationMixerClick"
        @setDuration="handleSetDurationClick"
        @toggleFullScreen="toggleFullScreen"
        @toggleImmersive="handleImmersiveClick"
      />
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-to-t {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
}

.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
}

.bg-gradient-to-b-subtle {
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0) 100%
  );
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
