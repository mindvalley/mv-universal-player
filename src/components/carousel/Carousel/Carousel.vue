<script setup lang="ts">
import { Carousel } from 'vue-carousel'

const props = defineProps({
  tagName: {
    type: String,
    default: 'MVCarouselSlide'
  }
})
</script>
<template>
  <Carousel
    navigationEnabled
    :scrollPerPage="true"
    :perPageCustom="[
      [320, 4],
      [540, 6],
      [768, 8],
      [1024, 8],
      [1280, 10]
    ]"
    :paginationEnabled="false"
    :tagName="tagName"
  >
    <slot></slot>
  </Carousel>
</template>

<style>
.VueCarousel-navigation-button {
  color: white !important;
  outline: none !important;
}
</style>
