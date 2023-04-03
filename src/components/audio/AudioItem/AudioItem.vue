<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue-demi'
import { Player } from '../../../types/audio'

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-audio-item-' + Math.random().toString().replace('.', '')
  }
})

const state: any = inject('state')
const player: Player = inject('player')
const playing = ref(false)

watch(
  state,
  (newState) => {
    if (newState.playing) {
      if (newState.audioItemId === props.id) {
        playing.value = true
      } else {
        playing.value = false
      }
    } else {
      playing.value = false
    }
  },
  { deep: true }
)

const play = () => {
  if (player) {
    player.play(props.id)
  }
}

const pause = () => {
  if (player) {
    player.pause()
  }
}

const rewind = (seconds: number) => {
  console.log('rewind ---')
  if (player && seconds) {
    player.setCurrentTime(state.value.currentTime - seconds)
  }
}

const fastForward = (seconds: number) => {
  if (player && seconds) {
    player.setCurrentTime(state.value.currentTime + seconds)
  }
}
</script>
<template>
  {{ state.currentTime }}

  <slot
    :play="play"
    :pause="pause"
    :playing="playing"
    :rewind="rewind"
    :fastForward="fastForward"
  ></slot>
</template>
