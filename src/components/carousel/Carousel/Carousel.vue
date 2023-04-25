<script setup lang="ts">
import { useSlots } from 'vue'
import { Carousel } from 'vue-carousel'
const slots = useSlots()
console.log(slots)
</script>
<template>
  <Carousel
    navigationEnabled
    :spacePadding="0"
    :scrollPerPage="false"
    :perPageCustom="[
      [375, 9],
      [540, 6],
      [640, 8],
      [1024, 9]
    ]"
    :paginationEnabled="true"
    :spacePaddingMaxOffsetFactor="5"
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
