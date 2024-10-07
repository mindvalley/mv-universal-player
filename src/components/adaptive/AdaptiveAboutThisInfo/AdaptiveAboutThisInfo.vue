<script setup lang="ts">
import { AdaptiveShape } from '../../../types/adaptive'
import { Shape } from '../../../models/adaptive.enums'
import { MVAdaptiveAboutThisInfoCard } from './AdaptiveAboutThisInfoCard'
import { computed, useSlots } from 'vue-demi'

defineProps({
  aboutThisTitle: {
    type: String,
    required: true
  },
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

const slots = useSlots()

const isControlAvailable = computed(() => {
  return slots && !!slots['control']
})
</script>

<template>
  <div class="bg-black rounded-3xl w-[398px] sm:w-[480px] py-4 px-6 relative">
    <div class="title-9 text-white">{{ aboutThisTitle }}</div>
    <button class="absolute top-4 right-6 rounded-full hover:bg-white-24a p-1" @click="handleClose">
      <svg v-svg symbol="x-filled" class="h-4 w-4 text-white-70a"></svg>
    </button>
    <div>
      <MVAdaptiveAboutThisInfoCard
        :title="title"
        :image="image"
        :author-name="authorName"
        :description="description"
        :shape="shape"
        :ratings="ratings"
        :tags="tags"
      />
    </div>
    <div v-if="isControlAvailable" class="w-full border border-white-12a my-6"></div>
    <slot name="control"></slot>
  </div>
</template>
