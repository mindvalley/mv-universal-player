<template>
  <AudioItem ref="audioItem" :id="id" :sources="sources" @ready="initialize">
    <div
      data-testid="meditation-track-item"
      class="carousel-item h-[60px] w-[60px] overflow-hidden rounded-full border-2"
      :class="[
        isActive
          ? 'border-purple-500 transition duration-300 ease-in'
          : 'border-transparent hover:brightness-50',
        !backgroundSrc && isActive ? 'hover:cursor-default' : 'hover:cursor-pointer'
      ]"
      @click="selectSound"
    >
      <div
        data-testid="no-background-sound"
        v-if="sources.length === 0"
        class="flex h-full w-full text-white items-center justify-center bg-black text-center text-[10px]"
      >
        <slot>NO BG SOUND</slot>
      </div>
      <img
        data-testid="background-sound-cover-asset"
        v-else
        :src="backgroundSrc"
        class="h-full w-full"
      />
    </div>
  </AudioItem>
</template>

<script lang="ts" setup>
import { inject, computed, ref, watch, toRef } from 'vue-demi'
import AudioItem from '../../AudioItem/AudioItem.vue'
import type { Source } from './../../../../types/audio'

const props = defineProps({
  sources: {
    type: Array<Source>,
    default: () => {
      return []
    }
  },
  isActive: {
    type: Boolean
  },
  backgroundSrc: {
    type: String
  },
  id: {
    type: String,
    default: () => 'mv-meditation-track-item-' + Math.random().toString().replace('.', '')
  },
  volume: {
    type: Number,
    default: 0.5
  }
})

const mixerState: any = inject('state')
const mainState: any = inject('mainState')
const mainPlayer: any = inject('mainPlayer')
const audioItem = ref()

const initialize = () => {
  if (!props.sources.length) {
    audioItem.value.setAudio()
  }
}

watch(
  () => mixerState.value.ready,
  (ready) => {
    if (ready) {
      initialize()
    }
  }
)

watch(
  () => mainState.value.playing,
  (playing) => {
    if (mixerState.value.audioItemId === props.id) {
      if (playing) {
        play()
      } else {
        pause()
      }
    }
  }
)

watch(
  () => props.volume,
  (newVolume) => {
    updateVolume(1 - newVolume, newVolume)
  }
)

const isActive = computed(() => {
  return mixerState.value.audioItemId === props.id
})

const selectSound = () => {
  audioItem.value.setAudio()
  if (props.sources.length && mainState.value.playing) {
    play()
    updateVolume(1 - props.volume, props.volume)
  } else {
    pause()
    updateVolume(0, 1)
  }
}

const play = () => {
  audioItem.value.play()
}

const pause = () => {
  audioItem.value.pause()
}

const updateVolume = (backgroundSound: number, mainAudio: number) => {
  audioItem.value.setVolume(backgroundSound)
  mainPlayer.setVolume(mainAudio)
}
</script>
