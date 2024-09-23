<script setup lang="ts">
const props = defineProps({
  isImmersive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleImmersive'])

const toggleImmersive = () => {
  emit('toggleImmersive')
}
</script>

<template>
  <button
    v-tooltip="isImmersive ? 'Disable immersive' : 'Enable immersive'"
    class="h-6 w-6 outline-none"
    @click="toggleImmersive"
  >
    <svg
      v-svg
      symbol="meditation-outlined"
      class="h-full w-full"
      :class="[isImmersive ? 'text-red-500' : 'text-white-70a hover:text-white']"
      size="20"
    ></svg>
  </button>
</template>
