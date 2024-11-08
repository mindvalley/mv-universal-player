<script setup lang="ts">
import { ref } from 'vue-demi'
import { MVAdaptiveDurationTimer } from './../'

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
  localDuration.value = duration
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div
    data-testid="adaptive-duration-selector"
    class="bg-black p-4 w-[calc(100vw-32px)] sm:max-w-[560px] rounded-3xl text-white flex flex-col items-center justify-center relative"
  >
    <button
      data-testid="close-button"
      class="absolute top-4 right-6 rounded-full hover:bg-white-24a p-1"
      @click="handleClose"
    >
      <svg v-svg symbol="x-filled" class="h-4 w-4 text-white-70a"></svg>
    </button>
    <div data-testid="heading" class="text-center heading-9">How long do you want to listen?</div>
    <div class="flex flex-col items-center justify-center">
      <Transition name="slide" mode="out-in">
        <div data-testid="looping-container" v-if="localIsLooping" key="looping">
          <div
            data-testid="playing-forever-title"
            class="flex flex-col items-center justify-center h-[135px] my-6"
          >
            <svg v-svg symbol="infinity-filled" class="h-10 w-10 text-white"></svg>
            <div class="title-10">PLAYING FOREVER</div>
          </div>
          <div data-testid="stay-forever-container" class="flex flex-col">
            <button
              data-testid="stay-forever-button"
              @click="handleStayForever"
              class="rounded-full bg-white hover:bg-white-90a text-cool-grey-700 button-text-medium px-4 p-2"
            >
              Stay forever
            </button>
            <button
              data-testid="change-duration-button"
              @click="toggleMode"
              class="mt-2 text-white button-text-small py-2 px-4 flex flex-row rounded-full hover:bg-white-12a"
            >
              Change duration
            </button>
          </div>
        </div>
        <div
          data-testid="timer-container"
          v-else
          key="timer"
          class="flex flex-col items-center justify-center"
        >
          <div
            data-testid="timer-title"
            class="flex flex-col items-center justify-center h-[135px] my-6"
          >
            <button data-testid="timer-button" @click="toggleMode" class="mb-3">
              <svg v-svg symbol="infinity-filled" class="h-6 w-6 text-[#878581]"></svg>
            </button>
            <MVAdaptiveDurationTimer
              :duration="localDuration"
              @update:duration="handleUpdateDuration"
            />
          </div>
          <div class="flex flex-col items-center justify-center">
            <button
              data-testid="set-new-time-button"
              @click="setNewTime"
              class="rounded-full bg-white hover:bg-white-90a text-cool-grey-700 button-text-medium px-4 p-2"
            >
              Set new time
            </button>
            <button
              data-testid="forever-button"
              @click="handleStayForever"
              class="mt-2 text-white button-text-small py-2 px-4 flex flex-row rounded-full hover:bg-white-12a"
            >
              <span> <svg v-svg symbol="infinity-filled" class="h-4 w-4 text-white"></svg></span>
              <span class="ml-1 title-9">I want it to play forever</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
