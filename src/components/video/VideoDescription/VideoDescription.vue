<script setup lang="ts">
import { useDetectBrowser } from '../../../composables/use-detect-browser'
import BaseDescription from '../../global/BaseDescription.vue'
const { isiPhoneOriPadSafari } = useDetectBrowser()

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
  },
  overlay: {
    type: Boolean,
    default: true
  },
  blurEffect: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: true
  },
  averageRating: {
    type: Number
  },
  ratingsCount: {
    type: Number
  }
})
</script>

<template>
  <div class="relative bg-cover bg-center">
    <!-- Overlay -->
    <section v-if="overlay" class="absolute inset-0 rounded-xl bg-black/60"></section>

    <!-- Blur effect -->
    <section
      v-if="blurEffect"
      class="absolute inset-0 backdrop-blur-3xl"
      :class="{ 'mix-blend-lighten': isiPhoneOriPadSafari }"
    ></section>

    <div class="w-full h-full relative mb-4">
      <h2 class="title-bold-8 mb-1 text-white">{{ title }}</h2>
      <p class="text-cool-grey-200">
        {{ name }}
      </p>

      <div class="mt-2 flex items-center" v-if="averageRating">
        <svg v-svg symbol="star-filled" class="text-yellow-600" size="20"></svg>
        <div class="ml-2 caption-disclaimer text-cool-grey-300">
          {{ `${averageRating?.toFixed(2)} (${ratingsCount})` }}
        </div>
      </div>
    </div>

    <BaseDescription
      :image-src="imageSrc"
      :name="name"
      :headline="headline"
      :description="description"
      :show-more-text="showMoreText"
      :show-less-text="showLessText"
    />
  </div>
</template>
