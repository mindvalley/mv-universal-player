<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue-demi'
import { useFullscreen } from '@vueuse/core'
import { extractColorsFromImageData } from 'extract-colors'
import type { Source } from './../../../../types/audio'
import { AdaptiveShape } from './../../../../types/adaptive'
import { Shape } from './../../../../models/adaptive.enums'
import { useDetectBrowser } from '../../../../composables/use-detect-browser'
import { MVAdaptiveItem, MVAdaptivePlayer, MVAdaptivePlayerBar } from '../../player'
import { MVAdaptiveImmersiveLayer } from '../../layers'
import { MVAdaptiveZoomPlayButton, MVAdaptiveFullscreenButton } from '../../controls'
import { MVAdaptiveNowPlayingInfoCard } from '../../info'
import BaseImage from './../../../../components/global/BaseImage.vue'
import { Size } from '../../../../models/adaptive.enums'

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
  backgroundPosterUrl: {
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
  showCollection: {
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
  },
  fullscreenElement: {
    type: Object,
    default: null
  },
  beforeFadeVolume: {
    type: Number,
    default: 1
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
  (e: 'fullscreen', { isFullscreen }: any): void
  (e: 'toggleImmersive', { isImmersive }: any): void
  (e: 'playbackSpeed', { playbackSpeed }: any): void
  (e: 'trackInfoTitleClick'): void
  (e: 'setVolume', { volume }: any): void
  (e: 'setDuration'): void
  (e: 'muted', { muted }: any): void
  (e: any, payload: any): void
}>()

const {
  isFullscreen: isNativeFullscreen,
  toggle,
  isSupported
} = useFullscreen(props.fullscreenElement)

// Browser Fullscreen is a fallback for iOS devices. iOS doesn't support fullscreen on non-video elements. So on iOS, in any browser, the fullscreen will cover only browser part and not viewport.
const isBrowserFullscreen = ref(false)
const isFullscreen = computed(() => {
  return isNativeFullscreen.value || isBrowserFullscreen.value
})

const isMiniBarVisible = ref(true)
let hideTimeout: number | null = null
const adaptiveItem = ref(null)
const localCurrentTime = ref(0)
const isImmersive = ref(false)
const immersiveSetOnce = ref(false)
const loopingVideoAdaptiveItemRef = ref(null)
const showPlayButton = ref(false)
const { isMobileOrTablet } = useDetectBrowser()
// Add this new ref
const lastActivityTimestamp = ref(Date.now())
const isMouseOverMiniPlayer = ref(false)
const colorPalette = ref<string[]>([])
const hidePlayButtonTimeout = ref<number | null>(null)

// We could have used the player state but due to fade in/out sound feature, we maintain this local state based on the user action (play/pause button click).
const isPlaying = ref(false)

// Add this ref to track if we're in the middle of a fullscreen transition
const isFullscreenTransitioning = ref(false)

// Add this new ref
const initialTouchMiniBarVisible = ref(true)

// Add these new methods
const handleTouchStart = () => {
  if (isMobileOrTablet.value) {
    initialTouchMiniBarVisible.value = isMiniBarVisible.value
  }
}

// Watch fullscreen changes
watch(isFullscreen, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    isFullscreenTransitioning.value = true
    emitEvent('fullscreen', { isFullscreen: newValue })
    // Reset after transition completes (adjust timeout to match your fullscreen transition duration)
    setTimeout(() => {
      isFullscreenTransitioning.value = false
    }, 500) // Assuming 500ms transition
  }
})

// This is to sync player bar and fullscreen play button state.
watch(
  () => adaptiveItem.value?.state?.playing,
  (newVal) => {
    isPlaying.value = newVal
  }
)

onMounted(() => {
  extractColorPalette(props.backgroundPosterUrl ?? props.posterUrl)
})

watch(isFullscreen, (newVal) => {
  if (newVal) {
    if (!immersiveSetOnce.value) {
      isImmersive.value = true
      immersiveSetOnce.value = true
    }
  }
})

watch(
  [() => adaptiveItem.value?.state?.playing, isFullscreen, isImmersive],
  ([newPlaying, newIsFullscreen, newIsImmersive]) => {
    if (newPlaying && newIsFullscreen && newIsImmersive) {
      playLoopingVideo()
    } else {
      pauseLoopingVideo()
    }
  }
)

const playLoopingVideo = async () => {
  if (props.videoSources.length > 0 && !loopingVideoAdaptiveItemRef?.value?.state?.playing) {
    await nextTick()
    loopingVideoAdaptiveItemRef.value?.player?.play()
  }
}

const pauseLoopingVideo = async () => {
  if (loopingVideoAdaptiveItemRef?.value?.state?.playing) {
    await nextTick()
    loopingVideoAdaptiveItemRef.value?.player?.pause()
  }
}

// Modify the handleMouseEnter function
const handleMouseEnter = (isMiniPlayer = false) => {
  if (isFullscreen.value) {
    isMouseOverMiniPlayer.value = isMiniPlayer
    showMiniBar()
  }
}

// Modify the handleMouseLeave function
const handleMouseLeave = (isMiniPlayer = false) => {
  if (isFullscreen.value) {
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
  if (isFullscreen.value) {
    showMiniBar()
  }
}

const toggleFullscreen = () => {
  // This is for fallback.
  if (!isSupported.value) {
    isBrowserFullscreen.value = !isBrowserFullscreen.value
  } else {
    toggle()
  }
  showMiniBar()
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
      emitEvent('playtime', { time: newPlayTime })
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

const restartPlayerTimer = () => {
  resetPlayerTimer()

  if (adaptiveItem.value?.state?.playing) {
    startPlayerTimer()
  }
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
  emitEvent('collectionOpen')
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

const play = async () => {
  isPlaying.value = true
  adaptiveItem.value?.player?.play()
}

const pause = async () => {
  isPlaying.value = false
  adaptiveItem.value?.player?.pause()
}

const rewind = (time: number) => {
  if (adaptiveItem?.value?.state?.playing) {
    adaptiveItem.value?.player?.rewind(time)
  }
}

const fastForward = (time: any) => {
  if (adaptiveItem?.value?.state?.playing) {
    adaptiveItem.value?.player?.fastForward(time)
  }
}

const setVolume = (volume: any) => {
  adaptiveItem.value?.player?.setVolume(volume)
  emitEvent('setVolume', { volume: volume })
}

const handleFullscreenLayerClick = () => {
  if (!isFullscreen.value) {
    return
  }

  // For mobile devices only
  if (isMobileOrTablet.value) {
    // Use the initial visibility state from when the touch started
    if (!initialTouchMiniBarVisible.value) {
      showMiniBar() // Show the bar for the next interaction
      return
    }
  }

  if (adaptiveItem?.value?.state?.playing) {
    pause()
  } else {
    play()
  }

  toggleFullscreenPlayButton()
}

const toggleFullscreenPlayButton = () => {
  // Clear any existing timeout
  if (hidePlayButtonTimeout.value) {
    clearTimeout(hidePlayButtonTimeout.value)
  }

  // Show the button. This is to match the speed of play/pause state and the button state.
  setTimeout(() => {
    showPlayButton.value = true
  }, 0)

  // Set new timeout
  hidePlayButtonTimeout.value = setTimeout(() => {
    showPlayButton.value = false
    hidePlayButtonTimeout.value = null
  }, 1000) as unknown as number
}

const handleMuted = (muted: boolean) => {
  emitEvent('muted', { muted })
}

const handleTimeUpdate = (event: any) => {
  localCurrentTime.value = Number(event.currentTime)
  emitEvent('timeupdate', { currentTime: localCurrentTime.value })
}

const handleTrackInfoTitleClick = () => {
  emitEvent('trackInfoTitleClick')
}

const handleTrackInfoImageClick = () => {
  emitEvent('trackInfoImageClick')
}

const extractColorPalette = async (imageSrc: string) => {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = imageSrc

  await new Promise((resolve) => {
    img.onload = resolve
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = img.width
  canvas.height = img.height

  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const colors = await extractColorsFromImageData(imageData, {
    pixels: 64000,
    distance: 0.22
  })

  colorPalette.value = colors.length > 0 ? colors.slice(0, 5).map((color) => color.hex) : []
}

defineExpose({
  player: adaptiveItem,
  restartPlayerTimer,
  resetPlayerTimer,
  play,
  pause
})
</script>

<template>
  <div
    data-testid="adaptive-resource"
    class="h-full w-full flex flex-col"
    :class="{ 'overflow-hidden': isFullscreen }"
  >
    <MVAdaptivePlayer :loop="loopingEnabled" :audio-only-mode="true" :auto-play="autoPlay">
      <MVAdaptiveItem
        ref="adaptiveItem"
        :sources="audioSources"
        :id="id"
        :before-fade-volume="beforeFadeVolume"
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

    <Transition :name="isMobileOrTablet ? 'slide' : 'fade'">
      <div
        v-show="isFullscreen"
        data-testid="adaptive-full-screen"
        class="fixed inset-0 z-50 bg-black"
        @mouseenter="handleMouseEnter(false)"
        @mouseleave="handleMouseLeave(false)"
        @mousemove="handleMouseMove"
        @touchstart="handleTouchStart"
        @click="handleFullscreenLayerClick"
      >
        <!-- Top Bar -->
        <div
          data-testid="top-bar"
          class="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-b-subtle px-4 xl:px-10 py-7"
        >
          <div class="flex items-center justify-between xl:justify-start">
            <div class="xl:hidden">
              <MVAdaptiveFullscreenButton
                is-mobile-layout
                @toggleFullscreen="toggleFullscreen"
                :is-fullscreen="isFullscreen"
              />
            </div>
            <div
              class="absolute left-1/2 transform -translate-x-1/2 xl:static xl:left-auto xl:transform-none"
            >
              <MVAdaptiveNowPlayingInfoCard
                :title="nowPlayingTitle"
                :sub-title="nowPlayingSubtitle"
              />
            </div>
            <!-- Add an empty div to balance the layout on mobile -->
            <div class="xl:hidden w-10"></div>
          </div>
          <div class="h-1 w-1"></div>
        </div>

        <TransitionGroup
          :name="isFullscreen && !isFullscreenTransitioning ? 'scenario-fade' : undefined"
        >
          <!-- Scenario 1: Show looping video when there is one -->
          <div
            data-testid="looping-video"
            class="absolute inset-0"
            v-show="videoSources.length > 0 && isImmersive"
            :key="'looping-video'"
          >
            <MVAdaptivePlayer :poster-url="backgroundPosterUrl ?? posterUrl" loop muted auto-play>
              <MVAdaptiveItem
                ref="loopingVideoAdaptiveItemRef"
                :sources="videoSources"
                :id="id + '-looping-video'"
              >
              </MVAdaptiveItem>
            </MVAdaptivePlayer>
          </div>

          <!-- Scenario 2: Show dynamic video when there is no looping video -->
          <div
            data-testid="dynamic-video"
            class="absolute inset-0"
            v-show="videoSources.length === 0 && isImmersive"
            :key="'dynamic-video'"
          >
            <MVAdaptiveImmersiveLayer
              :is-immersive-mode-active="isImmersive"
              :playing="adaptiveItem?.state?.playing"
              :color-palette="colorPalette"
              :visible="isFullscreen"
            />
          </div>

          <!-- Scenario 3: Show poster when there is no looping video and immersive if off -->
          <div data-testid="poster" class="absolute inset-0" v-show="!isImmersive" :key="'poster'">
            <BaseImage
              class="w-full h-full"
              img-class="object-cover h-full"
              :src="backgroundPosterUrl"
              :width="1024"
            />
          </div>
        </TransitionGroup>

        <div
          v-show="showPlayButton"
          class="fixed inset-0 h-full w-full flex items-center justify-center"
        >
          <MVAdaptiveZoomPlayButton
            v-if="!isPlaying"
            :playing="true"
            :size="isMobileOrTablet ? Size.BIG : Size.SMALL"
          />
          <MVAdaptiveZoomPlayButton
            v-else
            :playing="false"
            :size="isMobileOrTablet ? Size.BIG : Size.SMALL"
          />
        </div>
      </div>
    </Transition>

    <!-- Mini Player -->
    <div
      class="z-[50] w-full"
      :class="{
        relative: !isFullscreen,
        'fixed bottom-0 left-0 right-0': isFullscreen
      }"
      @mouseenter="handleMouseEnter(true)"
      @mouseleave="handleMouseLeave(true)"
      @mousemove="handleMouseMove"
      data-testid="adaptive-mini-player"
    >
      <MVAdaptivePlayerBar
        :is-playing="isPlaying"
        :title="title"
        :artist-name="artistName"
        :poster-url="posterUrl"
        :track-info-cover-shape="trackInfoCoverShape"
        :duration="duration"
        :progress-bar-current-time="
          overrideProgressBarCurrentTime ? progressBarCurrentTime : localCurrentTime
        "
        :is-fullscreen="isFullscreen"
        :is-mini-bar-visible="isMiniBarVisible"
        :is-immersive="isImmersive"
        :is-mixer-enabled="isMixerEnabled"
        :looping-enabled="loopingEnabled"
        :show-rewind-and-fast-forward="showRewindAndFastForward"
        :show-previous-next="showPreviousNext"
        :show-set-duration="showSetDuration"
        :show-playback-speed="showPlaybackSpeed"
        :show-meditation-mixer="showMeditationMixer"
        :show-collection="showCollection"
        :show-immersive="showImmersive"
        :mixer-track-title="mixerTrackTitle"
        @track-info-title-click="handleTrackInfoTitleClick"
        @track-info-image-click="handleTrackInfoImageClick"
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
        @toggleFullscreen="toggleFullscreen"
        @toggleImmersive="handleImmersiveClick"
        @muted="handleMuted"
      />
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-to-b-subtle {
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 20%,
    rgba(0, 0, 0, 0.2) 60%,
    rgba(0, 0, 0, 0) 100%
  );
  padding-bottom: 60px;
  margin-bottom: -60px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.slide-enter-from,
.slide-leave-to,
.slide-up-enter-from,
.slide-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to,
.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from,
.slide-up-enter-to,
.slide-up-leave-from,
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.scenario-fade-enter-active,
.scenario-fade-leave-active {
  transition: opacity 1.5s ease;
}

.scenario-fade-enter-from,
.scenario-fade-leave-to {
  opacity: 0;
}

.scenario-fade-enter-to,
.scenario-fade-leave-from {
  opacity: 1;
}
</style>
