<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, watchEffect, computed } from 'vue-demi'
import { extractColorsFromImageData } from 'extract-colors'

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

const randomBackgroundColor = ref('')

// Add this computed property
const backgroundStyle = computed(() => ({
  backgroundColor: randomBackgroundColor.value
}))

// Add this ref to track the animation state
const isAnimating = ref(false)

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

// Modify the watchEffect to include the playing prop
watchEffect(async () => {
  if (props.isImmersiveModeActive) {
    await nextTick()
    handleResize() // Ensure canvas is properly resized and initialized
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
      // Set canvas size
      canvasRef.value.width = canvasRef.value.offsetWidth || 300 // Fallback width
      canvasRef.value.height = canvasRef.value.offsetHeight || 150 // Fallback height

      if (canvasRef.value.width > 0 && canvasRef.value.height > 0) {
        // Generate random background color
        randomBackgroundColor.value =
          colorPalette.value.length > 0 ? colorPalette.value[0] : '#000000'

        // Start the animation only if playing is true
        if (props.playing) {
          startAnimation()
        }
      }
    }
  }
}

async function extractColorPalette(imageSrc: string) {
  // Create an Image object
  const img = new Image()
  img.crossOrigin = 'Anonymous' // To avoid CORS issues
  img.src = imageSrc

  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve
  })

  // Create a canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Set canvas size to match the image
  canvas.width = img.width
  canvas.height = img.height

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0)

  // Get the ImageData from the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  // Extract colors using the library function
  const colors = await extractColorsFromImageData(imageData, {
    pixels: 64000,
    distance: 0.22
  })

  // Extract the first 5 colors and convert them to hex
  colorPalette.value = colors.length > 0 ? colors.slice(0, 5).map((color) => color.hex) : []
}

function interpolateColors(color1, color2, factor) {
  const result = color1.slice()
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - result[i]))
  }
  return result
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function rgbToHex(rgb: number[]) {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`
}

// Modify the animateBackground function
function animateBackground(ctx: CanvasRenderingContext2D, colors: string[]) {
  let time = 0
  const stars = createStars(ctx.canvas.width, ctx.canvas.height)
  const rgbColors = colors.length > 0 ? colors.map(hexToRgb) : []

  const animate = () => {
    if (!isAnimating.value) return

    time += 0.001 // Slow down the animation
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    ctx.clearRect(0, 0, width, height)

    // Create multiple linear gradients to simulate Northern Lights
    for (let i = 0; i < 5; i++) {
      // Increase the number of gradients
      const gradient = ctx.createLinearGradient(
        0,
        height * Math.sin(time + i),
        width,
        height * Math.cos(time + i)
      )

      for (let j = 0; j < rgbColors.length; j++) {
        const color1 = rgbColors[j]
        const color2 = rgbColors[(j + 1) % rgbColors.length]
        const factor = (time * 0.2 + j / rgbColors.length) % 1
        const interpolatedColor = rgbToHex(interpolateColors(color1, color2, factor))
        gradient.addColorStop(j / rgbColors.length, interpolatedColor)
      }

      ctx.globalAlpha = 0.1 // Reduce the global alpha value to make gradients less visible
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    // Draw stars
    drawStars(ctx, stars, time, width, height)

    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
}

function createStars(width: number, height: number) {
  const stars = []
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5
    })
  }
  return stars
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: any[],
  time: number,
  width: number,
  height: number
) {
  ctx.fillStyle = 'white'
  stars.forEach((star) => {
    star.x += star.speedX
    star.y += star.speedY

    // Wrap stars around the edges
    if (star.x < 0) star.x = width
    if (star.x > width) star.x = 0
    if (star.y < 0) star.y = height
    if (star.y > height) star.y = 0

    const twinkle = Math.sin(time * 2 + star.speedX * 100) * 0.5 + 0.5
    ctx.globalAlpha = twinkle
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
}

// Add these new functions to control the animation
async function startAnimation() {
  if (!isAnimating.value) {
    isAnimating.value = true
    if (canvasRef.value) {
      const ctx = canvasRef.value.getContext('2d')
      if (ctx) {
        animateBackground(ctx, colorPalette.value)
      }
    }
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
  <div class="relative w-full h-full flex flex-1 bg-black" :style="backgroundStyle">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
      v-show="isImmersiveModeActive"
    ></canvas>
  </div>
</template>
