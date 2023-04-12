<script setup lang="ts">
import { inject, ref, watch } from 'vue-demi'
import type { Player, Source } from '../../../types/audio'

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-audio-item-' + Math.random().toString().replace('.', '')
  },
  sources: {
    type: Array<Source>,
    required: true
  }
})

const state: any = inject('state')
const player: Player = inject('player', {} as Player)
const playing = ref(false)
const currentTime = ref(0)
const emit = defineEmits<{
  (e: 'currentTime', currentTime: number): void
}>()

watch(
  [() => state.value.playing, () => state.value.audioItemId],
  ([newPlaying, newAudioItemId]) => {
    if (newPlaying) {
      if (newAudioItemId === props.id) {
        playing.value = true
      } else {
        playing.value = false
      }
    } else {
      playing.value = false
    }
  }
)

watch(
  [() => state.value.currentTime, () => state.value.audioItemId],
  ([newCurrentTime, newAudioItemId]) => {
    if (newAudioItemId === props.id) {
      currentTime.value = newCurrentTime
      emit('currentTime', currentTime.value)
    }
  }
)

const play = () => {
  if (state.value.audioItemId !== props.id) {
    player.setSources(props.sources)
  }

  player.play(props.id)
}

const pause = () => {
  player.pause()
}

const rewind = (seconds: number) => {
  if (state.value.audioItemId === props.id && player && seconds) {
    player.setCurrentTime(state.value.currentTime - seconds)
  }
}

const fastForward = (seconds: number) => {
  if (state.value.audioItemId === props.id && player && seconds) {
    player.setCurrentTime(state.value.currentTime + seconds)
  }
}

const seek = (time: number) => {
  player.setCurrentTime(time)
}

const setAudio = () => {
  player.setAudio(props.id)
  player.setSources(props.sources)
}

const setVolume = (volume: number) => {
  player.setVolume(volume)
}

const setPlaybackRate = (rate: number) => {
  player.playbackRate(rate)
}

const setSources = (sources: Source[]) => {
  player.setSources(sources)
}

defineExpose({
  play: play,
  pause: pause,
  setAudio: setAudio,
  setVolume: setVolume,
  seek: seek,
  fastForward: fastForward,
  rewind: rewind,
  setPlaybackRate: setPlaybackRate,
  setSources: setSources
})
</script>

<template>
  <div>
    <slot
      :play="play"
      :pause="pause"
      :playing="playing"
      :rewind="rewind"
      :fastForward="fastForward"
      :setPlaybackRate="setPlaybackRate"
      :setAudio="setAudio"
      :setSources="setSources"
      :seek="seek"
      :currentTime="currentTime"
      :id="id"
    ></slot>
  </div>
</template>
