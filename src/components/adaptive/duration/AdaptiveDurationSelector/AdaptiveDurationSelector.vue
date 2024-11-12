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
    class="bg-black p-4 w-[calc(100vw-32px)] sm:max-w-[560px] rounded-3xl text-white flex flex-col items-center justify-center relative h-[308px]"
  >
    <button
      data-testid="close-button"
      class="absolute top-4 right-6 rounded-full hover:bg-white-24a p-1"
      @click="handleClose"
    >
      <svg v-svg symbol="x-filled" class="h-4 w-4 text-white-70a"></svg>
    </button>
    <div data-testid="heading" class="text-center heading-9">How long do you want to listen?</div>
    <div class="flex flex-col items-center justify-center h-full">
      <div class="content-container h-full w-full flex flex-col">
        <div class="flex flex-col items-center justify-center h-full relative">
          <!-- Timer numbers with transition -->
          <div
            :class="[
              'transition-all duration-500 relative mt-10',
              localIsLooping
                ? 'opacity-40 transform scale-90 blur-sm'
                : 'opacity-100 transform scale-100'
            ]"
          >
            <MVAdaptiveDurationTimer
              :duration="localDuration"
              @update:duration="handleUpdateDuration"
              class="text-center"
            />
          </div>

          <!-- Infinity icon -->
          <button
            :class="[
              'absolute transition-all duration-500 flex flex-col items-center justify-center z-10',
              localIsLooping
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'top-[20px] left-1/2 -translate-x-1/2'
            ]"
            @click="toggleMode"
          >
            <svg
              v-svg
              symbol="infinity-filled"
              :class="[
                'transition-all duration-500',
                localIsLooping
                  ? 'h-10 w-10 text-white'
                  : 'h-6 w-6 text-[#878581] hover:text-white-70a'
              ]"
            ></svg>
            <div v-if="localIsLooping" class="title-10 whitespace-nowrap opacity-0 animate-fade-in">
              PLAYING FOREVER
            </div>
          </button>
        </div>

        <!-- Controls -->
        <div class="mt-auto">
          <div data-testid="stay-forever-container" class="flex justify-center items-center">
            <div class="relative">
              <Transition name="fade" mode="out-in">
                <button
                  v-if="!localIsLooping"
                  data-testid="primary-action-button"
                  @click="setNewTime"
                  class="rounded-full bg-white hover:bg-white-90a text-cool-grey-700 button-text-medium px-[14px] py-3"
                >
                  <span class="whitespace-nowrap">Set new time</span>
                </button>

                <button
                  v-else
                  data-testid="primary-action-button"
                  @click="handleStayForever"
                  class="rounded-full bg-white hover:bg-white-90a text-cool-grey-700 button-text-medium px-[14px] py-3"
                >
                  <span class="whitespace-nowrap">Stay forever</span>
                </button>
              </Transition>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <Transition :name="localIsLooping ? 'fade-slide-reverse' : 'fade-slide'" mode="out-in">
              <button
                v-if="localIsLooping"
                data-testid="change-duration-button"
                @click="toggleMode"
                class="mt-2 text-white button-text-small py-2 px-4 flex flex-row rounded-full hover:bg-white-12a"
              >
                Change duration
              </button>
              <button
                v-else
                data-testid="forever-button"
                @click="handleStayForever"
                class="mt-2 text-white button-text-small py-2 px-4 flex flex-row rounded-full hover:bg-white-12a"
              >
                <span> <svg v-svg symbol="infinity-filled" class="h-4 w-4 text-white"></svg></span>
                <span class="ml-1 title-9">I want it to play forever</span>
              </button>
            </Transition>
          </div>
        </div>
      </div>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.9;
}

/* Make the transition faster and adjust the timing */
.fade-enter-active {
  transition-delay: 0.1s;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Add new reverse transition */
.fade-slide-reverse-enter-active,
.fade-slide-reverse-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-reverse-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-reverse-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.infinity-transition-enter-active,
.infinity-transition-leave-active {
  transition: all 0.3s ease;
}

.infinity-transition-enter-from,
.infinity-transition-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Smooth positioning transition */
.absolute {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s forwards;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

/* Ensure proper layering */
.z-10 {
  z-index: 10;
}

/* Add blur effect support */
.blur-sm {
  filter: blur(2px);
}
</style>
