<script setup lang="ts">
import VideoJsPlayer from 'video.js'
import 'video.js/dist/video-js.css'
import { onMounted, onUnmounted, ref, provide, readonly, defineExpose, watch } from 'vue-demi'
import type { Player, Source, Marker } from '../../../types/video'
import MVVideoMarkerItem from './../VideoMarkerItem'
import type { OverlayControlsPosition } from '../../../types/video'

const StateConfig = {
  src: {
    getter: (player: any) => player.src()
  },
  currentSrc: {
    getter: (player: any) => player.currentSrc()
  },
  currentSource: {
    getter: (player: any) => player.currentSource()
  },
  volume: {
    events: ['volumechange'],
    getter: (player: any) => player.volume()
  },
  muted: {
    events: ['volumechange', 'muted'],
    getter: (player: any) => player.muted()
  },
  seeking: {
    events: ['seeking'],
    getter: (player: any) => player.seeking()
  },
  paused: {
    events: ['pause', 'play', 'playing'],
    getter: (player: any) => player.paused()
  },
  ended: {
    events: ['ended', 'play'],
    getter: (player: any) => player.ended()
  },
  currentTime: {
    events: ['timeupdate'],
    getter: (player: any) => player.currentTime()
  },
  duration: {
    events: ['durationchange'],
    getter: (player: any) => player.duration()
  },
  playbackRate: {
    events: ['ratechange'],
    getter: (player: any) => player.playbackRate()
  },
  playbackRates: {
    events: ['playbackrateschange'],
    getter: (player: any) => player.playbackRates()
  },
  readyState: {
    events: ['loadeddata'],
    getter: (player: any) => player.readyState()
  },
  networkState: {
    events: ['loadeddata', 'error'],
    getter: (player: any) => player.networkState()
  },
  error: {
    events: ['loadeddata', 'error'],
    getter: (player: any) => player.error()
  },
  buffered: {
    events: ['progress'],
    getter: (player: any) => player.buffered()
  },
  bufferedPercent: {
    events: ['progress'],
    getter: (player: any) => player.bufferedPercent()
  },
  played: {
    events: ['timeupdate'],
    getter: (player: any) => player.played()
  },
  seekable: {
    events: ['progress', 'seeked'],
    getter: (player: any) => player.seekable()
  },
  ready: {
    getter: () => false
  },
  fullscreen: {
    events: ['fullscreenchange'],
    getter: (player: any) => player.isFullscreen()
  }
}

type PlayerBaseState = {
  [K in keyof typeof StateConfig]: ReturnType<(typeof StateConfig)[K]['getter']>
}

interface PlayerState extends PlayerBaseState {
  playing: boolean
  waiting: boolean
}

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-video-item-' + Math.random().toString().replace('.', '')
  },
  duration: {
    required: true,
    type: Number
  },
  playbackRates: {
    type: Array<Number>,
    default: () => [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  },
  showPlaybackRates: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean
  },
  posterUrl: {
    type: String,
    default: ''
  },
  sources: {
    type: Array<Source>,
    required: true,
    default: () => []
  },
  muted: {
    type: Boolean,
    default: false
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  markers: {
    type: Array<Marker>,
    default: () => []
  },
  progressControl: {
    type: Boolean,
    default: true
  },
  overlayControls: {
    type: Boolean,
    default: false
  },
  overlayControlsPosition: {
    type: String as () => OverlayControlsPosition,
    default: 'BOTTOM'
  },
  pictureInPicture: {
    type: Boolean,
    default: false
  }
})

let videoInstance: any
let state = ref({} as PlayerState)
const currentTime = ref(0)
const playedOnce = ref(false)
const sortedMarkers = props.markers.sort((a, b) => a.time - b.time)

const showMarkersMenu = ref(false)
const currentMarker = ref()

const emit = defineEmits<{
  (e: 'timeupdate', { currentTime }: any): void
  (e: 'play', { currentTime }: any): void
  (e: 'pause', { currentTime }: any): void
  (e: 'seeking', { seeking }: any): void
  (e: 'ended', { currentTime }: any): void
  (e: 'rewind', { previousTime, currentTime }: any): void
  (e: 'fastforward', { previousTime, currentTime }: any): void
  (e: 'fullscreen', { isFullscreen }: any): void
  (e: 'playbackSpeed', { playbackSpeed }: any): void
  (e: 'error', payload: any): void
  (e: any, payload: any): void
}>()

watch(
  () => state.value.error,
  (error) => {
    if (error) {
      emit('error', error)
    }
  }
)

watch(
  () => state.value.fullscreen,
  (fullscreen) => {
    if (props.overlayControls) {
      if (fullscreen) {
        videoInstance.controls(true)
        emit('fullscreen', { isFullscreen: true })
      } else {
        videoInstance.controls(false)
        emit('fullscreen', { isFullscreen: false })
      }
    }
  }
)

watch(
  () => state.value.playing,
  (newPlaying) => {
    if (newPlaying) {
      playedOnce.value = true
      emit('play', { currentTime: currentTime.value.toFixed(2) })
    }
  }
)

watch(
  () => state.value.paused,
  (paused) => {
    if (paused && playedOnce.value) {
      emit('pause', { currentTime: currentTime.value.toFixed(2) })
    }
  }
)

watch(
  () => state.value.currentTime,
  (currentTime) => {
    currentMarker.value = selectCurrentMarker()
    emit('timeupdate', { currentTime: currentTime.toFixed(2) })
  }
)

watch(
  () => state.value.ended,
  (ended) => {
    if (ended) {
      emit('ended', { currentTime: currentTime.value.toFixed(2) })
      currentTime.value = 0
    }
  }
)

watch(
  () => state.value.playbackRate,
  (playbackRate) => {
    if (playedOnce.value) {
      emit('playbackSpeed', { playbackSpeed: playbackRate })
    }
  }
)

watch(
  () => state.value.currentTime,
  (newCurrentTime) => {
    currentTime.value = newCurrentTime
  }
)

onMounted(() => {
  const controls = !props.overlayControls
  initialize(props.id, controls, props.loop)
})

onUnmounted(() => {
  videoInstance.dispose()

  if (videoInstance) {
    videoInstance.dispose()
  }
})

const initialize = (id: string, controls = true, loop = false) => {
  videoInstance = createInstance(`mv-video-item-${id}`, {
    poster: props.posterUrl,
    fluid: true,
    muted: props.muted,
    controls: controls,
    autoplay: props.autoplay,
    aspectRatio: '16:9',
    loop,
    playbackRates: props.showPlaybackRates ? props.playbackRates : [],
    html5: {
      vhs: {
        overrideNative: true
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    },
    controlBar: {
      progressControl: props.progressControl,
      preferFullWindow: true,
      responsive: true,
      seekToLive: false,
      pictureInPictureToggle: props.pictureInPicture
    }
  })

  createState()
  updateState('ready', true)

  // Setting it explicitly as the initial state is not reflecting correctly.
  updateState('muted', props.muted)

  const rewindButton = videoInstance.controlBar.addChild('button', {})
  const rewindButtonDOM = rewindButton.el()
  rewindButtonDOM.innerHTML = `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.452.87a.75.75 0 0 1 0 1.06L7.071 3.312h4.76a10.003 10.003 0 0 1 9.603 7.233A10 10 0 1 1 2.02 15.28a1 1 0 1 1 1.96-.393 8 8 0 1 0 7.852-9.575H7.38l1.072 1.072a.75.75 0 0 1-1.06 1.061L4.634 4.688a.75.75 0 0 1 0-1.06L7.392.87a.75.75 0 0 1 1.06 0Z" fill="currentColor"/><path d="M7.2 16.66v-1.44h1.12V11.7h-.89v-1.1c.66-.08 1-.42 1.18-1.1h1.2v5.72h1.06v1.44H7.2ZM16.302 14.61c0 1.36-.78 2.17-2.37 2.17-1.67 0-2.4-.74-2.4-2.12v-.47h1.6v.43c0 .52.25.8.81.8.57 0 .83-.33.83-.9v-.77c0-.54-.29-.82-.8-.82-.44 0-.71.22-.88.53l-.05.12-1.46-.37.47-3.71h4.08v.03c0 1.15-.22 1.29-1.5 1.29h-1.38l-.2 1.61c.27-.42.68-.73 1.46-.72 1.21-.01 1.79.79 1.79 2.02v.88Z" fill="currentColor"/></svg>`
  rewindButtonDOM.classList.add('vjs-rewind')
  rewindButtonDOM.onclick = function () {
    rewind(15)
  }

  const fastForwardButton = videoInstance.controlBar.addChild('button', {})
  const fastForwardButtonDOM = fastForwardButton.el()
  fastForwardButtonDOM.innerHTML = `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.372.87a.75.75 0 0 0 0 1.06l1.381 1.382h-4.76a10.003 10.003 0 0 0-9.602 7.233 10 10 0 1 0 19.413 4.735 1 1 0 1 0-1.96-.393 8 8 0 1 1-7.852-9.575h4.452l-1.072 1.072a.75.75 0 1 0 1.06 1.061l2.758-2.757a.75.75 0 0 0 0-1.06L16.432.87a.75.75 0 0 0-1.06 0Z" fill="currentColor"/><path d="M7.2 16.66v-1.44h1.12V11.7h-.89v-1.1c.66-.08 1-.42 1.18-1.1h1.2v5.72h1.06v1.44H7.2ZM16.302 14.61c0 1.36-.78 2.17-2.37 2.17-1.67 0-2.4-.74-2.4-2.12v-.47h1.6v.43c0 .52.25.8.81.8.57 0 .83-.33.83-.9v-.77c0-.54-.29-.82-.8-.82-.44 0-.71.22-.88.53l-.05.12-1.46-.37.47-3.71h4.08v.03c0 1.15-.22 1.29-1.5 1.29h-1.38l-.2 1.61c.27-.42.68-.73 1.46-.72 1.21-.01 1.79.79 1.79 2.02v.88Z" fill="currentColor"/></svg>`
  fastForwardButtonDOM.classList.add('vjs-fast-forward')
  fastForwardButtonDOM.onclick = function () {
    fastForward(15)
  }
}

const createState = () => {
  const keys = Object.keys(StateConfig) as Array<keyof typeof StateConfig>
  state.value = keys.reduce(
    (result, key) => ({ ...result, [key]: StateConfig[key].getter(videoInstance) }),
    {
      playing: false,
      waiting: false
    } as any
  )

  // playing state https://github.com/videojs/video.js/issues/181
  // un-loop: play > playing > pause > ended
  // loop: play > playing > [ended > restart] waiting > playing
  videoInstance.on(['pause', 'ended'], () => {
    updateState('playing', false)
  })
  videoInstance.on(['play', 'playing'], () => {
    updateState('playing', true)
  })

  keys.forEach((key) => {
    const target = StateConfig[key]
    // const baseEvents = ['loadstart', 'loadedmetadata']
    const baseEvents = ['']
    videoInstance.on(
      baseEvents.concat((target as any).events ? (target as any).events : []),
      () => {
        updateState(key, target.getter(videoInstance))
      }
    )
  })
}

const updateState = (key: keyof PlayerState, value: any) => {
  state.value[key] = value as never
}

const createInstance = (id: string, options: any) => {
  if (id && id.trim()) {
    return VideoJsPlayer(id, options)
  }
}

const setSources = (sources: Source[]) => {
  if (videoInstance && sources?.length > 0) {
    videoInstance.src(sources)
  }
}

const play = () => {
  if (videoInstance) {
    videoInstance.play()
  }
}

const pause = () => {
  if (videoInstance) {
    videoInstance.pause()
  }
}

const setVolume = (volume: number) => {
  if (videoInstance) {
    videoInstance.volume(volume)
  }
}

const setCurrentTime = (time: number) => {
  if (videoInstance) {
    videoInstance.currentTime(time)
  }
}

const setPlaybackRate = (rate: number) => {
  videoInstance.playbackRate(rate)
}

const rewind = (seconds: number) => {
  if (!state.value.playing) {
    play()
  }

  if (seconds >= 0) {
    const currentTime =
      state.value.currentTime - seconds >= 0 ? state.value.currentTime - seconds : 0
    emit('rewind', {
      previousTime: state.value.currentTime.toFixed(2),
      currentTime: currentTime.toFixed(2)
    })
    setCurrentTime(currentTime)
  }
}

const fastForward = (seconds: number) => {
  if (!state.value.playing) {
    play()
  }

  if (seconds >= 0) {
    const currentTime = state.value.currentTime + seconds
    emit('fastforward', {
      previousTime: state.value.currentTime.toFixed(2),
      currentTime: currentTime.toFixed(2)
    })

    setCurrentTime(currentTime)
  }
}

const toggleMarkersMenu = () => {
  showMarkersMenu.value = !showMarkersMenu.value
}

const jumpTo = (time: number) => {
  if (time < props.duration) {
    setCurrentTime(time)
    play()
  }
}

const selectCurrentMarker = () => {
  return props.markers.filter((marker) => state.value?.currentTime >= marker.time).slice(-1)[0]
}

const mute = () => {
  if (videoInstance) {
    videoInstance.muted(true)
  }
}

const unmute = () => {
  if (videoInstance) {
    videoInstance.muted(false)
  }
}

const goFullscreen = () => {
  if (videoInstance) {
    videoInstance.requestFullscreen()
  }
}

const player: Player = {
  play,
  pause,
  setVolume,
  setCurrentTime,
  setSources,
  setPlaybackRate,
  mute,
  unmute,
  goFullscreen
}

defineExpose({
  player: player,
  state: readonly(state)
})

provide('videoPlayer', player)
provide('videoState', readonly(state))
</script>

<template>
  <div class="w-full relative mv-video-item-container group/mv-video-item-container">
    <video :data-testid="props.id" :id="`mv-video-item-${props.id}`" class="video-js mv-video-item">
      <p class="vjs-no-js">
        To play the video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video</a>
      </p>
      <source
        v-for="(source, index) in sources"
        :src="source.src"
        :type="source.type"
        :key="index"
      />
    </video>

    <!-- TODO: hide it based on useSlot -->
    <div
      data-testid="video-controls"
      v-if="overlayControls && playedOnce"
      :class="{
        'video-controls absolute right-2 sm:right-4 md:right-6': true,
        'bottom-2 sm:bottom-4 md:bottom-6': overlayControlsPosition === 'BOTTOM',
        'top-2 sm:top-4 md:top-6': overlayControlsPosition === 'TOP'
      }"
    >
      <slot
        name="video-controls"
        :state="state"
        :player="player"
        :play="play"
        :pause="pause"
        :mute="mute"
        :unmute="unmute"
        :goFullscreen="goFullscreen"
      ></slot>
    </div>

    <!-- This is just for overlay. -->
    <div
      v-if="!playedOnce && !state.playing"
      class="absolute top-0 h-full w-full cursor-pointer rounded-3xl bg-black opacity-0 duration-200 ease-in group-hover/mv-video-item-container:opacity-20"
      @click="play"
    ></div>

    <button
      v-if="!playedOnce && !state.playing"
      @click="play"
      data-testid="play-button"
      class="flex absolute bottom-0 m-4 sm:m-7 lg:m-8 h-12 w-12 sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-white text-black duration-200 ease-in group-hover/mv-video-item-container:scale-105 group-hover/mv-video-item-container:bg-white"
    >
      <svg v-svg symbol="play-filled" class="ml-1 p-2 sm:p-3 lg:p-4"></svg>
    </button>

    <button
      v-if="sortedMarkers?.length > 0"
      class="vjs-markers-button absolute top-4 right-6 hidden h-8 w-24 rounded-full border-2 border-white bg-black/[.3] caption-disclaimer text-white"
      @click="toggleMarkersMenu"
    >
      Jump-To
    </button>

    <aside
      v-if="sortedMarkers?.length > 0"
      v-show="showMarkersMenu"
      class="absolute top-0 right-0 bottom-0 h-full w-full max-w-[430px] rounded-tr-3xl rounded-br-3xl bg-cool-grey-650 text-white"
    >
      <ul class="h-full overflow-auto">
        <li
          class="flex h-16 items-center border-b border-b-cool-grey-600 pt-px pr-6 pl-14 title-7 text-cool-grey-400"
        >
          JUMP TO
          <span @click="toggleMarkersMenu" class="ml-auto cursor-pointer">
            <svg class="mr-2 text-white" v-svg symbol="x-filled" size="24"></svg>
          </span>
        </li>
        <MVVideoMarkerItem
          @select-marker="jumpTo($event.time)"
          v-for="(marker, index) in sortedMarkers"
          :marker="marker"
          :current-marker="currentMarker"
          :key="index"
        ></MVVideoMarkerItem>
      </ul>
    </aside>
    <slot
      :state="state"
      :player="player"
      :play="play"
      :pause="pause"
      :setVolume="setVolume"
      :setCurrentTime="setCurrentTime"
      :setSources="setSources"
      :setPlaybackRate="setPlaybackRate"
    ></slot>
  </div>
</template>

<style lang="scss">
.mv-video-item-container {
  .mv-video-item {
    width: 100%;

    // Playback Speed Menu
    .vjs-menu {
      ul.vjs-menu-content {
        width: 125%;
        max-height: none;
        margin-bottom: 1.25em;
        right: -1.25em;
      }
    }

    // Controls Bar
    .vjs-control-bar {
      display: none;
      height: auto;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
    }
    &.vjs-has-started {
      .vjs-control-bar {
        display: flex;
        flex-wrap: wrap;
      }
    }

    // For all control items
    .vjs-control {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 3.25rem;
      line-height: 3.25rem;
    }

    // For all control items icon
    .vjs-control svg {
      transform: scale(0.75);
    }

    // Progress Bar Wrapper
    .vjs-progress-control.vjs-control {
      order: 0;
      width: 100%;
      flex-grow: 1;
      flex-shrink: 0;
    }

    // Progress Bar
    .vjs-progress-holder.vjs-slider.vjs-slider-horizontal {
      margin: 0 auto;
    }

    .vjs-progress-control {
      height: 4px;
    }

    // Current progress indicator
    .vjs-play-progress.vjs-slider-bar {
      background-color: #ba62fd;
    }

    // Current progress indicator "knob"
    .vjs-play-progress:before {
      display: none;
    }

    // Asset loaded indicator
    .vjs-load-progress {
      height: 0.25rem;
      background-color: transparent;
    }

    // All buttons inside Controls Bar
    .vjs-icon-placeholder:before {
      line-height: 3.25rem;
      font-size: 1.5rem;
    }

    // Play Button
    .vjs-play-control {
      order: 1;
      margin-left: 0.25rem;
    }

    // Rewind Button
    .vjs-rewind {
      order: 2;
      display: none;
    }

    // Fast Forward Button
    .vjs-fast-forward {
      order: 3;
      display: none;
    }

    .vjs-time-control {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 3.25rem;
      padding: 0;
      font-size: 0.8rem;
    }

    // Current Time Control
    .vjs-current-time {
      order: 4;
      justify-content: flex-end;
    }

    // Remaining Time (Hidden, not part of design)
    .vjs-remaining-time {
      display: none;
    }

    .vjs-time-divider {
      order: 5;
      width: 4px;
      margin: 0;
      padding: 0;
    }

    // Duration Control
    .vjs-duration {
      order: 5;
      justify-content: flex-start;
      margin-right: auto;
    }

    .vjs-time-tooltip,
    .vjs-volume-tooltip {
      height: 1.5rem;
      display: flex !important;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
    }

    // Volume Control
    .vjs-volume-panel {
      order: 6;
    }

    // Playback Rates Control
    .vjs-playback-rate {
      order: 7;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .vjs-playback-rate-value {
      line-height: 3.25rem;
    }

    // Closed Captions Control
    .vjs-subs-caps-button {
      order: 8;
      display: none;
    }

    // PIP Control
    .vjs-picture-in-picture-control {
      order: 9;
    }

    // Fullscreen Control
    .vjs-fullscreen-control {
      order: 10;
      margin-right: 0.25rem;
    }

    // Markers Button (Disabled on small screens)
    .vjs-markers-button {
      display: none;
    }

    &.vjs-user-active.vjs-has-started + .vjs-markers-button {
      display: block;
    }

    // Big play button (Appears only before video played)
    button.vjs-big-play-button {
      display: none;
    }
  }
}

@media (min-width: 768px) {
  .mv-video-item-container {
    .mv-video-item {
      // For all control items icon
      .vjs-control svg {
        transform: scale(1);
      }

      .vjs-control {
        color: #b3b8c1;
      }

      .vjs-control:hover {
        color: #fff;
      }

      // Rewind Button
      .vjs-rewind {
        order: 2;
        display: flex;
      }

      // Fast Forward Button
      .vjs-fast-forward {
        order: 3;
        display: flex;
      }

      // Closed Captions Control
      .vjs-subs-caps-button {
        order: 8;
        display: block;
      }

      // Fullscreen Control
      .vjs-fullscreen-control {
        margin-right: 0.5rem;
      }

      .vjs-icon-placeholder {
        height: 24px;
      }

      // Overwrite icons to match the design system's icons.
      .vjs-icon-placeholder:before {
        width: 24px;
        height: 24px;
        display: inline-block;
        color: #b3b8c1;
        background-color: #b3b8c1;
        position: relative;
      }

      // This replaces the Play button.
      .vjs-paused .vjs-icon-placeholder:before {
        mask: url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5.52 2.122a1 1 0 0 1 1.02.037l14 9a1 1 0 0 1 0 1.682l-14 9A1 1 0 0 1 5 21V3a1 1 0 0 1 .52-.878Z' fill='%23FFF'/%3E%3C/svg%3E")
          no-repeat 100% 100% !important;
        left: 3px;
      }

      // This replaces the Pause button.
      .vjs-playing .vjs-icon-placeholder:before {
        mask: url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4ZM13 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z' fill='currentColor'/%3E%3C/svg%3E")
          no-repeat 100% 100% !important;
        left: 3px;
      }

      // This replaces the  Mute button.
      .vjs-mute-control .vjs-icon-placeholder:before {
        mask: url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19.777 4.223a1 1 0 1 0-1.414 1.414 9 9 0 0 1 0 12.726 1 1 0 1 0 1.414 1.414 11 11 0 0 0 0-15.554Z' fill='%23000'/%3E%3Cpath d='M16.247 7.753a1 1 0 1 0-1.414 1.414 4 4 0 0 1 0 5.656 1 1 0 1 0 1.414 1.414 6 6 0 0 0 0-8.484ZM12 5a1 1 0 0 0-1.625-.78L5.65 8H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.65l4.725 3.78A1 1 0 0 0 12 19V5Z' fill='currentColor'/%3E%3C/svg%3E%0A")
          no-repeat 100% 100% !important;
      }

      // This replaces the Picture-to-picture button.
      .vjs-picture-in-picture-control .vjs-icon-placeholder:before {
        mask: url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.4 3h19.2C22.92 3 24 4.013 24 5.25v13.5c0 1.238-1.08 2.25-2.4 2.25H2.4C1.08 21 0 19.988 0 18.75V5.25C0 4.013 1.08 3 2.4 3ZM13 11a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6Z' fill='currentColor'/%3E%3C/svg%3E%0A")
          no-repeat 100% 100% !important;
      }

      // // This replaces the Full-screen button.
      [title='Fullscreen'] .vjs-icon-placeholder:before {
        mask: url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 1.75A3.25 3.25 0 0 0 1.75 5v3a1.25 1.25 0 1 0 2.5 0V5A.75.75 0 0 1 5 4.25h3a1.25 1.25 0 1 0 0-2.5H5ZM16 1.75a1.25 1.25 0 1 0 0 2.5h3a.75.75 0 0 1 .75.75v3a1.25 1.25 0 1 0 2.5 0V5A3.25 3.25 0 0 0 19 1.75h-3ZM3 14.75c-.69 0-1.25.56-1.25 1.25v3A3.25 3.25 0 0 0 5 22.25h3a1.25 1.25 0 1 0 0-2.5H5a.75.75 0 0 1-.75-.75v-3c0-.69-.56-1.25-1.25-1.25ZM21 14.75c-.69 0-1.25.56-1.25 1.25v3a.75.75 0 0 1-.75.75h-3a1.25 1.25 0 1 0 0 2.5h3A3.25 3.25 0 0 0 22.25 19v-3c0-.69-.56-1.25-1.25-1.25Z' fill='currentColor'/%3E%3C/svg%3E%0A")
          no-repeat 100% 100%;
      }

      [title='Exit Fullscreen'] .vjs-icon-placeholder:before {
        mask: url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 1.75c-.69 0-1.25.56-1.25 1.25v3a.75.75 0 0 1-.75.75H3a1.25 1.25 0 1 0 0 2.5h3A3.25 3.25 0 0 0 9.25 6V3c0-.69-.56-1.25-1.25-1.25ZM16 1.75c-.69 0-1.25.56-1.25 1.25v3A3.25 3.25 0 0 0 18 9.25h3a1.25 1.25 0 1 0 0-2.5h-3a.75.75 0 0 1-.75-.75V3c0-.69-.56-1.25-1.25-1.25ZM3 14.75a1.25 1.25 0 1 0 0 2.5h3a.75.75 0 0 1 .75.75v3a1.25 1.25 0 1 0 2.5 0v-3A3.25 3.25 0 0 0 6 14.75H3ZM18 14.75A3.25 3.25 0 0 0 14.75 18v3a1.25 1.25 0 1 0 2.5 0v-3a.75.75 0 0 1 .75-.75h3a1.25 1.25 0 1 0 0-2.5h-3Z' fill='%23000'/%3E%3C/svg%3E")
          no-repeat 100% 100%;
      }

      // This replaces and adjust the Caption icon.
      .vjs-subs-caps-button .vjs-icon-placeholder:before {
        mask: url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.6 3H2.4C1.08 3 0 4.013 0 5.25v13.5C0 19.988 1.08 21 2.4 21h19.2c1.32 0 2.4-1.012 2.4-2.25V5.25C24 4.013 22.92 3 21.6 3ZM10.8 9.75H7.2c-.661 0-1.2.505-1.2 1.125v2.25c0 .621.539 1.125 1.2 1.125h3.6v2.25H7.2c-1.985 0-3.6-1.514-3.6-3.375v-2.25C3.6 9.015 5.215 7.5 7.2 7.5h3.6v2.25Zm9.6 0h-3.6c-.661 0-1.2.505-1.2 1.125v2.25c0 .621.539 1.125 1.2 1.125h3.6v2.25h-3.6c-1.985 0-3.6-1.514-3.6-3.375v-2.25c0-1.86 1.615-3.375 3.6-3.375h3.6v2.25Z' fill='%23000'/%3E%3C/svg%3E%0A")
          no-repeat 100% 100% !important;
        left: -2px;
      }

      // This adjust the position of the mute button
      .vjs-mute-control .vjs-icon-placeholder:before {
        left: 5px;
      }

      .vjs-icon-placeholder:hover:before {
        color: white;
        background-color: white;
      }

      // This removes the circle icon on the volume bar.
      .vjs-volume-level:before {
        content: '';
      }

      // This makes the volume bar thicker and have rounded borders.
      .vjs-volume-bar.vjs-slider-horizontal {
        width: 15em;
        height: 0.5em;
        border-radius: 1em;
      }

      .vjs-slider-horizontal .vjs-volume-level {
        height: 0.5em;
        border-radius: 1em;
      }

      // This removes the black line indicator when use hovers to the volume bar.
      .vjs-mouse-display {
        width: 0 !important;
      }

      // This removes the caption settings
      .vjs-texttrack-settings {
        display: none;
      }
    }
  }
}
</style>
