<script lang="ts" setup>
import { ref } from 'vue-demi'

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

const handleVolumeChange = (event: any) => {
  const volume = Number(event.target.value)
  localVolume.value = volume
  emit('change', volume)
}
</script>

<template>
  <span class="flex h-full w-full items-center justify-center" :class="{ disabled: isDisabled }">
    <span class="text-cool-grey-250 text-xs">{{ leftText }}</span>
    <input
      data-testid="volume-slider"
      :min="min"
      :max="max"
      :step="step"
      type="range"
      :value="localVolume"
      class="w-full mx-4"
      :class="[isDisabled ? 'cursor-not-allowed' : 'cursor-pointer']"
      @input="handleVolumeChange"
      :disabled="isDisabled"
    />
    <span class="text-cool-grey-250 text-xs">{{ rightText }}</span>
  </span>
</template>

<style scoped lang="scss">
.disabled {
  filter: brightness(0.5);
}

$track-background-color: #fff;
$track-border-radius: 5rem;
$track-height: 0.25rem;
$thumb-margin: -12px;
$thumb-appearance: none;
$thumb-height: 28px;
$thumb-width: 26px;
$thumb-border: 0;
$thumb-background-url: url("data:image/svg+xml,<svg width='26' height='28' viewBox='0 0 26 28' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='26' height='26' rx='13' fill='white'/> <path d='M17.5366 9.4634C17.3089 9.23556 16.9395 9.2355 16.7117 9.46327C16.4838 9.69104 16.4838 10.0604 16.7115 10.2882C17.6958 11.2728 18.2487 12.6079 18.2487 14C18.2487 15.3921 17.6958 16.7272 16.7115 17.7117C16.4838 17.9396 16.4838 18.3089 16.7117 18.5367C16.9395 18.7645 17.3089 18.7644 17.5366 18.5366C18.7396 17.3333 19.4153 15.7015 19.4153 14C19.4153 12.2985 18.7396 10.6667 17.5366 9.4634Z' fill='%23000000'/> <path d='M15.4775 11.5226C15.2497 11.2947 14.8803 11.2947 14.6525 11.5224C14.4247 11.7502 14.4246 12.1196 14.6524 12.3474C15.0898 12.785 15.3356 13.3783 15.3356 13.9971C15.3356 14.6158 15.0898 15.2092 14.6524 15.6467C14.4246 15.8746 14.4247 16.2439 14.6525 16.4717C14.8803 16.6995 15.2497 16.6994 15.4775 16.4716C16.1336 15.8152 16.5022 14.9251 16.5022 13.9971C16.5022 13.069 16.1336 12.1789 15.4775 11.5226Z' fill='%23000000'/> <path d='M12.9999 9.91669C12.9999 9.69246 12.8714 9.48807 12.6693 9.39093C12.4672 9.2938 12.2273 9.32111 12.0522 9.46119L9.2953 11.6667H7.16659C6.84442 11.6667 6.58325 11.9279 6.58325 12.25V15.75C6.58325 16.0722 6.84442 16.3334 7.16659 16.3334H9.2953L12.0522 18.5389C12.2273 18.6789 12.4672 18.7063 12.6693 18.6091C12.8714 18.512 12.9999 18.3076 12.9999 18.0834V9.91669Z' fill='%23000000'/></svg>");

/********** Range Input Styles **********/
input[type='range'] {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  border-radius: 40rem !important;
  background: transparent;
}

/***** Chrome, Safari, Opera and Edge Chromium styles *****/
input[type='range']::-webkit-slider-runnable-track {
  background-color: $track-background-color;
  border-radius: $track-border-radius;
  height: $track-height;
}

input[type='range']::-webkit-slider-thumb {
  margin-top: $thumb-margin;
  -webkit-appearance: $thumb-appearance;
  appearance: $thumb-appearance;
  width: $thumb-width;
  height: $thumb-height;
  border: $thumb-border;
  background: $thumb-background-url;
}

/******** Firefox styles ********/
input[type='range']::-moz-range-track {
  background-color: $track-background-color;
  border-radius: $track-border-radius;
  height: $track-height;
}

input[type='range']::-moz-range-thumb {
  margin-top: $thumb-margin;
  -webkit-appearance: $thumb-appearance;
  appearance: $thumb-appearance;
  width: $thumb-width;
  height: $thumb-height;
  border: $thumb-border;
  background: $thumb-background-url;
}
</style>
