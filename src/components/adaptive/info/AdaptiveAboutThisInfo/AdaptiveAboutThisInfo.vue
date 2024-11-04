<script setup lang="ts">
import { AdaptiveShape } from '../../../../types/adaptive'
import { Shape } from '../../../../models/adaptive.enums'
import { MVAdaptiveAboutThisInfoCard } from './AdaptiveAboutThisInfoCard'
import { computed, useSlots } from 'vue-demi'

defineProps({
  headerTitle: {
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

const slots = useSlots()

const isControlAvailable = computed(() => {
  return slots && !!slots['control']
})
</script>

<template>
  <div
    data-testid="adaptive-about-this-info"
    class="bg-black rounded-3xl w-[398px] sm:w-[480px] py-4 px-6 relative max-h-[calc(70vh)] flex flex-col"
  >
    <div data-testid="header-title" class="heading-9 text-white mb-1">{{ headerTitle }}</div>
    <button
      data-testid="close-button"
      class="absolute top-4 right-6 rounded-full hover:bg-white-24a p-1"
      @click="handleClose"
    >
      <svg v-svg symbol="x-filled" class="h-4 w-4 text-white-70a"></svg>
    </button>
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <MVAdaptiveAboutThisInfoCard
        :title="title"
        :image="image"
        :artist-name="artistName"
        :description="description"
        :shape="shape"
        :ratings="ratings"
        :tags="tags"
      />
    </div>
    <template v-if="isControlAvailable">
      <div data-testid="divider" class="w-full border border-white-12a my-6"></div>
      <div class="">
        <slot name="control"></slot>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.custom-scrollbar {
  padding-right: 6px;
  margin-right: -6px;
  scrollbar-gutter: stable;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  /* WebKit */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
