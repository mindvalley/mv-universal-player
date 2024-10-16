<script setup lang="ts">
import BaseImage from './../../../../global/BaseImage.vue'
import { AdaptiveShape } from '../../../../../types/adaptive'
import { Shape } from '../../../../../models/adaptive.enums'

defineProps({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shape: {
    type: String as () => AdaptiveShape,
    default: Shape.SQUARE
  },
  ratings: {
    type: Number,
    required: true
  },
  tags: {
    type: Array as () => string[],
    required: true
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div data-testid="adaptive-about-this-info-card">
    <!-- Track Info -->
    <div data-testid="track-info" class="flex items-center mt-6">
      <div data-testid="track-image">
        <BaseImage
          class="h-[100px] w-[100px] sm:h-[140px] sm:w-[140px]"
          :src="image"
          :img-class="shape === Shape.ROUND ? 'rounded-full' : 'rounded-lg'"
          aspect-ratio="square"
          :width="640"
        ></BaseImage>
      </div>
      <div data-testid="track-info-container" class="ml-4">
        <div data-testid="track-title" class="heading-8 text-white">{{ title }}</div>
        <div data-testid="track-artist" class="caption-disclaimer text-cool-grey-200 mt-[1px]">
          {{ artistName }}
        </div>
        <div data-testid="track-ratings" class="flex items-center mt-1" v-if="ratings">
          <span data-testid="track-ratings-value" class="heading-8 text-[#B3B8C1]">{{
            ratings
          }}</span
          ><span data-testid="track-ratings-star" class="ml-0.5">
            <svg v-svg symbol="star-filled" class="h-3 w-3 text-white-70a"></svg
          ></span>
        </div>
      </div>
    </div>

    <div data-testid="track-description" class="my-4 text-white body-small">
      {{ description }}
    </div>
    <div data-testid="track-tags" class="gap-x-1 flex flex-wrap">
      <span
        v-for="tag in tags"
        :key="tag"
        class="text-cool-grey-200 bg-white-12a body-2-xs px-4 py-2 border rounded-full border-white-12a my-1"
        >{{ tag }}</span
      >
    </div>
  </div>
</template>
