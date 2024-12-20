<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, watchEffect, computed } from 'vue-demi'
import { createNoise3D } from 'simplex-noise'

const props = defineProps({
  isImmersiveModeActive: {
    type: Boolean,
    default: false
  },
  playing: {
    type: Boolean,
    default: false
  },
  colorPalette: {
    type: Array<string>,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
const isAnimating = ref(false)

const noise3D = ref(createNoise3D())

const backgroundStyle = computed(() => ({
  overflow: 'hidden',
  position: 'relative'
}))

// Add these refs after the existing refs
const startTime = ref<number | null>(null)
const pausedTime = ref<number | null>(null)
const totalPausedTime = ref(0)

// Add a new debounced resize handler
let resizeTimeout: number | null = null

onMounted(() => {
  window.addEventListener('resize', handleResize)
  initCanvas()
  // Draw initial frame
  drawInitialFrame()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAnimation()
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})

watch(
  () => props.playing,
  (newVal) => {
    if (newVal) {
      startAnimation()
    } else {
      pauseAnimation()
    }
  }
)

watchEffect(async () => {
  if (props.isImmersiveModeActive) {
    await nextTick()
    handleResize()
    if (props.playing) {
      startAnimation()
    } else {
      pauseAnimation()
    }
  } else {
    stopAnimation()
  }
})

watch(
  () => props.visible,
  async (isVisible) => {
    if (isVisible) {
      await nextTick()
      handleResize()
      if (props.playing) {
        startAnimation()
      } else {
        drawInitialFrame()
      }
    } else {
      stopAnimation()
    }
  }
)

function handleResize() {
  if (!canvasRef.value || !props.isImmersiveModeActive) return

  const newWidth = canvasRef.value.offsetWidth
  const newHeight = canvasRef.value.offsetHeight

  if (newWidth === 0 || newHeight === 0) return

  const ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  // Store old dimensions and content
  const oldCanvas = canvasRef.value
  if (oldCanvas.width > 0 && oldCanvas.height > 0) {
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = oldCanvas.width
    tempCanvas.height = oldCanvas.height
    const tempCtx = tempCanvas.getContext('2d')
    if (tempCtx) {
      tempCtx.drawImage(oldCanvas, 0, 0)

      // Resize canvas
      canvasRef.value.width = newWidth
      canvasRef.value.height = newHeight

      // Draw the old content scaled to the new size
      ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight)
    }
  } else {
    canvasRef.value.width = newWidth
    canvasRef.value.height = newHeight
  }

  // Instead of full reinit, just trigger a new frame
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  resizeTimeout = setTimeout(() => {
    if (props.playing) {
      // If we're playing, just let the animation continue
      return
    } else {
      // If we're paused, draw a new static frame
      drawInitialFrame()
    }
  }, 100) as unknown as number
}

async function initCanvas() {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d', { willReadFrequently: true })
    if (ctx) {
      canvasRef.value.width = canvasRef.value.offsetWidth
      canvasRef.value.height = canvasRef.value.offsetHeight

      if (canvasRef.value.width > 0 && canvasRef.value.height > 0) {
        if (props.playing) {
          startAnimation()
        } else {
          // Draw initial frame when not playing
          drawInitialFrame()
        }
      }
    }
  }
}

function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function animateAurora(ctx: CanvasRenderingContext2D) {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  if (!width || !height) return

  // Calculate time with pause offset
  if (startTime.value === null) {
    startTime.value = Date.now()
  }
  const currentTime = Date.now()
  const time = (currentTime - startTime.value - totalPausedTime.value) / 4000

  // Clear only the visible area
  ctx.clearRect(0, 0, width, height)

  // Create gradient once and reuse
  const gradient = ctx.createLinearGradient(0, 0, width, height * 1.5)
  const colors =
    props.colorPalette.length >= 5
      ? props.colorPalette
      : ['#563B94', '#B2405F', '#00C800', '#373C8C', '#00C800']

  const sinTime = (Math.sin(time) + 1) * 0.1 // Precalculate
  const cosTime = (Math.cos(time) + 1) * 0.1 + 0.444

  gradient.addColorStop(0, hexToRgba(colors[1]))
  gradient.addColorStop(sinTime, hexToRgba(colors[1]))
  gradient.addColorStop(cosTime, hexToRgba(colors[0]))
  gradient.addColorStop(1, hexToRgba(colors[1]))

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Get image data only for the visible area
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // Precalculate constants
  const octaves = 0.3
  const scaleX = 2 / octaves
  const scaleY = 0.5 / octaves
  const widthInv = 1 / width
  const heightInv = 1 / height

  // Process pixels in chunks for better performance
  const frequency = 0.3

  // Add these constants
  const chunkSize = 4 // Process every 2nd pixel
  const heightSteps = Math.ceil(height / chunkSize)
  const widthSteps = Math.ceil(width / chunkSize)

  // Process pixels in larger steps
  for (let y = 0; y < heightSteps; y++) {
    const actualY = y * chunkSize
    const yCoord = actualY * heightInv * frequency * scaleY
    const rowOffset = actualY * width * 4

    for (let x = 0; x < widthSteps; x++) {
      const actualX = x * chunkSize
      const i = rowOffset + actualX * 4
      const xCoord = actualX * widthInv * frequency * scaleX

      // Calculate noise once for each chunk
      const n = noise3D.value(xCoord, yCoord, time)
      const factor = n * 0.5 + 0.5

      // Apply to all pixels in the chunk
      for (let dy = 0; dy < chunkSize && actualY + dy < height; dy++) {
        for (let dx = 0; dx < chunkSize && actualX + dx < width; dx++) {
          const pixelIndex = i + (dy * width + dx) * 4
          data[pixelIndex] = (data[pixelIndex] * factor) | 0
          data[pixelIndex + 1] = (data[pixelIndex + 1] * factor) | 0
          data[pixelIndex + 2] = (data[pixelIndex + 2] * factor) | 0
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function animate() {
  if (!isAnimating.value) return

  const ctx = canvasRef.value?.getContext('2d', { willReadFrequently: true })
  if (ctx) {
    animateAurora(ctx)
  }

  animationFrameId = setTimeout(() => {
    animationFrameId = requestAnimationFrame(animate)
  }, 20) as unknown as number
}

function startAnimation() {
  if (!isAnimating.value) {
    isAnimating.value = true
    if (startTime.value === null) {
      startTime.value = Date.now()
      totalPausedTime.value = 0
    } else if (pausedTime.value !== null) {
      totalPausedTime.value += Date.now() - pausedTime.value
      pausedTime.value = null
    }
    animate()
  }
}

function pauseAnimation() {
  isAnimating.value = false
  pausedTime.value = Date.now()
  if (animationFrameId !== null) {
    clearTimeout(animationFrameId)
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

function stopAnimation() {
  pauseAnimation()
  if (animationFrameId !== null) {
    clearTimeout(animationFrameId)
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  // Reset all timing variables
  startTime.value = null
  pausedTime.value = null
  totalPausedTime.value = 0
}

function drawInitialFrame() {
  const ctx = canvasRef.value?.getContext('2d', { willReadFrequently: true })
  if (ctx) {
    if (startTime.value === null) {
      startTime.value = Date.now()
      totalPausedTime.value = 0
    }
    animateAurora(ctx)
  }
}
</script>

<template>
  <div
    data-testid="adaptive-immersive-layer"
    class="relative w-full h-full flex flex-1"
    :style="backgroundStyle"
  >
    <canvas
      ref="canvasRef"
      data-testid="canvas"
      class="absolute inset-0 w-full h-full"
      v-show="isImmersiveModeActive"
    ></canvas>
  </div>
</template>
