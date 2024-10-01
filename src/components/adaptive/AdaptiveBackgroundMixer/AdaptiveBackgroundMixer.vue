<script setup lang="ts">
import { ref, computed, PropType, onMounted } from 'vue-demi'
import { Carousel3d, Slide } from 'vue3-carousel-3d'
import 'vue3-carousel-3d/dist/index.css'
import { BackgroundTrackItem } from '../../../types/adaptive'
import MVAdaptiveBackgroundTrackItem from './../AdaptiveBackgroundTrackItem'
import MVAdaptiveBackgroundVolumeSlider from './../AdaptiveBackgroundVolumeSlider'

const props = defineProps({
  backgroundTrackItems: {
    type: Array as PropType<BackgroundTrackItem[]>,
    required: true
  },
  currentBackgroundTrackItem: {
    type: Object as PropType<BackgroundTrackItem>,
    required: false
  }
})

const emit = defineEmits(['play', 'pause', 'timeupdate', 'error', 'close', 'trackChange'])
const carouselRef = ref(null)

const currentTrackIndex = computed(() => {
  return props.backgroundTrackItems.findIndex(
    (trackItem) => trackItem.item?.id === props.currentBackgroundTrackItem?.id
  )
})

onMounted(() => {
  if (carouselRef.value && currentTrackIndex.value !== -1) {
    carouselRef.value.goSlide(currentTrackIndex.value)
  }
})

const handleClose = () => {
  emit('close')
}

const handlePrev = () => {
  carouselRef.value.goPrev()
}

const handleNext = () => {
  carouselRef.value.goNext()
}

const handleTrackChange = (index: number) => {
  const track = props.backgroundTrackItems[index]
  emit('trackChange', track)
}

const isVolumeSliderDisabled = computed(() => {
  return !props.currentBackgroundTrackItem?.item
})
</script>

<template>
  <div class="bg-black h-[265px] w-[400px] sm:w-[748px] rounded-3xl relative py-4 px-6">
    <button class="absolute top-4 right-6" @click="handleClose">
      <svg v-svg symbol="x-filled" class="h-4 w-4 text-white-70a"></svg>
    </button>
    <div class="text-center title-8 text-white">Background mixer</div>

    <div class="relative">
      <button class="carousel-nav-button left-0" @click="handlePrev">
        <svg v-svg symbol="chevron-left-outlined" class="h-6 w-6 text-white"></svg>
      </button>
      <carousel-3d
        @after-slide-change="handleTrackChange"
        ref="carouselRef"
        :disable3d="true"
        :space="100"
        :display="7"
        :loop="true"
        :width="136"
        :height="136"
        :clickable="true"
        :animationSpeed="700"
      >
        <Slide v-for="(item, index) in backgroundTrackItems" :key="item.id" :index="index">
          <MVAdaptiveBackgroundTrackItem :trackItem="item" />
        </Slide>
      </carousel-3d>
      <button class="carousel-nav-button right-0" @click="handleNext">
        <svg v-svg symbol="chevron-right-outlined" class="h-6 w-6 text-white"></svg>
      </button>
    </div>
    <!-- Add volume slider -->
    <div class="mt-6 flex items-center">
      <MVAdaptiveBackgroundVolumeSlider :is-disabled="isVolumeSliderDisabled" />
    </div>
  </div>
</template>

<style scoped>
.carousel-3d-container {
  @apply h-[120px] sm:h-[140px] !important;
}

.carousel-3d-slide {
  background-color: transparent !important;
}

.carousel-3d-slide.current {
  border: 4px solid #e85546 !important;
  border-radius: 50% !important;
  @apply h-[116px] w-[116px] sm:h-[136px] sm:w-[136px] !important;
}

.carousel-3d-slide:not(.current) {
  @apply h-[54px] w-[54px] sm:h-[64px] sm:w-[64px] top-[75px] sm:top-[85px] !important;
}
/* Left slides */
.carousel-3d-slide.left-1 {
  @apply opacity-90 h-[90px] w-[90px] sm:h-[100px] sm:w-[100px] top-[27px] sm:top-[40px] -left-[10px] !important;
}

.carousel-3d-slide.left-2 {
  @apply opacity-70 h-[70px] w-[70px] sm:h-[80px] sm:w-[80px] top-[47px] sm:top-[60px] left-0 !important;
}

.carousel-3d-slide.left-3 {
  @apply opacity-50 h-[54px] w-[54px] sm:h-[64px] sm:w-[64px] top-[70px] sm:top-[75px] left-[27px] !important;
}

/* Right slides */
.carousel-3d-slide.right-1 {
  @apply opacity-90 h-[90px] w-[90px] sm:h-[100px] sm:w-[100px] top-[27px] sm:top-[40px] left-[50px] !important;
}

.carousel-3d-slide.right-2 {
  @apply opacity-70 h-[70px] w-[70px] sm:h-[80px] sm:w-[80px] top-[47px] sm:top-[60px] left-[60px] !important;
}

.carousel-3d-slide.right-3 {
  @apply opacity-50 h-[54px] w-[54px] sm:h-[64px] sm:w-[64px] top-[70px] sm:top-[75px] left-[50px] !important;
}

/* Remove the following CSS classes as they're now in the Tailwind classes */
.carousel-nav-button {
  @apply sm:flex hidden absolute top-[90%] -translate-y-1/2 backdrop-blur-md rounded-full bg-white/[0.12] items-center justify-center w-12 h-12 border-none cursor-pointer transition-all duration-300 ease-in-out z-10;
}

.carousel-nav-button:hover {
  @apply bg-white/[0.21];
}
</style>
