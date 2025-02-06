<script setup lang="ts">
import { computed } from 'vue-demi'

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

const tooltipContent = computed(() => {
  return `${props.seconds}${props.tooltipText}`
})
</script>

<template>
  <button @click="rewind()" class="group rewind-button" v-tooltip="tooltipContent">
    <slot>
      <svg v-svg symbol="rewind-15-filled" class="mx-auto" size="36"></svg>
    </slot>
  </button>
</template>

<style scoped>
.rewind-button {
  @apply relative h-12 w-12 rounded-full text-cool-grey-300 hover:text-white;
}
</style>
