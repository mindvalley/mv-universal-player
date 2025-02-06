<script setup lang="ts">
import BaseDescription from '../../global/BaseDescription.vue'
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
</script>

<template>
  <BaseDescription
    :image-src="imageSrc"
    :name="name"
    :headline="headline"
    :description="description"
    :show-more-text="showMoreText"
    :show-less-text="showLessText"
  />
</template>
