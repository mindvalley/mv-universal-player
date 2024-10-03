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
  if (hours.value === 0 && minutes.value === 0) {
    minutes.value = 1
  }
  hours.value = (hours.value + 1) % 24
  updateDuration()
}

function decrementHours() {
  if (hours.value === 1 && minutes.value === 0) {
    minutes.value = 1
  }
  hours.value = (hours.value - 1 + 24) % 24
  updateDuration()
}

function incrementMinutes() {
  if (hours.value === 0 && minutes.value === 59) {
    hours.value = 1
    minutes.value = 0
  } else {
    minutes.value = (minutes.value + 1) % 60
  }
  updateDuration()
}

function decrementMinutes() {
  if (hours.value === 0 && minutes.value === 1) {
    hours.value = 23
    minutes.value = 59
  } else {
    minutes.value = (minutes.value - 1 + 60) % 60
  }
  updateDuration()
}
</script>

<template>
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
</template>
