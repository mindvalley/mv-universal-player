<script setup lang="ts">
import { defineProps } from 'vue'
import { AdaptiveShape, AdaptiveSize } from '../../../types/adaptive'
import { Shape, Size } from '../../../models/adaptive.enums'
import BaseImage from './../../global/BaseImage.vue'

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  },
  shape: {
    type: String as () => AdaptiveShape,
    default: Shape.SQUARE
  },
  size: {
    type: String as () => AdaptiveSize,
    default: Size.SMALL
  }
})
</script>

<template>
  <div class="flex items-center">
    <div>
      <BaseImage
        class="h-12 w-12 sm:h-14 sm:w-14"
        :src="image"
        :img-class="shape === Shape.ROUND ? 'rounded-full' : 'rounded-lg'"
        aspect-ratio="square"
        :width="56"
      ></BaseImage>
    </div>
    <div class="ml-2">
      <div class="title-9 text-white truncate max-w-48">{{ title }}</div>
      <div class="title-9 text-cool-grey-350 truncate">{{ subTitle }}</div>
    </div>
  </div>
</template>
