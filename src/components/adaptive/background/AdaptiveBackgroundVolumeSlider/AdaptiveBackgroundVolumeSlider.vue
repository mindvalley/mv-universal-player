<script lang="ts" setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue-demi'

const props = defineProps({
  volume: {
    type: Number,
    default: 0.5
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1
  },
  step: {
    type: Number,
    default: 0.01
  },
  leftText: {
    type: String,
    default: 'sound'
  },
  rightText: {
    type: String,
    default: 'vocal'
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

const localVolume = ref(props.volume)

const sliderRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)

const calculateValue = (clientX: number) => {
  if (!sliderRef.value) return

  const rect = sliderRef.value.getBoundingClientRect()
  const position = clientX - rect.left
  const percentage = Math.max(0, Math.min(1, position / rect.width))
  const value = props.min + percentage * (props.max - props.min)

  // Round to nearest step
  const steps = Math.round((value - props.min) / props.step)
  return Math.min(props.max, Math.max(props.min, props.min + steps * props.step))
}

const handleMouseDown = (event: MouseEvent) => {
  if (props.isDisabled) return
  isDragging.value = true
  const value = calculateValue(event.clientX)
  if (value !== undefined) {
    localVolume.value = value
    emit('change', value)
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  const value = calculateValue(event.clientX)
  if (value !== undefined) {
    localVolume.value = value
    emit('change', value)
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

// Add and remove event listeners
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})

const thumbPosition = computed(() => {
  const percentage = (localVolume.value - props.min) / (props.max - props.min)
  return `${percentage * 100}%`
})

const progressWidth = computed(() => {
  const percentage = ((localVolume.value - props.min) / (props.max - props.min)) * 100
  return `${percentage}%`
})
</script>

<template>
  <span class="flex h-full w-full items-center justify-center" :class="{ disabled: isDisabled }">
    <span class="text-cool-grey-100 caption-disclaimer">{{ leftText }}</span>
    <div
      ref="sliderRef"
      class="custom-slider mx-4 w-full"
      :class="[isDisabled ? 'cursor-not-allowed' : 'cursor-pointer']"
      @mousedown="handleMouseDown"
    >
      <div class="track">
        <div class="progress-bar" :style="{ width: progressWidth }" />
        <div class="thumb" :style="{ left: thumbPosition }">
          <div class="thumb-content">
            <svg v-svg symbol="volume-2-filled" class="text-black h-[14px] w-[14px] no-drag"></svg>
          </div>
        </div>
      </div>
    </div>
    <span class="text-cool-grey-100 caption-disclaimer">{{ rightText }}</span>
  </span>
</template>

<style scoped lang="scss">
.disabled {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.custom-slider {
  position: relative;
  height: 28px;
  display: flex;
  align-items: center;

  // Add base transition
  opacity: 1;
  transition: opacity 0.3s ease;
}

.track,
.progress-bar {
  // Add base transition
  opacity: 1;
  transition: opacity 0.3s ease;
}

.track {
  width: 100%;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.6); // Bar: white 60A
  border-radius: 5rem;
  position: relative;
  top: 1px;
}

.custom-slider:not(.cursor-not-allowed) .track:hover {
  background-color: #fff; // Bar: white on hover
}

.progress-bar {
  position: absolute;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6); // Bar: white 60A
  border-radius: 5rem;
  left: 0;
}

.thumb {
  position: absolute;
  width: 28px;
  height: 28px;
  transform: translateX(-50%) translateY(-50%);
  top: 50%;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 50%;
  opacity: 1;
  transition: opacity 0.3s ease;

  .thumb-content {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.24);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-width 0.2s ease;

    svg {
      user-select: none;
      pointer-events: none;
    }
  }

  // Thick border for hover state
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    width: calc(100% + 16px);
    height: calc(100% + 16px);
    border-radius: 50%;
    border: 8px solid rgba(255, 255, 255, 0.24);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover:not(.disabled) {
    border: none;
  }

  &:hover:not(.disabled)::after {
    opacity: 1;
  }
}

// Update disabled styles
.disabled {
  opacity: 0.7;
  transition: opacity 0.3s ease;

  .track,
  .progress-bar {
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }

  .thumb {
    cursor: not-allowed;
    transition: opacity 0.3s ease;

    &:hover {
      border: 1px solid rgba(255, 255, 255, 0.24);
    }

    &:hover::after {
      opacity: 0;
    }
  }
}
</style>
