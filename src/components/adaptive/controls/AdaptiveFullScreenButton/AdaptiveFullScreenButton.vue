<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue-demi'

const props = defineProps({
  isFullscreen: {
    type: Boolean,
    default: false
  },
  isMobileLayout: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleFullscreen'])

const toggleFullscreen = () => {
  emit('toggleFullscreen')
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isFullscreen) {
    toggleFullscreen()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

watch(
  () => props.isFullscreen,
  (newValue) => {
    if (newValue) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }
)
</script>

<template>
  <button
    data-testid="adaptive-full-screen-button"
    v-if="isMobileLayout"
    class="h-6 w-6 xl:h-5 xl:w-5 outline-none"
    @click.stop="toggleFullscreen"
  >
    <svg
      v-svg
      :symbol="isFullscreen ? 'chevron-down-outlined' : 'chevron-up-outlined'"
      class="h-full w-full text-white-70a"
    ></svg>
  </button>
  <button
    data-testid="adaptive-full-screen-button"
    v-else
    v-tooltip="isFullscreen ? 'Exit full screen' : 'Full screen'"
    class="h-6 w-6 xl:h-5 xl:w-5 outline-none"
    @click="toggleFullscreen"
  >
    <svg
      v-svg
      :symbol="isFullscreen ? 'minimize-2-outlined' : 'maximize-2-outlined'"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
