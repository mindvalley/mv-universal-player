<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import BaseImage from './../../global/BaseImage.vue'
import { extractColors } from 'extract-colors'

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  isImmersiveModeActive: {
    type: Boolean,
    default: false
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null

onMounted(() => {
  window.addEventListener('resize', handleResize)
  initCanvas()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAnimation()
})

watch(
  () => props.isImmersiveModeActive,
  async (newValue) => {
    if (newValue) {
      await nextTick()
      handleResize() // Ensure canvas is properly resized and initialized
    } else {
      stopAnimation()
    }
  }
)

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
        // Extract color palette from the image
        const colorPalette = await extractColorPalette(props.image)

        // Start the animation
        animateBackground(ctx, colorPalette)
      }
    }
  }
}

function stopAnimation() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

async function extractColorPalette(imageSrc: string): Promise<string[]> {
  const colors = await extractColors(imageSrc, { pixels: 64000, distance: 0.22 })

  // Extract the first 5 colors and convert them to hex
  return colors.map((color) => color.hex)
}

function interpolateColors(color1, color2, factor) {
  const result = color1.slice()
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - result[i]))
  }
  return result
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`
}

function animateBackground(ctx: CanvasRenderingContext2D, colors: string[]) {
  let time = 0
  const stars = createStars(ctx.canvas.width, ctx.canvas.height)
  const rgbColors = colors.map(hexToRgb)

  const animate = () => {
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
      size: Math.random() * 2,
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
</script>

<template>
  <div class="relative w-full h-full flex flex-1">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
      v-show="isImmersiveModeActive"
    ></canvas>
    <BaseImage
      v-if="!isImmersiveModeActive"
      class="absolute inset-0 w-full h-full object-cover"
      :src="image"
      :width="1024"
    />
  </div>
</template>
