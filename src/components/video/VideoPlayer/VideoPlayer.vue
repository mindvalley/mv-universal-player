<script setup lang="ts">
import VideoJsPlayer from 'video.js'
import 'video.js/dist/video-js.css'
import { onMounted, onUnmounted, ref, provide, readonly, defineExpose } from 'vue-demi'
import type { Player, Source } from '../../../types/video'

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
    events: ['volumechange'],
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
  videoItemId: {
    getter: (player: any) => ''
  }
}

type PlayerBaseState = {
  [K in keyof typeof StateConfig]: ReturnType<(typeof StateConfig)[K]['getter']>
}

interface PlayerState extends PlayerBaseState {
  playing: boolean
  waiting: boolean
  videoItemId: string
}

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-video-player-' + Math.random().toString().replace('.', '')
  },
  playbackRates: {
    type: Array<Number>,
    default: () => {
      return [0.5, 1, 2]
    }
  },
  loop: {
    type: Boolean
  },
  posterUrl: {
    type: String,
    default: ''
  }
})

let videoInstance: any
let state = ref({} as PlayerState)

onMounted(() => {
  initialize(props.id, props.loop)
})

onUnmounted(() => {
  videoInstance.dispose()

  if (videoInstance) {
    videoInstance.dispose()
  }
})

const initialize = (id: string, loop = false) => {
  videoInstance = createInstance(id, {
    poster: props.posterUrl,
    fluid: true,
    controls: true,
    html5: {
      vhs: {
        overrideNative: true
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    },
    playbackRates: props.playbackRates
    // controlBar: {
    //   pictureInPictureToggle: false
    // }
  })

  createState()
  updateState('ready', true)
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

const play = (videoItemId: string) => {
  if (videoInstance && videoItemId) {
    setVideo(videoItemId)
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

const setVideo = (videoItemId: string) => {
  updateState('videoItemId', videoItemId)
}

const setPlaybackRate = (rate: number) => {
  videoInstance.playbackRate(rate)
}

const player: Player = {
  play,
  pause,
  setVolume,
  setCurrentTime,
  setSources,
  setVideo,
  setPlaybackRate
}

defineExpose({
  player: player,
  state: readonly(state)
})

provide('videoPlayer', player)
provide('videoState', readonly(state))
</script>

<template>
  <div class="mv-universal-player-container w-full">
    <video :data-testid="props.id" :id="props.id" class="video-js mv-universal-player--video">
      <p class="vjs-no-js">
        To play the video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video</a>
      </p>
    </video>
    <slot
      :state="state"
      :player="player"
      :play="play"
      :pause="pause"
      :setVolume="setVolume"
      :setCurrentTime="setCurrentTime"
      :setSources="setSources"
      :setVideo="setVideo"
      :setPlaybackRate="setPlaybackRate"
    ></slot>
  </div>
</template>

<style scoped>
.mv-universal-player--video {
  /* display: none; */
}
</style>
