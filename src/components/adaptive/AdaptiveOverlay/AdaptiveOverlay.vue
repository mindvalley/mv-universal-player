<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  zIndex: {
    type: Number,
    default: 50
  }
})

defineEmits(['close'])
</script>

<template>
  <div>
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px]"
        :style="{ zIndex }"
      ></div>
    </transition>

    <!-- Content -->
    <transition name="slide-up">
      <div v-if="show" class="fixed inset-0 overflow-hidden" :style="{ zIndex: zIndex + 50 }">
        <div class="absolute inset-0 flex items-center justify-center" @click="$emit('close')">
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
  transition: all 0.6s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
