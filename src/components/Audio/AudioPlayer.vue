<script setup lang="ts">
import { stringify } from 'querystring'
import VideoJsPlayer from 'video.js'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
export interface Props {}

export interface Source {
  type: string
  src: string
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
  audioInstance = createInstance(props.id, { controls: false, playbackRates: props.playbackRates })
  updateSources(props.sources)
}

const createInstance = (id: string, options: any) => {
  if (id && id.trim()) {
    return VideoJsPlayer(id, options)
  }
}

const updateSources = (sources: Source[]) => {
  if (audioInstance) {
    audioInstance.src(sources)
  }
}

const play = () => {
  if (audioInstance) {
    audioInstance.play()
  }
}

const pause = () => {
  if (audioInstance) {
    audioInstance.pause()
  }
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
  </div>
</template>

<style scoped>
.mv-universal-player--audio {
  display: none;
}
</style>
