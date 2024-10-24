<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, watchEffect, computed } from 'vue-demi'
import { extractColorsFromImageData } from 'extract-colors'
import { createNoise3D } from 'simplex-noise'

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  isImmersiveModeActive: {
    type: Boolean,
    default: false
  },
  playing: {
    type: Boolean,
    default: false
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
const colorPalette = ref([])
const isAnimating = ref(false)

const noise3D = createNoise3D()

const backgroundStyle = computed(() => ({
  overflow: 'hidden',
  position: 'relative'
}))

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  await extractColorPalette(props.image)
  initCanvas()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAnimation()
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

function handleResize() {
  if (canvasRef.value && props.isImmersiveModeActive) {
    canvasRef.value.width = canvasRef.value.offsetWidth
    canvasRef.value.height = canvasRef.value.offsetHeight
    initCanvas()
  }
}

async function initCanvas() {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      canvasRef.value.width = canvasRef.value.offsetWidth
      canvasRef.value.height = canvasRef.value.offsetHeight

      if (canvasRef.value.width > 0 && canvasRef.value.height > 0) {
        if (props.playing) {
          startAnimation()
        }
      }
    }
  }
}

async function extractColorPalette(imageSrc: string) {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = imageSrc

  await new Promise((resolve) => {
    img.onload = resolve
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = img.width
  canvas.height = img.height

  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const colors = await extractColorsFromImageData(imageData, {
    pixels: 64000,
    distance: 0.22
  })

  colorPalette.value = colors.length > 0 ? colors.slice(0, 5).map((color) => color.hex) : []
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
  const now = Date.now()
  const time = now / 4000

  ctx.clearRect(0, 0, width, height)

  // Modify the gradient to extend further down
  const gradient = ctx.createLinearGradient(0, 0, width, height * 1.5)

  // Use colorPalette colors for the gradient
  const colors =
    colorPalette.value.length >= 5
      ? colorPalette.value
      : ['#563B94', '#B2405F', '#00C800', '#373C8C', '#00C800']

  gradient.addColorStop(0, hexToRgba(colors[1]))
  gradient.addColorStop((Math.sin(time) + 1) * 0.5 * 0.2, hexToRgba(colors[1]))
  gradient.addColorStop((Math.cos(time) + 1) * 0.5 * 0.2 + 0.444, hexToRgba(colors[0]))
  gradient.addColorStop(1, hexToRgba(colors[1]))
  gradient.addColorStop(1, hexToRgba(colors[1]))

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height * 10)

  ctx.save()
  // ctx.globalCompositeOperation = 'source-over'

  ctx.restore()

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  const octaves = 0.3
  // Adjust the noise scale
  const scaleX = 2 / octaves
  const scaleY = 0.5 / octaves

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width
    const y = Math.floor(i / 4 / width)

    let n = 0
    let frequency = 0.3
    let persistence = 1.5

    for (let oi = 0; oi < octaves; oi++) {
      frequency *= 2
      const amplitude = Math.pow(persistence, oi)
      n +=
        noise3D((x / width) * frequency * scaleX, (y / height) * frequency * scaleY, time) *
        amplitude
    }

    const factor = n * 0.5 + 0.5

    data[i] = Math.floor(factor * data[i])
    data[i + 1] = Math.floor(factor * data[i + 1])
    data[i + 2] = Math.floor(factor * data[i + 2])
  }

  ctx.putImageData(imageData, 0, 0)
}

function animate() {
  if (!isAnimating.value) return

  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    animateAurora(ctx)
  }

  animationFrameId = requestAnimationFrame(animate)
}

async function startAnimation() {
  if (!isAnimating.value) {
    isAnimating.value = true
    animate()
  }
}

function pauseAnimation() {
  isAnimating.value = false
}

function stopAnimation() {
  isAnimating.value = false
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
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
