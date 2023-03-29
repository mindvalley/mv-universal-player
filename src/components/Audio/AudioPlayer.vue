<script setup lang="ts">
import VideoJsPlayer from 'video.js'
import { onMounted, reactive, ref } from 'vue'
import 'video.js/dist/video-js.css'
export interface Props {}

export interface Source {
  type: string
  src: string
}

// eslint-disable-next-line vue/no-setup-props-destructure
// const { id = 'audioPlayer' } = defineProps<Props>()
const audioId = 'mv-audio-player-' + Math.random().toString().replace('.', '')
let audioInstance: any

// const sources: Source[] = reactive()

onMounted(() => {
  audioInstance = createInstance(audioId, { controls: true, playbackRates: [0.25, 0.5, 1, 2] })
})

function createInstance(id: string, options: any) {
  if (id && id.trim()) {
    return VideoJsPlayer(id, options)
  } else {
    throw 'Id is required'
  }
}
</script>
<template>
  <div class="hello">hello</div>
  <video :data-testid="audioId" :id="audioId" class="video-js vjs-default-skin">
    <source src="//vjs.zencdn.net/v/oceans.mp4" />
  </video>
</template>

<style scoped>
.hello {
  color: red;
}
</style>
