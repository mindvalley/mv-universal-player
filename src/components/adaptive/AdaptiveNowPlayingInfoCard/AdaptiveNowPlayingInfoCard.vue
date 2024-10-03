<script setup lang="ts">
import BaseImage from '../../global/BaseImage.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'NOW PLAYING'
  },
  subTitle: {
    type: String,
    default: 'Soundscape'
  }
})
</script>

<template>
  <div class="flex flex-row items-center">
    <div class="h-4 w-9">
      <svg viewBox="0 0 109 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_5739_234)">
          <path
            d="M0 0C3.74143 0.308044 7.47038 0.788194 11.1819 1.32696C16.5321 2.10268 21.8574 3.07296 27.1079 4.365C32.079 5.58595 37.3132 6.90044 41.8242 9.39846C49.6811 13.7547 51.2675 22.8589 51.2675 31.1499V48C15.4646 29.672 0 0 0 0Z"
            fill="white"
          />
          <path
            d="M108.925 0C105.184 0.308044 101.456 0.788194 97.7448 1.32696C92.3945 2.10268 87.0692 3.07296 81.8175 4.365C76.8476 5.58595 71.6121 6.90044 67.1012 9.39846C59.2442 13.7547 57.6578 22.8589 57.6578 31.1499V48C93.4608 29.672 108.925 0 108.925 0Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_5739_234">
            <rect width="108.925" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>

    <div class="flex flex-col ml-2">
      <div class="caption-disclaimer text-cool-grey-200 uppercase">{{ title }}</div>
      <div class="title-9 text-white font-bold">{{ subTitle }}</div>
    </div>
  </div>
</template>
