<template>
  <AudioItem ref="audioItem" :id="id" :sources="sources">
    <div
      data-testid="meditation-track-item"
      class="carousel-item h-[60px] w-[60px] overflow-hidden rounded-full border-2"
      :class="[
        isActive
          ? 'border-purple-500 transition duration-300 ease-in'
          : 'border-transparent hover:brightness-50',
        !backgroundSrc && isActive ? 'hover:cursor-default' : 'hover:cursor-pointer'
      ]"
      @click="play"
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
import { inject, computed, ref, onMounted, useSlots } from 'vue-demi'
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

const state: any = inject('state')
const audioItem = ref()

onMounted(() => {
  console.log('tract item =======')
  // console.log(state)
  // console.log(state.value.audioItemId)
  // console.log(audioItem.value?.id)
  // console.log('on mounted -----')
  // console.log(props.id)

  if (!props.sources.length) {
    console.log('default -----------------------------')
    play()
  }
})

const isActive = computed(() => {
  console.log('is active ---')
  console.log(state.value.audioItemId)
  console.log(props.id)
  console.log(state.value.audioItemId === props.id)
  return state.value.audioItemId === props.id
})

const play = () => {
  console.log('play********************')
  console.log(state.value.audioItemId)
  console.log(props.id)
  // if (state.value.playing) {}
  audioItem.value.play()
}
</script>
