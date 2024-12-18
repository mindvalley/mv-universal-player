<script setup lang="ts">
import { computed } from 'vue-demi'

const props = defineProps({
  seconds: {
    type: Number,
    default: 15
  },
  tooltipText: {
    type: String,
    default: '-Sec Forward'
  }
})

const emit = defineEmits<{
  (e: 'fastForward', seconds: number): void
}>()

const fastForward = () => {
  emit('fastForward', props.seconds)
}

const tooltipContent = computed(() => {
  return `${props.seconds}${props.tooltipText}`
})
</script>

<template>
  <button @click="fastForward()" class="group fast-forward-button" v-tooltip="tooltipContent">
    <slot>
      <svg v-svg symbol="forward-15-filled" class="mx-auto" size="36"></svg>
    </slot>
  </button>
</template>

<style scoped>
.fast-forward-button {
  @apply relative h-12 w-12 rounded-full text-cool-grey-300 hover:text-white;
}
</style>
