<script setup lang="ts">
import { useDetectBrowser } from './../../../composables/use-detect-browser'
const { isTouchDevice } = useDetectBrowser()

const props = defineProps({
  seconds: {
    type: Number,
    default: 15
  },
  tooltipText: {
    type: String,
    default: '-Sec Rewind'
  }
})

const emit = defineEmits<{
  (e: 'rewind', seconds: number): void
}>()

const rewind = () => {
  emit('rewind', props.seconds)
}
</script>

<template>
  <button @click="rewind()" class="group rewind-button">
    <slot>
      <svg v-svg symbol="rewind-15-filled" class="mx-auto" size="36"></svg>
    </slot>
    <span class="tooltip-text" v-if="!isTouchDevice">{{ seconds }}{{ tooltipText }} </span>
  </button>
</template>

<style scoped>
.rewind-button {
  @apply relative h-12 w-12 rounded-full text-cool-grey-300 hover:text-white;
}

.tooltip-text {
  @apply absolute -left-10 -top-1 hidden w-max -translate-y-full animate-fade rounded bg-black px-3 py-1 text-center text-sm text-cool-grey-400 after:absolute after:left-1/2 after:top-[90%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-cool-grey-700 after:content-[''] group-hover:flex;
}
</style>
