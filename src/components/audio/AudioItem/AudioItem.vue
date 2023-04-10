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
    console.log('3')

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

defineExpose({
  play: play,
  pause: pause,
  setAudio: setAudio
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
      :seek="seek"
      :currentTime="currentTime"
      :id="id"
    ></slot>
  </div>
</template>
