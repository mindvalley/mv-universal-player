<script setup lang="ts">
import { ref, computed } from 'vue-demi'
import { useGlobal } from './../../../composables/use-global'

const props = defineProps({
  duration: {
    type: Number,
    required: true
  },
  currentTime: {
    type: Number,
    required: true,
    default: 0
  }
})

const emit = defineEmits<{
  (e: 'seek', currentTime: number): void
}>()

const seekerUi: any = ref(null)
const { humanizeTime } = useGlobal()

const seek = (event: any) => {
  const completionPercentage = (event.offsetX / seekerUi.value.offsetWidth) * 100
  const currentTime = props.duration * (completionPercentage / 100)
  emit('seek', currentTime)
}

const progressPercentage = computed(() => {
  return (props.currentTime / props.duration) * 100
})
</script>

<template>
  <section class="audio-progess-bar">
    <span class="audio-progress-bar__current_time">
      {{ humanizeTime(currentTime) }}
    </span>
    <span class="audio-progess-bar__container">
      <div @click="seek" class="audio-progess-bar__state">
        <div ref="seekerUi" class="audio-progess-bar__state--incomplete">
          <div
            :style="{ width: progressPercentage + '%' }"
            class="audio-progess-bar__state--complete"
          ></div>
        </div>
      </div>
    </span>
    <span class="audio-progress-bar__duration">
      {{ humanizeTime(duration) }}
    </span>
  </section>
</template>
<style scoped>
.audio-progess-bar {
  @apply flex items-center justify-center pb-4 md:w-full;
}

.audio-progress-bar__current_time,
.audio-progress-bar__duration {
  @apply flex shrink-0 items-center justify-center caption-disclaimer;
}

.audio-progess-bar__container {
  @apply w-full shrink px-3;
}

.audio-progess-bar__state {
  @apply flex h-4 cursor-pointer items-center;
}
.audio-progess-bar__state--incomplete {
  @apply relative h-1 w-full shrink rounded-full bg-white/20;
}

.audio-progess-bar__state--complete {
  @apply absolute top-0 bottom-0 h-1 w-full rounded-full bg-purple-500;
}
</style>
