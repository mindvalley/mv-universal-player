<script setup lang="ts">
import { ref } from 'vue-demi'
import BaseImage from './BaseImage.vue'
const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  headline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  showMoreText: {
    type: String,
    required: true
  },
  showLessText: {
    type: String,
    required: true
  }
})

const showFullDescription = ref(false)
</script>

<template>
  <div class="flex relative">
    <section class="hidden shrink-0 md:flex md:w-[232px] mr-4">
      <div>
        <div class="w-12">
          <BaseImage
            class="rounded-lg"
            :src="props.imageSrc"
            img-class="rounded-lg"
            :width="48"
            aspect-ratio="portrait"
          ></BaseImage>
        </div>
      </div>
      <div class="flex flex-col pl-3">
        <span class="text-sm text-cool-grey-200">{{ props.name }}</span>
        <span class="text-xs text-cool-grey-350">{{ props.headline }}</span>
      </div>
    </section>

    <section class="text-sm text-cool-grey-350">
      <div v-if="props.description.length <= 250 || showFullDescription === true">
        <div
          :class="{ 'cursor-pointer': props.description.length > 250 }"
          @click="showFullDescription = false"
          v-html="props.description"
        />
        <button
          class="mt-2 text-purple-500"
          @click="showFullDescription = false"
          v-if="props.description.length > 250"
        >
          {{ props.showLessText }}
        </button>
      </div>
      <div v-else>
        <div
          :class="{ 'cursor-pointer': !showFullDescription }"
          @click="showFullDescription = true"
        >
          {{ `${props.description.slice(0, 250)}...` }}
        </div>
        <button
          class="mt-2 text-purple-500"
          @click="showFullDescription = true"
          v-if="!showFullDescription"
        >
          {{ props.showMoreText }}
        </button>
      </div>
    </section>
  </div>
</template>
