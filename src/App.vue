<template>
  <AudioPlayer>
    <div class="">
      <AudioResource
        v-for="section in filteredSections"
        :key="section.media.id"
        asset-type="resource-meditation"
        :asset-id="section.media.id"
        :sources="formatSources(section.media.mediaAsset?.renditions)"
        :duration="section.media.mediaAsset.duration"
        :poster-url="section.media.coverAsset?.url || ''"
        :title="section.media.title || ''"
        :artist-id="section.media.author.id"
        :artist-name="section.media.author.name"
        :ratings="section.media.averageRating"
        :total-ratings="section.media.ratingsCount"
        class="my-10 mx-auto"
      >
        <template #audio-description v-if="section.media">
          <AudioDescription
            :image-src="section.media.author.portraitAsset?.url"
            :name="section.media.author.name"
            :headline="section.media.author.headline"
            :description="section.media.description"
            show-more-text="Show More"
          />
        </template>

        <template #meditation-mixer>
          <div class="relative w-full col-span-3 md:col-span-2">
            <MeditationMixer>
              <div class="text-cool-grey-350 mb-2 text-xs">Mix Track</div>

              <div class="flex gap-x-2">
                <Carousel
                  data-testid="carousel"
                  :items-to-show="7"
                  :items-to-scroll="1"
                  :settings="settings"
                  :breakpoints="breakpoints"
                >
                  <Slide key="no-bg-sound">
                    <MeditationTrackItem
                      :volume="0"
                      @click="isVolumeSliderDisabled = true"
                    ></MeditationTrackItem>
                  </Slide>
                  <Slide
                    data-testid="slide"
                    v-for="(sound, index) in backgroundSounds"
                    :key="index"
                  >
                    <MeditationTrackItem
                      :volume="volume"
                      @click="isVolumeSliderDisabled = false"
                      :key="index"
                      :sources="formatSources(sound?.item?.mediaAsset.renditions)"
                      :background-src="sound?.item?.coverAsset?.thumbnailUrl"
                    />
                  </Slide>
                  <template #addons>
                    <Navigation data-testid="navigation" />
                  </template>
                </Carousel>
              </div>
              <div
                class="flex w-full mt-4 items-center justify-center transition duration-300 ease-in"
              >
                <span
                  class="text-cool-grey-250 mr-4 text-xs"
                  :class="{ 'brightness-50': isVolumeSliderDisabled }"
                  >sound</span
                >
                <MeditationVolumeSlider
                  :volume="volume"
                  :disabled="isVolumeSliderDisabled"
                  @change="(e) => (volume = e)"
                />
                <span
                  class="text-cool-grey-250 ml-4 text-xs"
                  :class="{ 'brightness-50': isVolumeSliderDisabled }"
                  >vocal</span
                >
              </div>
            </MeditationMixer>
          </div>
        </template>
      </AudioResource>
    </div>
  </AudioPlayer>
</template>

<script setup lang="ts">
import AudioDescription from './components/audio/AudioDescription/AudioDescription.vue'
import AudioPlayer from './components/audio/AudioPlayer/AudioPlayer.vue'
import AudioResource from './components/audio/AudioResource/AudioResource.vue'
import MeditationMixer from './components/audio/Meditation/MeditationMixer/MeditationMixer.vue'
import { page } from './examples/page'
import { backgroundSounds } from './examples/background-sounds'
import type { Source } from './types/audio'
import MeditationTrackItem from './components/audio/Meditation/MeditationTrackItem/MeditationTrackItem.vue'
import MeditationVolumeSlider from './components/audio/Meditation/MeditationVolumeSlider/MeditationVolumeSlider.vue'
import { ref } from 'vue-demi'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const isVolumeSliderDisabled = ref(true)
const volume = ref(0.5)

const { sections } = page
const filteredSections = sections.filter((section: any) => section.id === '219')

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

const settings = {
  // Mobile (Default)
  itemsToShow: 4,
  snapAlign: 'start'
}
// breakpoints are mobile first
// any settings not specified will fallback to the carousel settings
const breakpoints = {
  //   540 and up
  540: {
    itemsToShow: 6,
    snapAlign: 'start'
  },
  //   640px (sm) and up
  640: {
    itemsToShow: 8,
    snapAlign: 'start'
  },
  // 1024 (lg) and up
  1024: {
    itemsToShow: 7,
    snapAlign: 'start'
  }
}
</script>

<style>
.carousel__prev,
.carousel__next {
  color: white !important;
}

.carousel__prev {
  left: -30px;
}

.carousel__next {
  right: -30px;
}

.carousel__prev--disabled,
.carousel__next--disabled {
  cursor: not-allowed;
  opacity: 0.2;
}
</style>
