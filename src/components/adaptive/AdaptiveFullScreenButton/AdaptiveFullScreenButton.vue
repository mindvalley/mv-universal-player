<script setup lang="ts">
const props = defineProps({
  isFullScreen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['minimize', 'maximize'])

const toggleFullScreen = () => {
  emit(props.isFullScreen ? 'minimize' : 'maximize')
}
</script>

<template>
  <button
    v-tooltip="isFullScreen ? 'Exit full screen' : 'Full screen'"
    class="h-5 w-5"
    @click="toggleFullScreen"
  >
    <svg
      v-svg
      :symbol="isFullScreen ? 'minimize-2-outline' : 'maximize-2-outline'"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
