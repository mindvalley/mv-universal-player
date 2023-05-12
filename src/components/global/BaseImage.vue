<script setup lang="ts">
import { computed } from 'vue-demi'
const props = defineProps({
  aspectRatio: {
    default: 'auto',
    required: true,
    type: String
  },
  src: {
    required: true,
    type: String
  },
  lazyload: {
    default: true,
    type: Boolean
  },
  width: {
    // Only values in pixels supported.
    required: true,
    type: Number
  },
  quality: {
    default: 90,
    type: Number
  },
  imgClass: {
    type: String
  }
})

const imageSizes = computed(() => {
  // Refer https://tailwindcss.com/docs/screens for supported screen sizes.
  const sizes = [640, 768, 1024, 1280]
  const imgSizes = []

  // Only add size if it is the lower than the smallest supported screen
  if (props.width < sizes[0]) {
    imgSizes.push(props.width)
  }

  sizes.forEach((size) => {
    if (props.width >= size) {
      imgSizes.push(size)
    }
  })

  return imgSizes
})

const lowQualityImageSrc = computed(() => {
  const lowQualityImagePlaceholderWidth = Math.round(props.width / 10)
  return `${props.src}?transform=q_10,w_${lowQualityImagePlaceholderWidth},c_fill;`
})

const imageSizesAttributes = computed(() => {
  const imageSizesAttributes: any = []

  imageSizes.value.forEach((size, i, imageSizes) => {
    if (i === imageSizes.length - 1) {
      imageSizesAttributes.push(`${imageSizes[i]}px`)
    } else {
      imageSizesAttributes.push(`(max-width: ${size}px) ${imageSizes[i]}px`)
    }
  })

  return imageSizesAttributes
})

const imageSrcset = computed(() => {
  const imageSrcset: any = []

  imageSizes.value.forEach((size, i, imageSizes) => {
    imageSrcset.push(
      `${props.src}?transform=q_${props.quality},w_${size * 2},c_fill ${imageSizes[i]}w`
    )
  })

  return imageSrcset
})
const frameClass = computed(() => {
  if (props.aspectRatio === 'video') return `aspect-video`
  if (props.aspectRatio === 'square') return `aspect-square`
  if (props.aspectRatio === 'portrait') return `aspect-portrait`
  return ``
})

const customAspectRatioStyle = computed(() => {
  // HOW TO USE:
  // Pass the desired aspect ratio as aspect-ratio prop
  //  in a format of width x height. Example 9x16.
  const supportedAspectRatios = ['auto', 'video', 'square', 'portrait']

  const customAspectRatio = supportedAspectRatios.every((aspectRatio) => {
    if (props.aspectRatio !== aspectRatio) {
      return true
    }
  })

  if (customAspectRatio) {
    const w: string = props.aspectRatio.split('x')[0]
    const h: string = props.aspectRatio.split('x')[1]
    return `aspect-ratio: ${w} / ${h};`
  }

  return ''
})
</script>

<template>
  <div data-testid="base-image" class="w-full" :style="customAspectRatioStyle" :class="frameClass">
    <img
      data-testid="image"
      :style="customAspectRatioStyle"
      :class="[frameClass, imgClass]"
      class="w-full object-cover"
      :srcset="imageSrcset"
      :sizes="imageSizesAttributes"
      :src="lowQualityImageSrc"
      :loading="lazyload ? 'lazy' : 'auto'"
      alt=""
    />
  </div>
</template>
