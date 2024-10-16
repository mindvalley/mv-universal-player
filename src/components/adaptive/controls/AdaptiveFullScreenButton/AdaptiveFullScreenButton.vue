<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue-demi'

const props = defineProps({
  isFullScreen: {
    type: Boolean,
    default: false
  },
  isMobileLayout: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleFullScreen'])

const toggleFullScreen = () => {
  emit('toggleFullScreen')
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isFullScreen) {
    toggleFullScreen()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

watch(
  () => props.isFullScreen,
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
    class="h-5 w-5 outline-none"
    @click.stop="toggleFullScreen"
  >
    <svg
      v-svg
      :symbol="isFullScreen ? 'chevron-down-outlined' : 'chevron-up-outlined'"
      class="h-full w-full text-white-70a"
    ></svg>
  </button>
  <button
    data-testid="adaptive-full-screen-button"
    v-else
    v-tooltip="isFullScreen ? 'Exit full screen' : 'Full screen'"
    class="h-5 w-5 outline-none"
    @click="toggleFullScreen"
  >
    <svg
      v-svg
      :symbol="isFullScreen ? 'minimize-2-outlined' : 'maximize-2-outlined'"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
