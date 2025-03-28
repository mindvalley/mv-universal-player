<script setup lang="ts">
import { inject, provide, ref, toRefs, reactive, watch, readonly, computed } from 'vue-demi'
import type { Player, Source } from '../../../types/audio'

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-audio-item-' + Math.random().toString().replace('.', '')
  },
  sources: {
    type: Array<Source>,
    required: true,
    default: () => []
  }
})

const audioState: any = inject('audioState')
const audioPlayer: Player = inject('audioPlayer', {} as Player)
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
  () => audioState.value.error,
  (error) => {
    if (props.id === audioState.value.audioItemId) {
      if (error) {
        emit('error', error)
      }
    }
  }
)

watch(
  [() => audioState.value.playing, () => audioState.value.audioItemId],
  ([newPlaying, newAudioItemId]) => {
    if (props.id === newAudioItemId) {
      if (newPlaying) {
        emit('play', { currentTime: currentTime.value.toFixed(2) })
      }
    }
  }
)

watch(
  () => audioState.value.paused,
  (paused) => {
    if (props.id === audioState.value.audioItemId) {
      if (paused) {
        emit('pause', { currentTime: currentTime.value.toFixed(2) })
      }
    }
  }
)

watch(
  () => audioState.value.currentTime,
  (currentTime) => {
    if (props.id === audioState.value.audioItemId) {
      emit('timeupdate', { currentTime: currentTime.toFixed(2) })
    }
  }
)

watch(
  () => audioState.value.ended,
  (ended) => {
    if (props.id === audioState.value.audioItemId) {
      if (ended) {
        emit('ended', { currentTime: currentTime.value.toFixed(2) })
        currentTime.value = 0
      }
    }
  }
)

watch(
  () => audioState.value.playbackRate,
  (playbackRate) => {
    if (props.id === audioState.value.audioItemId) {
      emit('playbackSpeed', { playbackSpeed: playbackRate })
    }
  }
)

watch(
  [() => audioState.value.playing, () => audioState.value.audioItemId],
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
  () => audioState.value.currentTime,
  (newCurrentTime) => {
    if (audioState.value.audioItemId === props.id) {
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
  if (audioState.value.audioItemId !== props.id) {
    audioPlayer.setSources(props.sources)
  }
  audioPlayer.play(props.id)
}

const pause = () => {
  audioPlayer.pause()
}

const rewind = (seconds: number) => {
  if (
    audioState.value.audioItemId === props.id &&
    audioPlayer &&
    seconds >= 0 &&
    audioState.value.playing
  ) {
    const currentTime =
      audioState.value.currentTime - seconds >= 0 ? audioState.value.currentTime - seconds : 0
    emit('rewind', {
      previousTime: audioState.value.currentTime.toFixed(2),
      currentTime: currentTime.toFixed(2)
    })
    audioPlayer.setCurrentTime(currentTime)
  }
}

const fastForward = (seconds: number) => {
  if (
    audioState.value.audioItemId === props.id &&
    audioPlayer &&
    seconds >= 0 &&
    audioState.value.playing
  ) {
    const currentTime = audioState.value.currentTime + seconds
    emit('fastforward', {
      previousTime: audioState.value.currentTime.toFixed(2),
      currentTime: currentTime.toFixed(2)
    })
    audioPlayer.setCurrentTime(currentTime)
  }
}

const seek = (time: number) => {
  if (audioState.value.audioItemId === props.id) {
    emit('seeking', { seeking: time.toFixed(2) })
    audioPlayer.setCurrentTime(time)
  }
}

const setAudio = () => {
  // We are not checking for specific audioItemId because in background mixer the audio sources can be set before it is being played.
  audioPlayer.setAudio(props.id)
  audioPlayer.setSources(props.sources)
}

const setVolume = (volume: number) => {
  if (audioState.value.audioItemId === props.id) {
    audioPlayer.setVolume(volume)
  }
}

const setPlaybackRate = (rate: number) => {
  if (audioState.value.audioItemId === props.id) {
    audioPlayer.setPlaybackRate(rate)
  }
}

const setSources = (sources: Source[]) => {
  // We are not checking for specific audioItemId because in background mixer the audio sources can be set before it is being played.
  audioPlayer.setSources(sources)
}

const setCurrentTime = (time: number) => {
  audioPlayer.setCurrentTime(time)
  currentTime.value = time
}

const reset = () => {
  if (audioState.value.audioItemId === props.id) {
    setCurrentTime(0)
  }
}

const setMixing = (enabled: boolean) => {
  audioPlayer.setMixing(enabled)
}

const currentPlayingAudioItemId = computed(() => {
  return audioState.value.audioItemId
})

const mixing = computed(() => {
  return audioState.value.mixing
})

const volume = computed(() => {
  return audioState.value.volume
})

const audioItemPlayer = {
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
  reset: reset
}

const audioItemState = ref({
  currentTime: currentTime,
  playing: playing,
  currentPlayingAudioItemId: currentPlayingAudioItemId,
  mixing: mixing,
  volume: volume
})

provide('audioItemPlayer', audioItemPlayer)
provide('audioItemState', audioItemState)

defineExpose({
  player: audioItemPlayer,
  state: readonly(audioItemState)
})
</script>

<template>
  <div class="w-full">
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
      :player="audioItemPlayer"
      :state="audioItemState"
    ></slot>
  </div>
</template>
