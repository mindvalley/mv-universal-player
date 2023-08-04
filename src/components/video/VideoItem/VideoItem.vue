<script setup lang="ts">
import { inject, provide, ref, toRefs, reactive, watch, readonly, computed } from 'vue-demi'
import type { Player, Source } from '../../../types/video'

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-video-item-' + Math.random().toString().replace('.', '')
  },
  sources: {
    type: Array<Source>,
    required: true,
    default: () => []
  },
  posterUrl: {
    type: String,
    default: () => ''
  }
})

const videoState: any = inject('videoState')
const videoPlayer: Player = inject('videoPlayer', {} as Player)
const playing = ref(false)
const currentTime = ref(0)

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

watch(
  () => videoState.value.error,
  (error) => {
    if (props.id === videoState.value.videoItemId) {
      if (error) {
        emit('error', error)
      }
    }
  }
)

watch(
  [() => videoState.value.playing, () => videoState.value.videoItemId],
  ([newPlaying, newvideoItemId]) => {
    if (props.id === newvideoItemId) {
      if (newPlaying) {
        emit('play', { currentTime: currentTime.value.toFixed(2) })
      }
    }
  }
)

watch(
  () => videoState.value.paused,
  (paused) => {
    if (props.id === videoState.value.videoItemId) {
      if (paused) {
        emit('pause', { currentTime: currentTime.value.toFixed(2) })
      }
    }
  }
)

watch(
  () => videoState.value.currentTime,
  (currentTime) => {
    if (props.id === videoState.value.videoItemId) {
      emit('timeupdate', { currentTime: currentTime.toFixed(2) })
    }
  }
)

watch(
  () => videoState.value.ended,
  (ended) => {
    if (props.id === videoState.value.videoItemId) {
      if (ended) {
        emit('ended', { currentTime: currentTime.value.toFixed(2) })
        currentTime.value = 0
      }
    }
  }
)

watch(
  () => videoState.value.playbackRate,
  (playbackRate) => {
    if (props.id === videoState.value.videoItemId) {
      emit('playbackSpeed', { playbackSpeed: playbackRate })
    }
  }
)

watch(
  [() => videoState.value.playing, () => videoState.value.videoItemId],
  ([newPlaying, newvideoItemId]) => {
    if (newPlaying) {
      if (newvideoItemId === props.id) {
        playing.value = true
      } else {
        // At a time any one player plays the video and rest will be paused
        playing.value = false
      }
    } else {
      playing.value = false
    }
  }
)

watch(
  () => videoState.value.currentTime,
  (newCurrentTime) => {
    if (videoState.value.videoItemId === props.id) {
      currentTime.value = newCurrentTime
    } else {
      currentTime.value = 0
    }
  }
)

watch(
  [() => currentTime.value, () => playing.value],
  ([newCurrentTime, newPlaying], [oldCurrentTime, oldPlaying]) => {
    if (oldCurrentTime !== 0 && newCurrentTime === 0) {
      emit('reset', { currentTime: currentTime.value })
    }
  }
)

const play = () => {
  if (videoState.value.videoItemId !== props.id) {
    videoPlayer.setSources(props.sources)
  }
  videoPlayer.play(props.id)
}

const pause = () => {
  videoPlayer.pause()
}

const rewind = (seconds: number) => {
  if (
    videoState.value.videoItemId === props.id &&
    videoPlayer &&
    seconds >= 0 &&
    videoState.value.playing
  ) {
    const currentTime =
      videoState.value.currentTime - seconds >= 0 ? videoState.value.currentTime - seconds : 0
    emit('rewind', {
      previousTime: videoState.value.currentTime.toFixed(2),
      currentTime: currentTime.toFixed(2)
    })
    videoPlayer.setCurrentTime(currentTime)
  }
}

const fastForward = (seconds: number) => {
  if (
    videoState.value.videoItemId === props.id &&
    videoPlayer &&
    seconds >= 0 &&
    videoState.value.playing
  ) {
    const currentTime = videoState.value.currentTime + seconds
    emit('fastforward', {
      previousTime: videoState.value.currentTime.toFixed(2),
      currentTime: currentTime.toFixed(2)
    })
    videoPlayer.setCurrentTime(currentTime)
  }
}

const seek = (time: number) => {
  if (videoState.value.videoItemId === props.id) {
    emit('seeking', { seeking: time.toFixed(2) })
    videoPlayer.setCurrentTime(time)
  }
}

const setvideo = () => {
  // We are not checking for specific videoItemId because in background mixer the video sources can be set before it is being played.
  videoPlayer.setVideo(props.id)
  videoPlayer.setSources(props.sources)
}

const setVolume = (volume: number) => {
  if (videoState.value.videoItemId === props.id) {
    videoPlayer.setVolume(volume)
  }
}

const setPlaybackRate = (rate: number) => {
  if (videoState.value.videoItemId === props.id) {
    videoPlayer.setPlaybackRate(rate)
  }
}

const setSources = (sources: Source[]) => {
  // We are not checking for specific videoItemId because in background mixer the video sources can be set before it is being played.
  videoPlayer.setSources(sources)
}

const setCurrentTime = (time: number) => {
  videoPlayer.setCurrentTime(time)
  currentTime.value = time
}

const reset = () => {
  if (videoState.value.videoItemId === props.id) {
    setCurrentTime(0)
  }
}

const currentPlayingvideoItemId = computed(() => {
  return videoState.value.videoItemId
})

const mixing = computed(() => {
  return videoState.value.mixing
})

const volume = computed(() => {
  return videoState.value.volume
})

const videoItemPlayer = {
  play: play,
  pause: pause,
  setvideo: setvideo,
  setVolume: setVolume,
  seek: seek,
  fastForward: fastForward,
  rewind: rewind,
  setPlaybackRate: setPlaybackRate,
  setSources: setSources,
  setCurrentTime: setCurrentTime,
  reset: reset
}

const videoItemState = ref({
  currentTime: currentTime,
  playing: playing,
  currentPlayingvideoItemId: currentPlayingvideoItemId,
  mixing: mixing,
  volume: volume
})

provide('videoItemPlayer', videoItemPlayer)
provide('videoItemState', videoItemState)

defineExpose({
  player: videoItemPlayer,
  state: readonly(videoItemState)
})
</script>

<template>
  <div class="w-full">
    <slot
      :play="play"
      :pause="pause"
      :setvideo="setvideo"
      :setVolume="setVolume"
      :seek="seek"
      :fastForward="fastForward"
      :rewind="rewind"
      :setPlaybackRate="setPlaybackRate"
      :setSources="setSources"
      :setCurrentTime="setCurrentTime"
      :reset="reset"
      :player="videoItemPlayer"
      :state="videoItemState"
    ></slot>
  </div>
</template>
