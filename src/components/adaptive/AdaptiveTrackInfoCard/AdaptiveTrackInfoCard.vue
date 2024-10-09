<script setup lang="ts">
import { defineProps, ref, onMounted, watch, computed } from 'vue-demi'
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

const emit = defineEmits(['title-click'])

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
    }, 1000)
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
  if (props.size === Size.BIG) {
    emit('title-click')
  }
}
</script>

<template>
  <div class="flex" :style="containerStyle">
    <div>
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
      class="flex flex-col justify-center"
      :class="[props.size === Size.BIG ? 'ml-2 sm:ml-4' : 'ml-2 sm:ml-3']"
      :style="textContainerStyle"
    >
      <div class="mb-0.5">
        <slot name="control"></slot>
      </div>
      <div
        @click="handleTitleClick"
        class="heading-9 text-white truncate max-w-28 sm:max-w-48"
        :class="[props.size === Size.BIG ? 'cursor-pointer hover:underline' : '']"
      >
        {{ title }}
      </div>
      <div class="body-2-xs text-cool-grey-200 truncate">{{ subTitle }}</div>
    </div>
  </div>
</template>
