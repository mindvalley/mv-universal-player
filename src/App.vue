<template>
  <div>App Component</div>
  <AudioPlayer id="amit" v-slot="{ player, state }" @play="play1" @pause="paused1">
    {{ state }}
    <button @click="player.play">Play</button>
    <button @click="player.pause">Pause</button>
  </AudioPlayer>
</template>

<script setup lang="ts">
import AudioPlayer from './components/Audio/AudioPlayer.vue'

const play1 = (event?: any) => {
  console.log('play clicked')
  console.log(event)
}

const paused1 = (event?: any) => {
  console.log('pause clicked')
  console.log(event)
}
</script>
