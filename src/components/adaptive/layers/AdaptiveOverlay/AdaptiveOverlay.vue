<script setup lang="ts">
import { watch, onUnmounted } from 'vue-demi'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

// Watch for changes to show prop and toggle body scroll
watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      window.addEventListener('keydown', escapeListener)
    } else {
      window.removeEventListener('keydown', escapeListener)
    }
  }
)

function escapeListener(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

const close = () => {
  emit('close')
}

// Clean up when component is unmounted
onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', escapeListener)
})
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
        @click="close"
        @keyup.esc
      >
        <div data-testid="content" class="absolute inset-0 flex items-center justify-center">
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
