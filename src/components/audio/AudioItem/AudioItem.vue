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
  if (state.value.audioItemId !== props.id) {
    console.log('props =')
    console.log(props.sources)

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
