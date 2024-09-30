<script setup lang="ts">
import { PropType } from 'vue-demi'
import { BackgroundTrackItem } from '../../../types/adaptive'

const props = defineProps({
  trackItem: {
    type: Object as PropType<BackgroundTrackItem>
  },
  isActive: {
    type: Boolean
  }
})
</script>

<template>
  <div
    data-testid="background-track-item"
    class="overflow-hidden rounded-full h-full w-full cursor-pointer"
  >
    <div
      data-testid="no-background-sound"
      v-if="!trackItem?.item"
      class="flex h-full w-full text-white items-center justify-center bg-black text-center text-[10px]"
    >
      <span class="text-white title-9 px-10">No background sound</span>
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
