<script lang="ts" setup>
import { inject, computed, ref, watch, toRef, onMounted } from 'vue-demi'
import { MVAudioItem } from '../..'
import type { Source } from './../../../../types/audio'

const props = defineProps({
  sources: {
    type: Array<Source>,
    default: () => {
      return []
    }
  },
  isSelected: {
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

// Mixer Player
const mixerPlayerState: any = inject('audioState')

// Parent component (Main Audio)
const mainState: any = inject('audioItemState')

const audioItem = ref()

const emit = defineEmits<{
  (e: 'timeupdate', { currentTime }: any): void
  (e: 'play', { currentTime }: any): void
  (e: 'pause', { currentTime }: any): void
  (e: 'ended', { currentTime }: any): void
  (e: 'error', payload: any): void
  (e: any, payload: any): void
}>()

const isNoBackgroundSound = computed(() => {
  return props.sources.length === 0
})

const isActive = computed(() => {
  return mixerPlayerState.value.audioItemId === props.id
})

// This works in Vue 3 but not in Vue 2
onMounted(() => {
  initialize()
})

// This works in Vue 2 but not in Vue 3
watch(
  () => mixerPlayerState.value.ready,
  (ready) => {
    if (ready) {
      initialize()
    }
  }
)

watch(
  [() => mainState.value?.playing, () => mixerPlayerState.value.audioItemId],
  ([playing, audioItemId]) => {
    if (audioItemId === props.id) {
      toggle()
    }
  }
)

watch(
  () => mainState.value.currentPlayingAudioItemId,
  (newAudioItemId, oldAudioItemId) => {
    if (newAudioItemId !== oldAudioItemId) {
      audioItem.value.player.reset()
    }
  }
)

watch(
  () => mixerPlayerState.value.audioItemId,
  (audioItemId) => {
    if (audioItemId === props.id) {
      if (isNoBackgroundSound.value) {
        audioItem.value.player.setMixing(false)
      } else {
        audioItem.value.player.setMixing(true)
      }
    }
  }
)

const toggle = () => {
  if (mainState.value?.playing && !isNoBackgroundSound.value) {
    play()
  } else {
    pause()
  }
}

const initialize = () => {
  if (props.isSelected || isNoBackgroundSound.value) {
    selectSound()
  }
}

const selectSound = () => {
  audioItem.value.player.setAudio()
  toggle()
}

const play = () => {
  audioItem.value.player.play()
}

const pause = () => {
  audioItem.value.player.pause()
}

const emitEvent = (eventName: string, payload?: any) => {
  const data = { assetId: props.id, ...payload }
  emit(eventName, data)
}
</script>

<template>
  <MVAudioItem
    ref="audioItem"
    :id="props.id"
    :sources="props.sources"
    @play="emitEvent('play', $event)"
    @pause="emitEvent('pause', $event)"
    @timeupdate="emitEvent('timeupdate', $event)"
    @ended="emitEvent('ended', $event)"
    @error="emitEvent('error', $event)"
  >
    <div
      data-testid="meditation-track-item"
      class="carousel-item h-[60px] w-[60px] overflow-hidden rounded-full border-2"
      :class="[
        isActive
          ? 'border-purple-500 transition duration-300 ease-in'
          : 'border-transparent filter hover:brightness-50',
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
        draggable="false"
        data-testid="background-sound-cover-asset"
        v-else
        :src="backgroundSrc"
        class="h-full w-full"
      />
    </div>
  </MVAudioItem>
</template>
