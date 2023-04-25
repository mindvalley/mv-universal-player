<script setup lang="ts">
import { Carousel } from 'vue-carousel'
</script>
<template>
  <Carousel
    navigationEnabled
    :scrollPerPage="false"
    :perPageCustom="[
      [320, 4],
      [768, 8],
      [1024, 8],
      [1280, 10]
    ]"
    :paginationEnabled="false"
    tagName="Slide"
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
