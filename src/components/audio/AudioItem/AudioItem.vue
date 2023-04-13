<script setup lang="ts">
import { inject, provide, ref, watch, readonly, computed } from 'vue-demi'
import type { Player, Source } from '../../../types/audio'

const props = defineProps({
  id: {
    type: String,
    default: () => 'mv-audio-item-' + Math.random().toString().replace('.', '')
  },
  sources: {
    type: Array<Source>,
    required: true
  }
})

const audioState: any = inject('audioState')
const audioPlayer: Player = inject('audioPlayer', {} as Player)
const playing = ref(false)
const currentTime = ref(0)
const emit = defineEmits<{
  (e: 'currentTime', currentTime: number): void
}>()

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
  [() => audioState.value.currentTime, () => audioState.value.audioItemId],
  ([newCurrentTime, newAudioItemId]) => {
    if (newAudioItemId === props.id) {
      currentTime.value = newCurrentTime
      emit('currentTime', currentTime.value)
    } else {
      // To reset other players to zero.
      currentTime.value = 0
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
  if (audioState.value.audioItemId === props.id && audioPlayer && seconds) {
    audioPlayer.setCurrentTime(audioState.value.currentTime - seconds)
  }
}

const fastForward = (seconds: number) => {
  if (audioState.value.audioItemId === props.id && audioPlayer && seconds) {
    audioPlayer.setCurrentTime(audioState.value.currentTime + seconds)
  }
}

const seek = (time: number) => {
  if (audioState.value.audioItemId === props.id) {
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
    audioPlayer.playbackRate(rate)
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
  mixing: mixing
})

provide('audioItemPlayer', audioItemPlayer)
provide('audioItemState', audioItemState)

defineExpose({
  player: audioItemPlayer,
  state: readonly(audioItemState)
})
</script>

<template>
  <div>
    <slot :player="audioItemPlayer" :state="audioItemState"></slot>
  </div>
</template>
