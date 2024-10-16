<script setup lang="ts">
import { ref, computed } from 'vue-demi'

const emit = defineEmits(['update:volume'])

const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const isHovering = ref(false)
const localVolume = ref(1)
const volumePercentage = computed(() => localVolume.value * 100)
const previousVolume = ref(localVolume.value)

const muted = computed(() => localVolume.value === 0)

const toggleMute = () => {
  if (muted.value) {
    localVolume.value = previousVolume.value
    emit('update:volume', previousVolume.value)
  } else {
    previousVolume.value = localVolume.value
    localVolume.value = 0
    emit('update:volume', 0)
  }
}

const updateVolume = (event: MouseEvent) => {
  if (!sliderRef.value) return
  const rect = sliderRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const newVolume = Math.round((x / rect.width) * 100) / 100
  localVolume.value = newVolume
  emit('update:volume', newVolume)
}

const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
  drag(event)
}

const drag = (event: MouseEvent) => {
  if (!isDragging.value) return
  updateVolume(event)
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<template>
  <div data-testid="adaptive-volume-slider" class="flex items-center space-x-2">
    <button
      data-testid="mute-button"
      v-tooltip="muted ? 'Unmute' : 'Mute'"
      @click="toggleMute"
      class="w-5 h-5"
    >
      <svg
        v-svg
        :symbol="muted ? 'volume-x-filled' : 'volume-2-filled'"
        class="h-full w-full text-white-70a hover:text-white"
      ></svg>
    </button>
    <div
      data-testid="slider"
      ref="sliderRef"
      @mousedown="startDrag"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      class="relative h-1 w-24 cursor-pointer rounded-full bg-white-24a"
    >
      <div
        data-testid="slider-bar"
        :style="{ width: `${volumePercentage}%` }"
        :class="[
          'absolute top-0 bottom-0 left-0 h-1 rounded-full transition-colors duration-200',
          isHovering || isDragging ? 'bg-red-500' : 'bg-white/80'
        ]"
      ></div>
      <div
        data-testid="slider-ball"
        v-if="isHovering || isDragging"
        :style="{ left: `${volumePercentage}%` }"
        class="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full bg-red-500"
        :class="{ 'cursor-grabbing': isDragging }"
      ></div>
    </div>
  </div>
</template>
