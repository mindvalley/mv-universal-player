<script setup lang="ts">
import {
  MVAudioItem,
  MVAudioPlayButton,
  MVAudioRewindButton,
  MVAudioFastForwardButton,
  MVAudioProgressBar
} from '../..'

import type { Source } from './../../../types/audio'
import { useDetectBrowser } from './../../../composables/use-detect-browser'
import BaseImage from '../../global/BaseImage.vue'

const props = defineProps({
  assetType: {
    type: String,
    default: ''
  },
  assetId: {
    required: true,
    type: String
  },
  assetName: {
    type: String,
    default: ''
  },
  sources: {
    required: true,
    type: Array<Source>
  },
  title: {
    required: true,
    type: String
  },
  artistId: {
    type: String,
    default: ''
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
  }
})

const { isiPhoneOriPadSafari } = useDetectBrowser()
const emit = defineEmits({})

const emitEvent = (eventName: string, payload?: any) => {
  const data = { assetId: props.assetId, ...payload }
  console.log(eventName, data)
  emit(eventName, data)
}
</script>

<template>
  <section
    class="inset-0 z-15 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
    :style="`background-image: url(${posterUrl});`"
  >
    <!-- Overlay -->
    <section class="absolute inset-0 rounded-xl bg-black/60"></section>

    <!-- Blur effect -->
    <section
      class="absolute inset-0 rounded-xl backdrop-blur-3xl"
      :class="{ 'mix-blend-lighten': isiPhoneOriPadSafari }"
    ></section>

    <MVAudioItem
      v-slot="{ player, state }"
      :sources="sources"
      :id="assetId"
      @play="emitEvent('play')"
      @pause="emitEvent('pause')"
      @seeking="emitEvent('seeking', $event)"
      @ended="emitEvent('ended', $event)"
      @rewind="emitEvent('rewind', $event)"
      @fastforward="emitEvent('fastforward', $event)"
      @playbackSpeed="emitEvent('playbackSpeed', $event)"
    >
      <div class="grid grid-cols-3 gap-4 lg:gap-x-6 text-white relative lg:gap-y-0">
        <div
          class="max-md:col-span-3"
          :class="assetType == 'resource-meditation' ? 'lg:row-span-2' : 'row-span-1'"
        >
          <div @click="player.setPlaybackRate(0.5)">change speed</div>
          <div class="flex items-center w-full">
            <section class="w-full min-w-[80px] max-md:max-w-[150px] md:max-w-[380px]">
              <BaseImage
                aspect-ratio="square"
                :src="posterUrl || ''"
                class="rounded-xl md:rounded-3xl"
                img-class="rounded-xl md:rounded-3xl"
                :width="350"
              ></BaseImage>
            </section>

            <section class="hidden px-6 max-md:block">
              <h2 class="title-bold-9 text-white">
                {{ title }}
              </h2>
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
          </div>
        </div>
        <div class="col-span-3 md:col-span-2 flex">
          <!-- Controls -->
          <div
            class="w-full shrink grow text-cool-grey-250 md:flex md:flex-col md:items-center md:justify-center"
          >
            <!-- Medium-screen above meta -->
            <section class="w-full py-4 hidden md:block">
              <h2 class="title-bold-8 text-white">{{ title }}</h2>
              <span class="text-cool-grey-200">{{ artistName }}</span>
              <div
                v-if="ratings && totalRatings"
                class="justify-content mt-1 flex items-center text-left text-xs text-cool-grey-300"
              >
                <svg v-svg symbol="star-filled" size="16" class="mr-1" color="#E8AD11"></svg>
                <span> {{ ratings.toFixed(2) }} ({{ totalRatings }}) </span>
              </div>
            </section>
            <MVAudioProgressBar
              :duration="props.duration"
              class="text-white"
              :current-time="state?.currentTime"
              @seek="player.seek"
            />

            <!-- Buttons -->
            <section class="flex items-center justify-center">
              <MVAudioRewindButton @rewind="(e: number) => player.rewind(e)" />
              <MVAudioPlayButton
                @play="player.play"
                @pause="player.pause"
                :playing="state?.playing"
              />
              <MVAudioFastForwardButton @fast-forward="(e: number) => player.fastForward(e)" />
            </section>
          </div>
        </div>

        <slot name="meditation-mixer"></slot>
      </div>
    </MVAudioItem>

    <slot name="audio-description"></slot>
  </section>
</template>
