<script setup lang="ts">
import VideoJsPlayer from 'video.js'
import 'video.js/dist/video-js.css'
import { onMounted, onUnmounted, ref, provide, readonly, defineExpose } from 'vue-demi'
import type { Player, Source } from '../../../../types/audio'

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
  audioItemId: {
    getter: (player: any) => ''
  },
  mixing: {
    getter: (player: any) => false
  }
}

type PlayerBaseState = {
  [K in keyof typeof StateConfig]: ReturnType<(typeof StateConfig)[K]['getter']>
}

interface PlayerState extends PlayerBaseState {
  playing: boolean
  waiting: boolean
  audioItemId: string
}

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-adaptive-player-' + Math.random().toString().replace('.', '')
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
  },
  audioOnlyMode: {
    type: Boolean,
    default: false
  },
  muted: {
    type: Boolean,
    default: false
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
})

let audioInstance: any
let state = ref({} as PlayerState)
const hideVideo = ref(props.audioOnlyMode)

onMounted(() => {
  setTimeout(() => {
    initialize(props.id)
  }, 0)
})

onUnmounted(() => {
  if (audioInstance) {
    audioInstance.dispose()
  }
})

const initialize = (id: string) => {
  audioInstance = createInstance(id, {
    poster: props.posterUrl,
    fluid: true,
    muted: props.muted,
    controls: false,
    autoplay: props.autoPlay,
    playbackRates: props.playbackRates,
    loop: props.loop,
    audioOnlyMode: props.audioOnlyMode,
    aspectRatio: '16:9'
  })

  createState()
  updateState('ready', true)
}

const createState = () => {
  const keys = Object.keys(StateConfig) as Array<keyof typeof StateConfig>
  state.value = keys.reduce(
    (result, key) => ({ ...result, [key]: StateConfig[key].getter(audioInstance) }),
    {
      playing: false,
      waiting: false
    } as any
  )

  // playing state https://github.com/videojs/video.js/issues/181
  // un-loop: play > playing > pause > ended
  // loop: play > playing > [ended > restart] waiting > playing
  audioInstance.on(['pause', 'ended'], () => {
    updateState('playing', false)
  })
  audioInstance.on(['play', 'playing'], () => {
    updateState('playing', true)
  })

  keys.forEach((key) => {
    const target = StateConfig[key]
    // const baseEvents = ['loadstart', 'loadedmetadata']
    const baseEvents = ['']
    audioInstance.on(
      baseEvents.concat((target as any).events ? (target as any).events : []),
      () => {
        updateState(key, target.getter(audioInstance))
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
  if (audioInstance && sources?.length > 0) {
    audioInstance.src(sources)
  }
}

const play = (audioItemId: string) => {
  if (audioInstance && audioItemId) {
    setAudio(audioItemId)
    audioInstance.play()
  }
}

const pause = () => {
  if (audioInstance) {
    audioInstance.pause()
  }
}

const setVolume = (volume: number) => {
  if (audioInstance) {
    audioInstance.volume(volume)
  }
}

const setCurrentTime = (time: number) => {
  if (audioInstance) {
    audioInstance.currentTime(time)
  }
}

const setAudio = (audioItemId: string) => {
  updateState('audioItemId', audioItemId)
}

const setPlaybackRate = (rate: number) => {
  audioInstance.playbackRate(rate)
}

const setMixing = (enabled: boolean) => {
  updateState('mixing', enabled)
}

const goFullScreen = () => {
  if (audioInstance) {
    audioInstance.requestFullscreen()
  }
}

const setAudioOnlyMode = (enabled: boolean) => {
  if (audioInstance) {
    hideVideo.value = enabled
    audioInstance.audioOnlyMode(enabled)
  }
}

const setAudioPosterMode = (enabled: boolean) => {
  if (audioInstance) {
    audioInstance.audioPosterMode(enabled)
  }
}

const player: Player = {
  play,
  pause,
  setVolume,
  setCurrentTime,
  setSources,
  setAudio,
  setPlaybackRate,
  setMixing,
  goFullScreen,
  setAudioOnlyMode,
  setAudioPosterMode
}

defineExpose({
  player: player,
  state: readonly(state)
})

provide('audioPlayer', player)
provide('audioState', readonly(state))
</script>

<template>
  <div class="mv-universal-player-container h-full w-full">
    <div class="h-full w-full" :class="[hideVideo ? 'hidden' : 'flex items-center justify-center']">
      <video
        :data-testid="props.id"
        :id="props.id"
        class="video-js h-full w-full"
        webkit-playsinline
        playsinline
      >
        <p class="vjs-no-js">
          To play the audio please enable JavaScript, and consider upgrading to a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video</a
          >
        </p>
      </video>
    </div>
    <slot
      :state="state"
      :player="player"
      :play="play"
      :pause="pause"
      :setVolume="setVolume"
      :setCurrentTime="setCurrentTime"
      :setSources="setSources"
      :setAudio="setAudio"
      :setPlaybackRate="setPlaybackRate"
      :setMixing="setMixing"
    ></slot>
  </div>
</template>

<style scoped lang="scss">
:deep(.vjs-poster) {
  height: 100% !important;
  width: 100% !important;

  img {
    object-fit: cover !important;
  }
}

:deep(.video-js) {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
}

:deep(.video-js video) {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
}

:deep(.vjs-tech) {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
}
</style>
