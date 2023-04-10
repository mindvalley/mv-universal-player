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

    <AudioItem
      v-slot="{ play, pause, playing, rewind, fastForward, currentTime, seek }"
      :sources="sources"
    >
      <div class="grid grid-cols-3 gap-4 lg:gap-x-6 text-white relative lg:gap-y-0">
        <div
          class="max-md:col-span-3"
          :class="assetType == 'resource-meditation' ? 'lg:row-span-2' : 'row-span-1'"
        >
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
            class="w-full shrink grow text-cool-grey-250 md:flex md:max-w-[620px] md:flex-col md:items-center md:justify-center"
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
            <AudioProgressBar
              :duration="props.duration"
              class="text-white"
              :current-time="currentTime"
              @seek="seek"
            />

            <!-- Buttons -->
            <section class="flex items-center justify-center">
              <AudioRewindButton @rewind="(e) => rewind(e)" />
              <AudioPlayButton @play="play" @pause="pause" :playing="playing" />
              <AudioFastForwardButton @fast-forward="(e) => fastForward(e)" />
            </section>
          </div>
        </div>

        <slot name="meditation-mixer"></slot>
      </div>
    </AudioItem>

    <slot name="audio-description"></slot>
  </section>
</template>

<script setup lang="ts">
import AudioItem from '../AudioItem/AudioItem.vue'
import AudioPlayButton from '../AudioPlayButton/AudioPlayButton.vue'
import AudioRewindButton from '../AudioRewindButton/AudioRewindButton.vue'
import AudioFastForwardButton from '../AudioFastForwardButton/AudioFastForwardButton.vue'
import AudioProgressBar from '../AudioProgressBar/AudioProgressBar.vue'
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
console.log(props)
</script>
