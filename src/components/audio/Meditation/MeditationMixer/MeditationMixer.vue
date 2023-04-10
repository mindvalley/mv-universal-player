<script setup lang="ts">
import AudioPlayer from '../../AudioPlayer/AudioPlayer.vue'
import { inject, provide } from 'vue-demi'

const state: any = inject('state')
provide('mainState', state)
</script>
<template>
  <AudioPlayer loop>
    <slot></slot>
  </AudioPlayer>
</template>
