<script setup lang="ts">
import { defineProps, defineEmits } from 'vue-demi'
import AdaptivePlayButton from '../AdaptivePlayButton/AdaptivePlayButton.vue'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  audioSources: {
    type: Array,
    default: () => []
  },
  videoSources: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    default: ''
  },
  showBookmark: {
    type: Boolean,
    default: false
  },
  posterUrl: {
    type: String,
    default: ''
  },
  showMeditationMixer: {
    type: Boolean,
    default: false
  },
  showImmersive: {
    type: Boolean,
    default: false
  },
  showCollections: {
    type: Boolean,
    default: false
  },
  showSetDuration: {
    type: [Boolean, String],
    default: false
  },
  showPlaybackSpeed: {
    type: [Boolean, String],
    default: false
  }
})

const emit = defineEmits([
  'timeUpdate',
  'play',
  'pause',
  'ended',
  'playtime',
  'bookmark',
  'error',
  'playbackSpeed',
  'minimize',
  'maximize',
  'fastForward',
  'rewind',
  'close',
  'meditationMixerClick',
  'collectionClick'
])
</script>

<template>
  <div class="w-full h-20 bg-black items-center flex justify-center">
    <div><AdaptivePlayButton /></div>
  </div>
</template>
