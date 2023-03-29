<template>
  <div>App Component</div>
  <AudioPlayer id="amit" v-slot="{ player }">
    <button @click="player.play">Play</button>
    <button @click="player.pause">Pause</button>
  </AudioPlayer>
</template>

<script setup lang="ts">
import AudioPlayer from './components/Audio/AudioPlayer.vue'
</script>
