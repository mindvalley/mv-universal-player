<script setup lang="ts">
import { computed, ref } from 'vue-demi'
import MVAdaptiveDurationTimerUnitPicker from '../AdaptiveDurationTimerUnitPicker'

const props = defineProps({
  duration: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:duration'])

const hours = ref(Math.floor(props.duration / 3600))
const minutes = ref(Math.floor((props.duration % 3600) / 60))

function updateDuration() {
  emit('update:duration', hours.value * 3600 + minutes.value * 60)
}

const hourLabel = computed(() => (hours.value === 1 || hours.value === 0 ? 'hour' : 'hours'))
const minuteLabel = computed(() => (minutes.value === 1 || minutes.value === 0 ? 'min' : 'mins'))

function incrementHours() {
  hours.value = (hours.value + 1) % 24
  updateDuration()
}

function decrementHours() {
  hours.value = (hours.value - 1 + 24) % 24
  updateDuration()
}

function incrementMinutes() {
  minutes.value = (minutes.value + 1) % 60
  updateDuration()
}

function decrementMinutes() {
  minutes.value = (minutes.value - 1 + 60) % 60
  updateDuration()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-center mb-3">
      <svg v-svg symbol="infinity-filled" class="h-6 w-6 text-white-70a"></svg>
    </div>
    <div class="flex text-white items-center justify-center gap-x-2">
      <div class="">
        <MVAdaptiveDurationTimerUnitPicker
          :selectedUnit="hours"
          :label="hourLabel"
          @increment="incrementHours"
          @decrement="decrementHours"
        />
      </div>
      <div class="text-xl">:</div>
      <div class="">
        <MVAdaptiveDurationTimerUnitPicker
          :selectedUnit="minutes"
          :label="minuteLabel"
          @increment="incrementMinutes"
          @decrement="decrementMinutes"
        />
      </div>
    </div>
  </div>
</template>
