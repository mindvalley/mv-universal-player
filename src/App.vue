<template>
  <MVAudioPlayer>
    <div class="">
      <MVAudioResource
        v-for="section in filteredSections"
        :key="section?.media?.id"
        :asset-id="section?.media?.id"
        :sources="formatSources(section?.media?.mediaAsset?.renditions)"
        :duration="section?.media?.mediaAsset.duration"
        :poster-url="section?.media?.coverAsset?.url"
        :title="section?.media?.title"
        :artist-id="section?.media?.author.id"
        :artist-name="section?.media?.author.name"
        :ratings="section?.media?.averageRating"
        :total-ratings="section?.media?.ratingsCount"
        class="my-10 mx-auto inset-0 z-15 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
        :style="`background-image: url(${section?.media?.coverAsset?.url});`"
        blurEffect
        overlay
        showFavourite
        @play="logEvent('play', $event)"
        @pause="logEvent('pause', $event)"
        @seeking="logEvent('seeking', $event)"
        @ended="logEvent('ended', $event)"
        @rewind="logEvent('rewind', $event)"
        @fastforward="logEvent('fastforward', $event)"
        @playbackSpeed="logEvent('playbackSpeed', $event)"
        @favourite="logEvent('favourite', $event)"
      >
        <template #audio-description v-if="section.media">
          <MVAudioDescription
            :image-src="section?.media?.author?.portraitAsset?.url"
            :name="section?.media?.author?.name"
            :headline="section?.media?.author?.headline"
            :description="section?.media?.description"
            show-more-text="Show More"
            show-less-text="Show Less"
            class="pt-8"
          />
        </template>

        <template #meditation-mixer>
          <MVMeditationMixer>
            <div class="text-cool-grey-350 mb-2 text-xs">Mix Track</div>
            <div class="gap-x-2 px-6">
              <MVCarousel tagName="Slide">
                <MVCarouselSlide :key="0">
                  <MVMeditationTrackItem :volume="0"></MVMeditationTrackItem>
                </MVCarouselSlide>
                <MVCarouselSlide v-for="(sound, index) in backgroundSounds" :key="index + 1">
                  <MVMeditationTrackItem
                    :sources="formatSources(sound?.item?.mediaAsset.renditions)"
                    :background-src="sound?.item?.coverAsset?.thumbnailUrl"
                  />
                </MVCarouselSlide>
              </MVCarousel>
            </div>
            <div
              class="flex w-full mt-4 items-center justify-center transition duration-300 ease-in"
            >
              <MVMeditationVolumeSlider leftText="sound" rightText="vocal" />
            </div>
          </MVMeditationMixer>
        </template>
      </MVAudioResource>
    </div>
  </MVAudioPlayer>
</template>

<script setup lang="ts">
import { page } from './examples/page'
import { backgroundSounds } from './examples/background-sounds'
import type { Source } from './types/audio'
import { MVAudioPlayer } from '.'
import MVAudioResource from './components/audio/AudioResource/'
import MVAudioDescription from './components/audio/AudioDescription'

import { MVCarousel, MVCarouselSlide } from './components/carousel'
import { MVMeditationTrackItem, MVMeditationVolumeSlider, MVMeditationMixer } from '.'

const logEvent = (event: string, data: any) => {
  console.log(event, data)
}

const { sections } = page
const filteredSections = sections.filter(
  (section: any) => section.id === '219' || section.id === '285'
)

const formatSources = (localSources: Array<any> = []) => {
  const audioSources = localSources?.filter(
    (source) => source.id === 'mp3' || source.id === 'ogg' || source.id === 'hls'
  )
  const updatedSources: Source[] = []

  for (const i in audioSources) {
    updatedSources.push({
      type: localSources[i]?.contentType,
      src: localSources[i]?.url
    })
  }

  return updatedSources
}
</script>

<style></style>
