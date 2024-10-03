<script setup lang="ts">
import { ref, watch, computed } from 'vue-demi'

const props = defineProps({
  selectedUnit: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['increment', 'decrement'])

const currentUnit = ref(props.selectedUnit)
const direction = ref('up')

// Add this computed property
const formattedUnit = computed(() => {
  return currentUnit.value.toString().padStart(2, '0')
})

watch(
  () => props.selectedUnit,
  (newValue, oldValue) => {
    currentUnit.value = newValue
  }
)

let intervalId: number | null = null
const interval = 300 // ms

const startIncrement = () => {
  handleIncrement()
  intervalId = setInterval(handleIncrement, interval)
}

const startDecrement = () => {
  handleDecrement()
  intervalId = setInterval(handleDecrement, interval)
}

const stopIncrement = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleIncrement = () => {
  direction.value = 'up'
  emit('increment')
}

const handleDecrement = () => {
  direction.value = 'down'
  emit('decrement')
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    handleIncrement()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    handleDecrement()
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-w-16 h-[100px]"
    tabindex="0"
    @keydown="handleKeyDown"
  >
    <button
      aria-label="Increment"
      class="w-14 py-1 flex items-center justify-center mb-1 outline-none h-4 rounded-sm hover:bg-white-8a"
      @mousedown="startIncrement"
      @mouseup="stopIncrement"
      @mouseleave="stopIncrement"
      @touchstart.prevent="startIncrement"
      @touchend="stopIncrement"
    >
      <svg v-svg symbol="chevron-up-outlined" class="h-3 w-3 text-white-90a"></svg>
    </button>
    <div class="relative overflow-hidden h-[60px] w-full">
      <transition :name="direction === 'up' ? 'slide-up' : 'slide-down'">
        <span
          :key="currentUnit"
          class="text-[44px] text-cool-grey-200 absolute inset-0 flex items-center justify-center"
        >
          {{ formattedUnit }}
        </span>
      </transition>
    </div>
    <div class="title-11 uppercase text-white-70a my-1">{{ label }}</div>
    <button
      aria-label="Decrement"
      class="w-14 py-1 flex items-center justify-center outline-none h-4 rounded-full hover:bg-white-8a"
      @mousedown="startDecrement"
      @mouseup="stopIncrement"
      @mouseleave="stopIncrement"
      @touchstart.prevent="startDecrement"
      @touchend="stopIncrement"
    >
      <svg v-svg symbol="chevron-down-outlined" class="h-3 w-3 text-white-90a"></svg>
    </button>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(-100%);
}

.slide-down-enter-from {
  transform: translateY(-100%);
}

.slide-down-leave-to {
  transform: translateY(100%);
}
</style>
