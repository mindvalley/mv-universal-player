<script setup lang="ts">
import { ref, computed, watch } from 'vue-demi'
import { useGlobal } from '../../../composables/use-global'
import type { AdaptiveSize } from '../../../types/adaptive'

const props = defineProps({
  duration: {
    type: Number,
    required: true
  },
  currentTime: {
    type: Number,
    required: true,
    default: 0
  },
  size: {
    type: String as () => AdaptiveSize,
    default: 'SMALL'
  },
  // Add a new prop for looping state
  loopingEnabled: {
    type: Boolean,
    default: false
  },
  isPlaying: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'seek', currentTime: number): void
}>()

const seekerUi = ref<HTMLElement | null>(null)
const tooltip = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const isHovering = ref(false)
const isHoveringActive = ref(false)
const { humanizeTime } = useGlobal()

// Add this local ref for current time
const localCurrentTime = ref(props.currentTime)

const hasPlaybackStarted = computed(() => props.currentTime > 0)

const isInteractive = computed(() => hasPlaybackStarted.value && !props.loopingEnabled)

// Update the progressPercentage computed property
const progressPercentage = computed(() => {
  return (localCurrentTime.value / props.duration) * 100
})

// Add this computed property
const tooltipPosition = computed(() => {
  return `${progressPercentage.value}%`
})

const scrubberPosition = computed(() => {
  const scrubberWidth = 12 // Assuming the scrubber is 12px wide
  const edgeThreshold = (scrubberWidth / 2 / (seekerUi.value?.offsetWidth || 1)) * 100
  let position = progressPercentage.value

  if (position < edgeThreshold) {
    position = 0
  } else if (position > 100 - edgeThreshold) {
    position = 100
  }

  return `${position}%`
})

const updateTooltip = (event: MouseEvent) => {
  if (!isInteractive.value) return
  if (!tooltip.value || !seekerUi.value) return
  const rect = seekerUi.value.getBoundingClientRect()
  const hoverPosition = event.clientX - rect.left
  const hoverPercentage = (hoverPosition / rect.width) * 100
  const hoverTime = (hoverPercentage / 100) * props.duration

  isHoveringActive.value = hoverPercentage <= progressPercentage.value

  let tooltipLeft: string

  if (isHoveringActive.value) {
    tooltipLeft = tooltipPosition.value
  } else {
    tooltipLeft = `${hoverPercentage}%`
  }

  // Adjust tooltip position if it's near the edges
  const tooltipWidth = tooltip.value.offsetWidth
  const edgeThreshold = ((tooltipWidth / rect.width) * 100) / 2 // Half of tooltip width in percentage

  if (parseFloat(tooltipLeft) < edgeThreshold) {
    tooltipLeft = '0%'
    tooltip.value.style.transform = 'translateX(0)'
  } else if (parseFloat(tooltipLeft) > 100 - edgeThreshold) {
    tooltipLeft = '100%'
    tooltip.value.style.transform = 'translateX(-100%)'
  } else {
    tooltip.value.style.transform = 'translateX(-50%)'
  }

  tooltip.value.style.left = tooltipLeft

  if (isHoveringActive.value) {
    tooltip.value.textContent = humanizeTime(props.currentTime)
  } else {
    tooltip.value.textContent = humanizeTime(hoverTime)
  }

  tooltip.value.style.display = isHovering.value ? 'block' : 'none'
}

const showTooltip = () => {
  if (!isInteractive.value) return
  isHovering.value = true
}

const hideTooltip = () => {
  isHovering.value = false
  isHoveringActive.value = false
}

const startDrag = (event: MouseEvent) => {
  if (!isInteractive.value) return
  isDragging.value = true
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
  drag(event)
}

const drag = (event: MouseEvent) => {
  if (!isDragging.value || !seekerUi.value || !isInteractive.value) return
  const rect = seekerUi.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const percentage = x / rect.width
  const newTime = props.duration * percentage

  // Update the local current time
  localCurrentTime.value = newTime

  // Always update tooltip to show dragged position time
  if (tooltip.value) {
    tooltip.value.style.left = `${percentage * 100}%`
    tooltip.value.textContent = humanizeTime(newTime)
  }
}

const stopDrag = (event: MouseEvent) => {
  if (!isDragging.value || !seekerUi.value || !isInteractive.value) return

  const rect = seekerUi.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const percentage = x / rect.width
  const newTime = props.duration * percentage

  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)

  // Emit the seek event when dragging stops
  emit('seek', newTime)
}

// Modify the watch function to update localCurrentTime
watch(
  () => props.currentTime,
  (newTime) => {
    if (!isDragging.value) {
      localCurrentTime.value = newTime
    }
    if (tooltip.value && isHoveringActive.value) {
      tooltip.value.textContent = humanizeTime(newTime)
      tooltip.value.style.left = tooltipPosition.value
      tooltip.value.dataset.time = newTime.toString()
    }
  }
)
</script>

<template>
  <section class="relative flex items-center justify-center md:w-full">
    <span v-if="size === 'BIG'" class="flex shrink-0 items-center justify-center text-xs">
      {{ humanizeTime(localCurrentTime) }}
    </span>
    <span class="w-full shrink" :class="{ 'bg-black': size === 'SMALL' }">
      <div
        ref="seekerUi"
        @mousedown="startDrag"
        @pointerenter="showTooltip"
        @pointermove="updateTooltip($event)"
        @pointerleave="hideTooltip"
        class="flex items-center bg-white-24a"
        :class="{ 'cursor-pointer': isInteractive, 'cursor-default': !isInteractive }"
      >
        <div
          class="relative h-1 w-full shrink rounded-full"
          :class="{ 'bg-white-24a': !loopingEnabled, 'bg-red-500': loopingEnabled }"
        >
          <div
            v-if="!loopingEnabled"
            :style="{ width: progressPercentage + '%' }"
            :class="[
              'absolute top-0 bottom-0 h-1 rounded-full bg-red-500',
              { 'transition-width duration-150 ease-linear': !isDragging }
            ]"
          ></div>
          <!-- Scrubber circle -->
          <div
            v-if="(isHovering || isDragging) && !loopingEnabled"
            class="scrubber-circle"
            :style="{ left: scrubberPosition }"
            @mousedown.stop="startDrag"
          ></div>
        </div>
      </div>
      <div
        ref="tooltip"
        class="tooltip"
        :style="{ display: isHovering && isInteractive ? 'block' : 'none' }"
      ></div>
    </span>
    <span v-if="size === 'BIG'" class="flex shrink-0 items-center justify-center text-xs">
      {{ humanizeTime(duration) }}
    </span>
  </section>
</template>

<style scoped>
.transition-width {
  transition: width 0.15s linear;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  margin-bottom: 8px;
  white-space: nowrap;
  /* Remove any existing left or transform properties */
}

.tooltip-active {
  top: -30px; /* Adjust this value to position the tooltip above the scrubber circle */
}

/* Add styles for the scrubber circle */
.scrubber-circle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background-color: #ef4444; /* red-500 equivalent */
  border-radius: 50%;
  transform: translate(0, -50%);
  cursor: pointer;
}

.scrubber-circle[style*='left: 0%'] {
  transform: translate(0, -50%);
}

.scrubber-circle[style*='left: 100%'] {
  transform: translate(-100%, -50%);
}

.scrubber-circle:not([style*='left: 0%']):not([style*='left: 100%']) {
  transform: translate(-50%, -50%);
}

.cursor-default {
  cursor: default;
}
</style>
