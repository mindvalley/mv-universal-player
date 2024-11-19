<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])
</script>

<template>
  <div data-testid="adaptive-overlay">
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="show"
        data-testid="overlay"
        class="fixed inset-0 bg-black-70a backdrop-blur-[2px]"
        :style="{ zIndex: 100 }"
      ></div>
    </transition>

    <!-- Content -->
    <transition name="slide-up">
      <div
        v-if="show"
        data-testid="content-container"
        class="fixed inset-0 overflow-hidden"
        :style="{ zIndex: 150 }"
      >
        <div
          data-testid="content"
          class="absolute inset-0 flex items-center justify-center"
          @click="$emit('close')"
        >
          <div @click.stop>
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.48s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
