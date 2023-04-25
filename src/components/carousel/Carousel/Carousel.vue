<script setup lang="ts">
import { useSlots } from 'vue'
import { Carousel } from 'vue-carousel'
const slots = useSlots()
console.log(slots)
</script>
<template>
  <Carousel
    :navigationEnabled="true"
    :paginationEnabled="true"
    :perPageCustom="[
      [540, 4],
      [640, 8],
      [1024, 6]
    ]"
    tagName="Slide"
    navigationPrevLabel="prev"
    navigationNextLabel="next"
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
