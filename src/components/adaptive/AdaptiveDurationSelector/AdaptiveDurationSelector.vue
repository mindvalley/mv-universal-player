<script setup lang="ts">
import { ref, computed } from 'vue'
import MVAdaptiveDurationTimer from '../AdaptiveDurationTimer'

const props = defineProps({
  duration: {
    type: Number,
    default: 240
  },
  isLooping: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'newTime', duration: number): void
  (e: 'forever'): void
  (e: 'close'): void
}>()
const localIsLooping = ref(props.isLooping)
const localDuration = ref(props.duration)

function handleStayForever() {
  emit('forever')
}

function setNewTime() {
  emit('newTime', localDuration.value)
}

const toggleMode = () => {
  localIsLooping.value = !localIsLooping.value
}

const handleUpdateDuration = (duration: number) => {
  console.log('duration', duration)
  localDuration.value = duration
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div
    class="bg-black max-w-xl p-4 min-w-[400px] sm:min-w-[560px] rounded-3xl text-white flex flex-col items-center justify-center relative"
  >
    <button class="absolute top-4 right-6" @click="handleClose">
      <svg v-svg symbol="x-filled" class="h-4 w-4 text-white-70a"></svg>
    </button>
    <div class="text-center title-8">How long do you want to listen?</div>
    <div class="flex flex-col items-center justify-center my-6 h-[135px]">
      <div v-if="localIsLooping" class="flex flex-col items-center justify-center my-4">
        <svg v-svg symbol="infinity-filled" class="h-10 w-10 text-white"></svg>
        <div class="title-10">PLAYING FOREVER</div>
      </div>

      <div v-else>
        <MVAdaptiveDurationTimer
          :duration="localDuration"
          @update:duration="handleUpdateDuration"
        />
      </div>
    </div>
    <div v-if="localIsLooping" class="flex flex-col">
      <button
        @click="handleStayForever"
        class="rounded-full bg-white hover:bg-white-90a text-cool-grey-700 title-8 px-4 p-2"
      >
        Stay forever
      </button>
      <button
        @click="toggleMode"
        class="mt-2 text-white title-9 py-2 px-4 flex flex-row rounded-full hover:bg-white-24a"
      >
        Change duration
      </button>
    </div>
    <div v-else class="flex flex-col items-center justify-center">
      <button
        @click="setNewTime"
        class="rounded-full bg-white hover:bg-white-90a text-cool-grey-700 title-8 px-4 p-2"
      >
        Set new time
      </button>
      <button
        @click="toggleMode"
        class="mt-2 text-white title-9 py-2 px-4 flex flex-row rounded-full hover:bg-white-24a"
      >
        <span> <svg v-svg symbol="infinity-filled" class="h-4 w-4 text-white"></svg></span>
        <span class="ml-1">I want it to play forever</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
