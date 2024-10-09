<script setup lang="ts">
import { computed, PropType } from 'vue-demi'
import { BackgroundTrackItem } from '../../../types/adaptive'

const props = defineProps({
  trackItem: {
    type: Object as PropType<BackgroundTrackItem>
  },
  leftIndex: {
    type: Number
  },
  rightIndex: {
    type: Number
  }
})

const noBackgroundSoundTitleClass = computed(() => {
  if (props.leftIndex === 0 || props.rightIndex === 0) return 'title-10'
  if (props.leftIndex === 1 || props.rightIndex === 1) return 'title-11'
  if (props.leftIndex === 2 || props.rightIndex === 2) return 'title-11'
  return 'heading-9'
})
</script>

<template>
  <div
    data-testid="background-track-item"
    class="overflow-hidden rounded-full h-full w-full cursor-pointer headi"
  >
    <div
      data-testid="no-background-sound"
      v-if="!trackItem?.item"
      class="flex h-full w-full text-white items-center justify-center bg-black text-center"
    >
      <span class="text-white px-10" :class="noBackgroundSoundTitleClass">No background sound</span>
    </div>
    <img
      v-else
      draggable="false"
      data-testid="background-sound-cover-asset"
      :src="trackItem.item.image"
      class="h-full w-full"
    />
  </div>
</template>
