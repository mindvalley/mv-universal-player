<script setup lang="ts">
import BaseImage from './../../../global/BaseImage.vue'
import { AdaptiveShape } from '../../../../types/adaptive'
import { Shape } from '../../../../models/adaptive.enums'

defineProps({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  authorName: {
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
  <div>
    <!-- Track Info -->
    <div class="flex items-center mt-6">
      <div>
        <BaseImage
          class="h-[100px] w-[100px] sm:h-[140px] sm:w-[140px]"
          :src="image"
          :img-class="shape === Shape.ROUND ? 'rounded-full' : 'rounded-lg'"
          aspect-ratio="square"
          :width="640"
        ></BaseImage>
      </div>
      <div class="ml-4">
        <div class="title-8 text-white">{{ title }}</div>
        <div class="caption-disclaimer text-cool-grey-200 mt-[1px]">{{ authorName }}</div>
        <div class="flex items-center mt-1">
          <span class="title-8 text-[#B3B8C1]">{{ ratings }}</span
          ><span class="ml-0.5">
            <svg v-svg symbol="star-filled" class="h-3 w-3 text-white-70a"></svg
          ></span>
        </div>
      </div>
    </div>

    <div class="my-4 text-white body-small">
      {{ description }}
    </div>
    <div class="gap-x-1 flex flex-wrap">
      <span
        v-for="tag in tags"
        :key="tag"
        class="text-cool-grey-200 bg-white-12a body-2-xs px-4 py-2 border rounded-full border-white-12a"
        >{{ tag }}</span
      >
    </div>
  </div>
</template>
