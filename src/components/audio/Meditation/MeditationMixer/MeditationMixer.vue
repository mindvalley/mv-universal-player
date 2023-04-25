<script setup lang="ts">
import { MVAudioPlayer } from './../../AudioPlayer'
</script>

<template>
  <MVAudioPlayer loop>
    <slot></slot>
  </MVAudioPlayer>
</template>
