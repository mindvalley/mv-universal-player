<script setup lang="ts">
import type { Source } from './../../../types/video'
import { useDetectBrowser } from './../../../composables/use-detect-browser'
import MVVideoItem from '../VideoItem'
import { useSlots, computed, ref } from 'vue-demi'

const props = defineProps({
  assetId: {
    required: true,
    type: String
  },
  sources: {
    required: true,
    type: Array<Source>
  },
  title: {
    required: true,
    type: String
  },
  artistName: {
    type: String,
    default: ''
  },
  duration: {
    required: true,
    type: Number
  },
  posterUrl: {
    type: String
  },
  ratings: {
    type: Number
  },
  totalRatings: {
    type: Number
  },
  overlay: {
    type: Boolean
  },
  blurEffect: {
    type: Boolean
  },
  showFavourite: {
    type: Boolean
  },
  isFavourite: {
    type: Boolean
  }
})

const emit = defineEmits<{
  (e: 'timeupdate', { currentTime }: any): void
  (e: 'play', { currentTime }: any): void
  (e: 'pause', { currentTime }: any): void
  (e: 'seeking', { seeking }: any): void
  (e: 'ended', { currentTime }: any): void
  (e: 'rewind', { previousTime, currentTime }: any): void
  (e: 'fastforward', { previousTime, currentTime }: any): void
  (e: 'reset', { currentTime }: any): void
  (e: 'error', payload: any): void
  (e: any, payload: any): void
}>()

const emitEvent = (eventName: string, payload?: any) => {
  const data = { assetId: props.assetId, ...payload }
  emit(eventName, data)
}

const isFavourite = ref(props.isFavourite)

const handleFavourite = () => {
  isFavourite.value = !isFavourite.value
  emitEvent('favourite', { isFavourite: isFavourite.value })
}
</script>

<template>
  <section>
    <MVVideoItem
      v-slot="{ state, seek, play, pause, rewind, fastForward }"
      :sources="sources"
      :id="assetId"
      :posterUrl="posterUrl"
      @play="emitEvent('play', $event)"
      @pause="emitEvent('pause', $event)"
      @seeking="emitEvent('seeking', $event)"
      @ended="emitEvent('ended', $event)"
      @rewind="emitEvent('rewind', $event)"
      @fastforward="emitEvent('fastforward', $event)"
      @playbackSpeed="emitEvent('playbackSpeed', $event)"
      @timeupdate="emitEvent('timeupdate', $event)"
      @reset="emitEvent('reset', $event)"
      @error="emitEvent('error', $event)"
    >
      <button @click="play">Play</button>
    </MVVideoItem>

    <slot name="video-description"></slot>
  </section>
</template>
