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
    data-testid="adaptive-immersive-button"
    v-tooltip="isImmersive ? 'Disable immersive' : 'Enable immersive'"
    class="h-5 w-5 outline-none"
    @click="toggleImmersive"
  >
    <svg
      v-svg
      symbol="meditation-outlined"
      class="h-full w-full"
      :class="[isImmersive ? 'text-red-500' : 'text-white-70a hover:text-white']"
    ></svg>
    <div data-testid="active-indicator" class="flex items-center justify-center">
      <span v-if="isImmersive" class="h-1 w-1 bg-red-500 rounded-full mt-[2px]"></span>
    </div>
  </button>
</template>
