<script setup lang="ts">
import { inject, provide, ref, watch, readonly, computed } from 'vue-demi'
import type { Player, Source } from '../../../../types/audio'

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-adaptive-item-' + Math.random().toString().replace('.', '')
  },
  sources: {
    type: Array<Source>,
    required: true,
    default: () => []
  }
})

const adaptiveState: any = inject('audioState')
const adaptivePlayer: Player = inject('audioPlayer', {} as Player)
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
  (e: 'playbackSpeed', { playbackSpeed }: any): void
  (e: any, payload: any): void
}>()

watch(
  () => adaptiveState.value.error,
  (error) => {
    if (props.id === adaptiveState.value.audioItemId) {
      if (error) {
        emit('error', error)
      }
    }
  }
)

watch(
  [() => adaptiveState.value.playing, () => adaptiveState.value.audioItemId],
  ([newPlaying, newAudioItemId]) => {
    if (props.id === newAudioItemId) {
      if (newPlaying) {
        emit('play', { currentTime: Number(currentTime.value.toFixed(2)) })
      }
    }
  }
)

watch(
  () => adaptiveState.value.paused,
  (paused) => {
    if (props.id === adaptiveState.value.audioItemId) {
      if (paused) {
        emit('pause', { currentTime: Number(currentTime.value.toFixed(2)) })
      }
    }
  }
)

watch(
  () => adaptiveState.value.currentTime,
  (currentTime) => {
    if (props.id === adaptiveState.value.audioItemId) {
      emit('timeupdate', { currentTime: Number(currentTime.toFixed(2)) })
    }
  }
)

watch(
  () => adaptiveState.value.ended,
  (ended) => {
    if (props.id === adaptiveState.value.audioItemId) {
      if (ended) {
        emit('ended', { currentTime: Number(currentTime.value.toFixed(2)) })
        currentTime.value = 0
      }
    }
  }
)

watch(
  () => adaptiveState.value.playbackRate,
  (playbackRate) => {
    if (props.id === adaptiveState.value.audioItemId) {
      emit('playbackSpeed', { playbackSpeed: playbackRate })
    }
  }
)

watch(
  [() => adaptiveState.value.playing, () => adaptiveState.value.audioItemId],
  ([newPlaying, newAudioItemId]) => {
    if (newPlaying) {
      if (newAudioItemId === props.id) {
        playing.value = true
      } else {
        // At a time any one player plays the audio and rest will be paused
        playing.value = false
      }
    } else {
      playing.value = false
    }
  }
)

watch(
  () => adaptiveState.value.currentTime,
  (newCurrentTime) => {
    if (adaptiveState.value.audioItemId === props.id) {
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
      emit('reset', { currentTime: Number(currentTime.value) })
    }
  }
)

const play = () => {
  if (adaptiveState.value.audioItemId !== props.id) {
    adaptivePlayer.setSources(props.sources)
  }
  adaptivePlayer.play(props.id)
}

const pause = () => {
  adaptivePlayer.pause()
}

const rewind = (seconds: number) => {
  if (
    adaptiveState.value.audioItemId === props.id &&
    adaptivePlayer &&
    seconds >= 0 &&
    adaptiveState.value.playing
  ) {
    const currentTime =
      adaptiveState.value.currentTime - seconds >= 0 ? adaptiveState.value.currentTime - seconds : 0
    emit('rewind', {
      previousTime: Number(adaptiveState.value.currentTime.toFixed(2)),
      currentTime: Number(currentTime.toFixed(2))
    })
    adaptivePlayer.setCurrentTime(currentTime)
  }
}

const fastForward = (seconds: number) => {
  if (
    adaptiveState.value.audioItemId === props.id &&
    adaptivePlayer &&
    seconds >= 0 &&
    adaptiveState.value.playing
  ) {
    const currentTime = adaptiveState.value.currentTime + seconds
    emit('fastforward', {
      previousTime: Number(adaptiveState.value.currentTime.toFixed(2)),
      currentTime: Number(currentTime.toFixed(2))
    })
    adaptivePlayer.setCurrentTime(currentTime)
  }
}

const seek = (time: number) => {
  if (adaptiveState.value.audioItemId === props.id) {
    emit('seeking', { seeking: time.toFixed(2) })
    adaptivePlayer.setCurrentTime(time)
  }
}

const setAudio = () => {
  // We are not checking for specific audioItemId because in background mixer the audio sources can be set before it is being played.
  adaptivePlayer.setAudio(props.id)
  adaptivePlayer.setSources(props.sources)
}

const setVolume = (volume: number) => {
  if (adaptiveState.value.audioItemId === props.id) {
    adaptivePlayer.setVolume(volume)
  }
}

const setPlaybackRate = (rate: number) => {
  if (adaptiveState.value.audioItemId === props.id) {
    adaptivePlayer.setPlaybackRate(rate)
  }
}

const setSources = (sources: Source[]) => {
  // We are not checking for specific audioItemId because in background mixer the audio sources can be set before it is being played.
  adaptivePlayer.setSources(sources)
}

const setCurrentTime = (time: number) => {
  adaptivePlayer.setCurrentTime(time)
  currentTime.value = time
}

const reset = () => {
  if (adaptiveState.value.audioItemId === props.id) {
    setCurrentTime(0)
  }
}

const setMixing = (enabled: boolean) => {
  adaptivePlayer.setMixing(enabled)
}

const goFullScreen = () => {
  adaptivePlayer?.goFullScreen()
}

const setAudioOnlyMode = (enabled: boolean) => {
  adaptivePlayer?.setAudioOnlyMode(enabled)
}

const setAudioPosterMode = (enabled: boolean) => {
  adaptivePlayer?.setAudioPosterMode(enabled)
}

const currentPlayingAudioItemId = computed(() => {
  return adaptiveState.value.audioItemId
})

const mixing = computed(() => {
  return adaptiveState.value.mixing
})

const volume = computed(() => {
  return adaptiveState.value.volume
})

const adaptiveItemPlayer = {
  play: play,
  pause: pause,
  setAudio: setAudio,
  setVolume: setVolume,
  seek: seek,
  fastForward: fastForward,
  rewind: rewind,
  setPlaybackRate: setPlaybackRate,
  setSources: setSources,
  setMixing: setMixing,
  setCurrentTime: setCurrentTime,
  reset: reset,
  goFullScreen: goFullScreen,
  setAudioOnlyMode: setAudioOnlyMode,
  setAudioPosterMode: setAudioPosterMode
}

const adaptiveItemState = ref({
  currentTime: currentTime,
  playing: playing,
  currentPlayingAudioItemId: currentPlayingAudioItemId,
  mixing: mixing,
  volume: volume
})

provide('adaptiveItemPlayer', adaptiveItemPlayer)
provide('adaptiveItemState', adaptiveItemState)

defineExpose({
  player: adaptiveItemPlayer,
  state: readonly(adaptiveItemState)
})
</script>

<template>
  <div data-testid="adaptive-item" class="w-full">
    <slot
      :play="play"
      :pause="pause"
      :setAudio="setAudio"
      :setVolume="setVolume"
      :seek="seek"
      :fastForward="fastForward"
      :rewind="rewind"
      :setPlaybackRate="setPlaybackRate"
      :setSources="setSources"
      :setMixing="setMixing"
      :setCurrentTime="setCurrentTime"
      :reset="reset"
      :player="adaptiveItemPlayer"
      :state="adaptiveItemState"
    ></slot>
  </div>
</template>
