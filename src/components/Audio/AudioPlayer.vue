<script setup lang="ts">
import VideoJsPlayer from 'video.js'
import { onMounted, onUnmounted, ref, defineEmits, watch } from 'vue-demi'

interface Source {
  type: string
  src: string
}
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
    default: 'mv-audio-player-' + Math.random().toString().replace('.', '')
  },
  playbackRates: {
    type: Array<Number>,
    default() {
      return [0.25, 0.5, 1, 2]
    }
  },
  sources: {
    type: Array<Source>,
    default() {
      return []
    }
  }
})

let audioInstance: any
let state = ref({} as PlayerState)
const emit = defineEmits(['play', 'pause', 'timeupdate', 'seeking', 'ended', 'ready'])

watch(
  () => state.value.playing == true,
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
  initialize()
})

onUnmounted(() => {
  audioInstance.dispose()

  if (audioInstance) {
    audioInstance.dispose()
  }
})

const initialize = () => {
  audioInstance = createInstance(props.id, {
    controls: false,
    playbackRates: props.playbackRates
  })
  setSources(props.sources)
  createState()

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
    const baseEvents = ['loadstart', 'loadedmetadata']
    audioInstance.on(baseEvents.concat((target as any).events ?? []), () => {
      console.log('fire ---')
      updateState(key, target.getter(audioInstance))
    })
  })

  console.log('----state -----')
  console.log(state)
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
  if (audioInstance && sources.length > 0) {
    audioInstance.src(sources)
  }
}

const play = () => {
  if (audioInstance) {
    audioInstance.play()
    emit('play', 'hello play')
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

const player = {
  play,
  pause,
  setVolume,
  setCurrentTime
}
</script>
<template>
  <div class="mv-universal-player-container">
    <div class="hello">hello</div>
    <video
      :data-testid="props.id"
      :id="props.id"
      class="video-js mv-universal-player--audio"
      webkit-playsinline
      playsinline
    >
      <source src="//vjs.zencdn.net/v/oceans.mp4" />
      <p class="vjs-no-js">
        To play the audio please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video</a>
      </p>
    </video>
    <slot :player="player" :state="state"></slot>
  </div>
</template>

<style scoped>
.mv-universal-player--audio {
  display: none;
}
</style>
