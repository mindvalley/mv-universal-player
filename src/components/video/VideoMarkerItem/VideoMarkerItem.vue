<script setup lang="ts">
import type { Marker } from '../../../types/video'
import { ref, toRef, watch, type PropType } from 'vue-demi'
import { useGlobal } from '../../../composables/use-global'

const props = defineProps({
  marker: {
    required: true,
    type: Object as PropType<Marker>
  },
  currentMarker: {
    type: Object as PropType<Marker>
  }
})

const emit = defineEmits<{
  (e: 'select-marker', marker: Marker): void
  (e: any, payload: any): void
}>()

const handleMarkerSelection = () => {
  emit('select-marker', marker.value)
}

const isHighlighted = ref(false)

const marker = toRef(props, 'marker')
const currentMarker = toRef(props, 'currentMarker')
const { humanizeTime } = useGlobal()

watch(currentMarker, (newCurrentMarker) => {
  if (newCurrentMarker === undefined) return (isHighlighted.value = false)
  if (newCurrentMarker.id === marker.value.id) isHighlighted.value = true
  else isHighlighted.value = false
})
</script>

<template>
  <li
    @click="handleMarkerSelection"
    data-testid="base-video-marker-item"
    :class="{
      'bg-purple-600': isHighlighted,
      'hover:bg-cool-grey-600': !isHighlighted
    }"
    class="text-cool-grey-20 flex min-h-[72px] w-full cursor-pointer items-center py-4 pr-8"
  >
    <section class="w-14 shrink-0 text-center">
      <div v-show="isHighlighted">
        <svg class="mx-auto" v-svg symbol="play-filled" size="20"></svg>
      </div>
    </section>
    <section class="grow pr-2 text-sm">{{ marker.name }}</section>
    <section class="w-12 shrink-0 text-center text-sm">
      {{ humanizeTime(marker.time) }}
    </section>
  </li>
</template>
