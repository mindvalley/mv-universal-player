<script setup lang="ts">
const props = defineProps({
  seconds: {
    type: Number,
    default: 15
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
  <button @click="rewind()" v-tooltip="'15 sec rewind'" class="h-6 w-6">
    <svg
      v-svg
      symbol="rewind-15-filled"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
