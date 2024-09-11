<script setup lang="ts">
const props = defineProps({
  seconds: {
    type: Number,
    default: 15
  }
})

const emit = defineEmits<{
  (e: 'fastForward', seconds: number): void
}>()

const handleFastForward = () => {
  emit('fastForward', props.seconds)
}
</script>

<template>
  <button @click="handleFastForward()" v-tooltip="'15 sec forward'" class="h-6 w-6">
    <svg
      v-svg
      symbol="forward-15-filled"
      class="h-full w-full text-white-70a hover:text-white"
    ></svg>
  </button>
</template>
