<script setup lang="ts">
import type { Source } from './../../../types/audio'
import { useDetectBrowser } from './../../../composables/use-detect-browser'
import MVAudioItem from '../AudioItem'
import MVAudioPlayButton from '../AudioPlayButton'
import MVAudioFastForwardButton from '../AudioFastForwardButton'
import MVAudioRewindButton from '../AudioRewindButton'
import MVAudioProgressBar from '../AudioProgressBar'
import { useSlots, computed, ref } from 'vue-demi'

const props = defineProps({
  assetId: {
    required: true,
    type: String
  },
  sources: {
    required: true,
    type: Array<Source>
  },
  title: {
    required: true,
    type: String
  },
  artistName: {
    type: String,
    default: ''
  },
  duration: {
    required: true,
    type: Number
  },
  posterUrl: {
    type: String
  },
  ratings: {
    type: Number
  },
  totalRatings: {
    type: Number
  },
  overlay: {
    type: Boolean
  },
  blurEffect: {
    type: Boolean
  },
  showFavourite: {
    type: Boolean
  },
  isFavourite: {
    type: Boolean
  }
})

const slots = useSlots()

const isMeditationMixerAvailable = computed(() => {
  return slots && !!slots['meditation-mixer']
})

const { isiPhoneOriPadSafari } = useDetectBrowser()
const emit = defineEmits<{
  (e: 'timeupdate', { currentTime }: any): void
  (e: 'play', { currentTime }: any): void
  (e: 'pause', { currentTime }: any): void
  (e: 'seeking', { seeking }: any): void
  (e: 'ended', { currentTime }: any): void
  (e: 'rewind', { previousTime, currentTime }: any): void
  (e: 'fastforward', { previousTime, currentTime }: any): void
  (e: 'reset', { currentTime }: any): void
  (e: any, payload: any): void
}>()

const emitEvent = (eventName: string, payload?: any) => {
  const data = { assetId: props.assetId, ...payload }
  emit(eventName, data)
}

const isFavourite = ref(props.isFavourite)

const handleFavourite = () => {
  isFavourite.value = !isFavourite.value
  emitEvent('favourite', { isFavourite: isFavourite.value })
}
</script>

<template>
  <section>
    <!-- Overlay -->
    <section v-if="overlay" class="absolute inset-0 rounded-xl bg-black/60"></section>

    <!-- Blur effect -->
    <section
      v-if="blurEffect"
      class="absolute inset-0 rounded-xl backdrop-blur-3xl"
      :class="{ 'mix-blend-lighten': isiPhoneOriPadSafari }"
    ></section>

    <MVAudioItem
      v-slot="{ state, seek, play, pause, rewind, fastForward }"
      :sources="sources"
      :id="assetId"
      @play="emitEvent('play', $event)"
      @pause="emitEvent('pause', $event)"
      @seeking="emitEvent('seeking', $event)"
      @ended="emitEvent('ended', $event)"
      @rewind="emitEvent('rewind', $event)"
      @fastforward="emitEvent('fastforward', $event)"
      @playbackSpeed="emitEvent('playbackSpeed', $event)"
      @timeupdate="emitEvent('timeupdate', $event)"
      @reset="emitEvent('reset', $event)"
    >
      <div class="grid grid-cols-3 text-white relative gap-8">
        <!-- Image -->
        <section class="w-full col-span-1 row-span-3">
          <img :src="posterUrl || ''" class="rounded-xl md:rounded-3xl" :width="350" />
        </section>

        <!-- Title -->
        <section class="w-full col-span-2">
          <div class="w-full flex justify-between">
            <h2 class="title-bold-9 md:title-bold-8 text-white">
              {{ title }}
            </h2>
            <span v-if="showFavourite" class="hover:cursor-pointer" @click="handleFavourite"
              ><svg v-show="!isFavourite" v-svg symbol="heart-outline" size="26"></svg>
              <svg v-show="isFavourite" v-svg symbol="heart-filled" size="26" color="#A3313E"></svg>
            </span>
          </div>

          <p v-if="artistName" class="text-sm text-cool-grey-250">
            {{ artistName }}
          </p>
          <div
            v-if="ratings && totalRatings"
            class="justify-content mt-1 flex items-center text-left text-xs text-cool-grey-300"
          >
            <svg v-svg symbol="star-filled" size="16" class="mr-1" color="#E8AD11"></svg>
            <span> {{ ratings.toFixed(2) }} ({{ totalRatings }}) </span>
          </div>
        </section>
        <!-- </section> -->

        <!-- Controls -->
        <section
          class="flex-col h-full col-span-3 sm:col-span-2"
          :class="[isMeditationMixerAvailable ? 'sm:row-span-2 lg:row-span-1' : 'row-span-2']"
        >
          <MVAudioProgressBar
            :duration="props.duration"
            class="text-white"
            :current-time="state?.currentTime"
            @seek="seek"
          />

          <section class="flex items-center justify-center">
            <MVAudioRewindButton @rewind="rewind($event)" />
            <MVAudioPlayButton @play="play" @pause="pause" :playing="state?.playing" />
            <MVAudioFastForwardButton @fastForward="fastForward($event)" />
          </section>
        </section>

        <!-- Meditation -->
        <div v-if="isMeditationMixerAvailable" class="relative w-full col-span-3 lg:col-span-2">
          <slot name="meditation-mixer"></slot>
        </div>
      </div>
    </MVAudioItem>

    <slot name="audio-description"></slot>
  </section>
</template>
