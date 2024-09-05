<script setup lang="ts">
import { Carousel, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const settings = {
  // Mobile (Default)
  itemsToShow: 4,
  snapAlign: 'start'
}

// breakpoints are mobile first
// any settings not specified will fallback to the carousel settings
const breakpoints = {
  //   540 and up
  540: {
    itemsToShow: 6,
    snapAlign: 'start'
  },
  //   640px (sm) and up
  640: {
    itemsToShow: 8,
    snapAlign: 'start'
  },
  // 1024 (lg) and up
  1024: {
    itemsToShow: 7,
    snapAlign: 'start'
  }
}
</script>
<template>
  <Carousel :items-to-show="7" :items-to-scroll="3" :settings="settings" :breakpoints="breakpoints">
    <slot></slot>

    <Navigation data-testid="navigation" />
  </Carousel>
</template>

<style>
.carousel__prev,
.carousel__next {
  color: white !important;
}

.carousel__prev {
  left: -42px;
  /* padding: 10px 10px; */
}

.carousel__next {
  right: -42px;
}

.carousel__prev--disabled,
.carousel__next--disabled {
  cursor: not-allowed;
  opacity: 0.2;
}
</style>
