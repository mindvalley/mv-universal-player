<script setup lang="ts">
import { ref, computed, PropType, onMounted } from 'vue-demi'
import { Carousel3d, Slide } from 'vue3-carousel-3d'
import 'vue3-carousel-3d/dist/index.css'
import { BackgroundTrackItem } from './../../../../types/adaptive'
import { MVAdaptiveBackgroundTrackItem, MVAdaptiveBackgroundVolumeSlider } from './../'

const props = defineProps({
  backgroundTrackItems: {
    type: Array as PropType<BackgroundTrackItem[]>,
    required: true
  },
  currentBackgroundTrackItem: {
    type: Object as PropType<BackgroundTrackItem>,
    required: false
  },
  volume: {
    type: Number,
    default: 0.5
  }
})

const emit = defineEmits([
  'play',
  'pause',
  'timeupdate',
  'error',
  'close',
  'trackChange',
  'volumeChange'
])
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

const updateVolume = (volume: number) => {
  emit('volumeChange', volume)
}
</script>

<template>
  <div
    data-testid="adaptive-background-mixer"
    class="h-[235px] w-[calc(100vw-16px)] md:w-[calc(100vw-36px)] md:h-[265px] xl:max-w-[748px] rounded-3xl relative py-4 md:px-6"
    :style="{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }"
  >
    <button
      data-testid="close-button"
      class="absolute top-4 right-6 rounded-full hover:bg-white-24a p-1"
      @click="handleClose"
    >
      <svg v-svg symbol="x-filled" class="h-4 w-4 text-white-70a"></svg>
    </button>
    <div data-testid="title" class="text-center heading-9 text-white">Background mixer</div>

    <div class="relative">
      <button data-testid="prev-button" class="carousel-nav-button -left-3" @click="handlePrev">
        <svg v-svg symbol="chevron-left-outlined" class="h-6 w-6 text-white"></svg>
      </button>
      <carousel-3d
        data-testid="carousel"
        @after-slide-change="handleTrackChange"
        ref="carouselRef"
        :disable3d="false"
        :perspective="0"
        :space="120"
        :display="7"
        :loop="true"
        :width="136"
        :height="136"
        :clickable="true"
        :animationSpeed="700"
      >
        <Slide v-for="(item, index) in backgroundTrackItems" :key="item.id" :index="index">
          <template #default="{ leftIndex, rightIndex }">
            <MVAdaptiveBackgroundTrackItem
              :trackItem="item"
              :left-index="leftIndex"
              :right-index="rightIndex"
            />
          </template>
        </Slide>
      </carousel-3d>
      <button data-testid="next-button" class="carousel-nav-button -right-3" @click="handleNext">
        <svg v-svg symbol="chevron-right-outlined" class="h-6 w-6 text-white"></svg>
      </button>
    </div>
    <!-- Add volume slider -->
    <div class="mt-6 flex items-center px-6 md:px-0">
      <MVAdaptiveBackgroundVolumeSlider
        :is-disabled="isVolumeSliderDisabled"
        :volume="volume"
        @change="updateVolume"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel-3d-container {
  @apply h-[120px] md:h-[140px] !important;
}

.carousel-3d-slide {
  background-color: transparent !important;
  transition: linear 0.5s ease;
  /* @apply border border-white; */
}

.carousel-3d-slide.current {
  border: 4px solid #e85546 !important;
  border-radius: 50% !important;
  @apply h-[116px] w-[116px] md:h-[136px] md:w-[136px] ml-4 md:ml-1 !important;
}

.carousel-3d-slide:not(.current) {
  @apply h-[54px] w-[54px] md:h-[64px] md:w-[64px] top-[75px] md:top-[85px] !important;
}

/* Left slides */
.carousel-3d-slide.left-1 {
  @apply opacity-90 h-[130px] w-[130px] md:h-[140px] md:w-[140px] top-[10px] md:top-[20px] -left-[28px] md:-left-[60px] !important;
}

.carousel-3d-slide.left-2 {
  @apply opacity-70 h-[120px] w-[120px] md:h-[120px] md:w-[120px] top-[24px] md:top-[46px] -left-[60px] md:-left-[95px] !important;
}

.carousel-3d-slide.left-3 {
  @apply opacity-50 h-[110px] w-[110px] md:h-[104px] md:w-[104px] top-[40px] md:top-[70px] -left-[95px] md:-left-[125px] !important;
}

/* Right slides */
.carousel-3d-slide.right-1 {
  @apply opacity-90 h-[130px] w-[130px] md:h-[140px] md:w-[140px] top-[10px] md:top-[20px] left-[50px] md:left-[60px] !important;
}

.carousel-3d-slide.right-2 {
  @apply opacity-70 h-[120px] w-[120px] md:h-[120px] md:w-[120px] top-[24px] md:top-[46px] left-[90px] md:left-[115px] !important;
}

.carousel-3d-slide.right-3 {
  @apply opacity-50 h-[110px] w-[110px] md:h-[104px] md:w-[104px] top-[40px] md:top-[70px] left-[130px] md:left-[160px] !important;
}

.carousel-3d-slide.far {
  @apply opacity-30 h-[40px] w-[40px] md:h-[50px] md:w-[50px] top-[80px] md:top-[90px] !important;
}

/* Remove the following CSS classes as they're now in the Tailwind classes */
.carousel-nav-button {
  @apply md:flex hidden absolute top-[90%] -translate-y-1/2 backdrop-blur-md rounded-full bg-white/[0.12] items-center justify-center w-12 h-12 border-none cursor-pointer transition-all duration-300 ease-in-out z-10;
}

.carousel-nav-button:hover {
  @apply bg-white/[0.21];
}
</style>
