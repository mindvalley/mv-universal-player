<script setup lang="ts">
import VideoJsPlayer from 'video.js'
import {
  onMounted,
  onUnmounted,
  ref,
  defineEmits,
  watch,
  provide,
  readonly,
  defineExpose
} from 'vue-demi'
import type { Player, Source } from '../../../types/audio'

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
    default: () => 'mv-audio-player-' + Math.random().toString().replace('.', '')
  },
  playbackRates: {
    type: Array<Number>,
    default: () => {
      return [0.5, 1, 2]
    }
  },
  loop: {
    type: Boolean
  }
})

let audioInstance: any
let state = ref({} as PlayerState)
const emit = defineEmits(['play', 'pause', 'timeupdate', 'seeking', 'ended', 'ready'])

watch(
  () => state.value.playing,
  (playing) => {
    if (playing) {
      emit('play')
    }
  }
)

watch(
  () => state.value.paused,
  (paused) => {
    if (paused) {
      emit('pause')
    }
  }
)

watch(
  () => state.value.currentTime,
  (currentTime) => {
    emit('timeupdate', { currentTime: currentTime })
  }
)

watch(
  () => state.value.seeking,
  (seeking) => {
    emit('seeking', { seeking: seeking })
  }
)

watch(
  () => state.value.ended,
  (ended) => {
    if (ended) {
      emit('ended')
    }
  }
)

onMounted(() => {
  initialize(props.id, props.loop)
})

onUnmounted(() => {
  audioInstance.dispose()

  if (audioInstance) {
    audioInstance.dispose()
  }
})

const initialize = (id: string, loop = false) => {
  audioInstance = createInstance(id, {
    controls: false,
    playbackRates: props.playbackRates,
    loop: loop
  })
  createState()
  updateState('ready', true)
  emit('ready')
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
    audioInstance.on(baseEvents.concat((target as any).events ?? []), () => {
      updateState(key, target.getter(audioInstance))
    })
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
    emit('play')
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
  if (audioInstance && time) {
    audioInstance.currentTime(time)
  }
}

const setAudio = (audioItemId: string) => {
  updateState('audioItemId', audioItemId)
}

const setPlaybackRate = (rate: number) => {
  audioInstance.playbackRate(rate)
}

const player: Player = {
  play,
  pause,
  setVolume,
  setCurrentTime,
  setSources,
  setAudio,
  setPlaybackRate
}

defineExpose({
  player: player,
  state: readonly(state)
})

provide('player', player)
provide('state', readonly(state))
provide(`${props.id}_player`, player)
provide(`${props.id}_state`, readonly(state))
</script>

<template>
  <div class="mv-universal-player-container w-full">
    <video
      :data-testid="props.id"
      :id="props.id"
      class="video-js mv-universal-player--audio"
      webkit-playsinline
      playsinline
    >
      <p class="vjs-no-js">
        To play the audio please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video</a>
      </p>
    </video>
    <slot :state="state" :player="player"></slot>
  </div>
</template>

<style scoped>
.mv-universal-player--audio {
  display: none;
}
</style>
