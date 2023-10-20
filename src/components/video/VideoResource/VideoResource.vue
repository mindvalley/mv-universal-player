<script setup lang="ts">
import type { Source, Marker, Player } from './../../../types/video'
import MVVideoItem from '../VideoItem'
import MVVideoControls from './../VideoControls'
import { ref, defineExpose } from 'vue-demi'

const props = defineProps({
  id: {
    required: true,
    type: String
  },
  duration: {
    required: true,
    type: Number
  },
  playbackRates: {
    type: Array<Number>,
    default: () => [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  },
  showPlaybackRates: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean
  },
  posterUrl: {
    type: String,
    default: ''
  },
  sources: {
    type: Array<Source>,
    required: true,
    default: () => []
  },
  muted: {
    type: Boolean,
    default: false
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  markers: {
    type: Array<Marker>,
    default: () => []
  },
  progressControl: {
    type: Boolean,
    default: true
  },
  overlayControls: {
    type: Boolean,
    default: false
  },
  pictureInPicture: {
    type: Boolean,
    default: false
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
  (e: 'fullscreen', { isFullscreen }: any): void
  (e: 'error', payload: any): void
  (e: any, payload: any): void
}>()

const emitEvent = (eventName: string, payload?: any) => {
  const data = { id: props.id, ...payload }
  emit(eventName, data)
}

const videoItem = ref()

const play = () => {
  videoItem.value?.player?.play()
}

const pause = () => {
  videoItem.value?.player?.pause()
}

const setVolume = (volume: number) => {
  videoItem.value?.player?.setVolume(volume)
}

const setCurrentTime = (time: number) => {
  if (!videoItem.value.state.playing) {
    play()
  }
  videoItem.value?.player?.setCurrentTime(time)
}

const setSources = (sources: Source[]) => {
  videoItem.value?.player?.setSources(sources)
}

const setPlaybackRate = (rate: number) => {
  videoItem.value?.player?.setPlaybackRate(rate)
}

const mute = () => {
  videoItem.value?.player?.mute()
}

const unmute = () => {
  videoItem.value?.player?.unmute()
}

const goFullScreen = () => {
  videoItem.value?.player?.goFullScreen()
}

const player: Player = {
  play,
  pause,
  setVolume,
  setCurrentTime,
  setSources,
  setPlaybackRate,
  mute,
  unmute,
  goFullScreen
}

defineExpose({
  player: player
})
</script>

<template>
  <section>
    <MVVideoItem
      ref="videoItem"
      :sources="sources"
      :id="id"
      :posterUrl="posterUrl"
      :markers="markers"
      :duration="duration"
      :autoplay="autoplay"
      :progressControl="progressControl"
      :overlay-controls="overlayControls"
      :picture-in-picture="pictureInPicture"
      :muted="muted"
      :loop="loop"
      :show-playback-rates="showPlaybackRates"
      @play="emitEvent('play', $event)"
      @pause="emitEvent('pause', $event)"
      @seeking="emitEvent('seeking', $event)"
      @ended="emitEvent('ended', $event)"
      @rewind="emitEvent('rewind', $event)"
      @fastforward="emitEvent('fastforward', $event)"
      @playbackSpeed="emitEvent('playbackSpeed', $event)"
      @timeupdate="emitEvent('timeupdate', $event)"
      @fullscreen="emitEvent('fullscreen', $event)"
      @error="emitEvent('error', $event)"
    >
      <template #video-controls="{ state, play, pause, mute, unmute, goFullScreen }">
        <MVVideoControls
          :playing="state.playing"
          :mute="state.muted"
          :show-full-screen="!state.ended"
          :show-replay="state.ended"
          :show-play="!state.ended"
          :show-mute="!state.ended"
          @replay="play"
          @play="play"
          @pause="pause"
          @mute="mute"
          @unmute="unmute"
          @fullscreen="goFullScreen"
        />
      </template>
    </MVVideoItem>

    <slot name="video-description"></slot>
  </section>
</template>
