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

const count = ref(0)
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
  <button @click="count++">increase</button>
  <Teleport to="#teleport-id">
    <div>
      <div>{{ count }}</div>
      <div class="hello">hello from teleport</div>
      <video :data-testid="audioId" :id="audioId" class="video-js vjs-default-skin">
        <source src="//vjs.zencdn.net/v/oceans.mp4" />
      </video>
    </div>
  </Teleport>
</template>

<style>
.hello {
  color: red;
}
</style>
