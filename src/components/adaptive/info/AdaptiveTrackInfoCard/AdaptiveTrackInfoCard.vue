<script setup lang="ts">
import { defineProps, ref, onMounted, watch, computed } from 'vue-demi'
import { AdaptiveShape, AdaptiveSize } from '../../../../types/adaptive'
import { Shape, Size } from '../../../../models/adaptive.enums'
import BaseImage from '../../../global/BaseImage.vue'

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

const emit = defineEmits(['title-click', 'image-click'])

const imageSize = ref(props.size === Size.BIG ? 120 : 56)
const isTransitionComplete = ref(false)

const imageStyle = computed(() => ({
  width: `${imageSize.value}px`,
  height: `${imageSize.value}px`,
  transition: 'all 500ms ease-in-out'
}))

const containerStyle = computed(() => ({
  height: props.size === Size.BIG ? `${imageSize.value}px` : 'auto',
  transition: 'all 500ms ease-in-out'
}))

const textContainerStyle = computed(() => ({
  height: props.size === Size.BIG ? `${imageSize.value}px` : 'auto',
  transform:
    props.size === Size.BIG ? `translateY(${(imageSize.value - 64) / 2}px)` : 'translateY(0)',
  transition: 'all 500ms ease-in-out'
}))

onMounted(() => {
  if (props.size === Size.BIG) {
    setTimeout(() => {
      imageSize.value = 64
      setTimeout(() => {
        isTransitionComplete.value = true
      }, 500)
    }, 3000)
  }
})

watch(
  () => props.size,
  (newSize) => {
    if (newSize === Size.BIG) {
      isTransitionComplete.value = false
      imageSize.value = 120
      setTimeout(() => {
        imageSize.value = 64
        setTimeout(() => {
          isTransitionComplete.value = true
        }, 500)
      }, 1000)
    } else {
      imageSize.value = 56
      isTransitionComplete.value = false
    }
  }
)

const handleTitleClick = () => {
  emit('title-click')
}

const handleImageClick = () => {
  emit('image-click')
}
</script>

<template>
  <div data-testid="adaptive-track-info-card" class="flex w-full" :style="containerStyle">
    <div data-testid="image" class="cursor-pointer" @click="handleImageClick">
      <BaseImage
        :class="[props.size !== Size.BIG && 'h-12 w-12 sm:h-14 sm:w-14']"
        :style="props.size === Size.BIG ? imageStyle : {}"
        :src="image"
        :img-class="shape === Shape.ROUND ? 'rounded-full' : 'rounded-lg'"
        aspect-ratio="square"
        :width="imageSize"
      ></BaseImage>
    </div>
    <div
      data-testid="container"
      class="flex flex-col justify-center min-w-0 w-full"
      :class="[props.size === Size.BIG ? 'ml-2 sm:ml-4' : 'ml-2 sm:ml-3']"
      :style="textContainerStyle"
    >
      <div data-testid="control" class="mb-0.5 inline-flex">
        <slot name="control"></slot>
      </div>
      <div
        data-testid="title"
        class="heading-9 text-white truncate"
        :class="{ ' xl:max-w-[50%]': props.size === Size.BIG }"
      >
        <span @click="handleTitleClick" class="cursor-pointer hover:underline">
          {{ title }}
        </span>
      </div>
      <div data-testid="sub-title" class="caption-disclaimer text-cool-grey-200 truncate">
        {{ subTitle }}
      </div>
    </div>
  </div>
</template>
