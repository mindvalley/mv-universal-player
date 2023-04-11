<script setup lang="ts">
import AudioPlayer from '../../AudioPlayer/AudioPlayer.vue'
import { inject, provide } from 'vue-demi'

const state: any = inject('state')
const player: any = inject('player')
provide('mainState', state)
provide('mainPlayer', player)
</script>
<template>
  <AudioPlayer loop>
    <slot></slot>
  </AudioPlayer>
</template>
