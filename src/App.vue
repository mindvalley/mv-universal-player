<template>
  <MVAudioPlayer>
    <div class="">
      <MVAudioResource
        :key="audio.id"
        asset-id="audio.id"
        :sources="audio.sources"
        :duration="audio.duration"
        :poster-url="audio.posterUrl"
        :title="audio.title"
        :artist-name="audio.artistName"
        :ratings="audio.ratings"
        :total-ratings="audio.totalRatings"
        class="my-10 mx-auto inset-0 z-15 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
        :style="`background-image: url(${audio.posterUrl});`"
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
        <template #audio-description>
          <MVAudioDescription
            :image-src="audio.authorImage"
            :name="audio.artistName"
            :headline="audio.headline"
            :description="audio.description"
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
                  <MVMeditationTrackItem :sources="sound.sources" :background-src="sound.image" />
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
import type { Source } from './types/audio'
import { MVAudioPlayer } from '.'
import MVAudioResource from './components/audio/AudioResource/'
import MVAudioDescription from './components/audio/AudioDescription'

import { MVCarousel, MVCarouselSlide } from './components/carousel'
import { MVMeditationTrackItem, MVMeditationVolumeSlider, MVMeditationMixer } from '.'

const logEvent = (event: string, data: any) => {
  console.log(event, data)
}

const sources = [
  { type: 'audio/mpeg', src: getSoundUrl('removing_inner_blocks_success_audio.mp3.mp3') }
]

const backgroundSounds = [
  {
    image: getImageUrl('bg_sound_image_1.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_1.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_2.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_2.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_3.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_3.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_4.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_4.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_5.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_5.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_6.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_6.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_7.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_7.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_8.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_8.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_9.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_9.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_10.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_10.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_11.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_11.wav.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_12.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_12.mp3.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_13.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_13.mp3.mp3') }]
  },
  {
    image: getImageUrl('bg_sound_image_14.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_14.wav.mp3') }]
  }
]

const audio = {
  id: 1,
  sources: sources,
  duration: 1932.669,
  posterUrl: getImageUrl('removing_inner_blocks_success.jpeg'),
  title: 'Removing Inner Block to Success',
  artistName: 'Marisa Peer',
  ratings: 5,
  totalRatings: 4,
  authorImage: getImageUrl('rtt_marisa_author.jpeg'),
  headline: 'Creator Of Rapid Transformational Therapy®',
  description:
    'An internationally award-winning qualified hypnotherapist with advanced certificates in hypnotherapy from the Hypnotism Training Institute of Los Angeles. Marisa has completed additional studies in hypno-healing, advanced hypnotherapy, medical hypnotherapy and Gestalt Analysis.\r\n\r\nHaving undertaken further studies at the Proudfoot School of Hypnotherapy and Psychotherapy and the Atkinson Ball College of Hypnotherapy, Marisa has dedicated the last three decades to researching, testing and applying the most beneficial principles of Hypnotherapy, Psychotherapy, NLP, CBT and Neuroscience. \r\n\r\nThe result of over 30 years of careful and rigorous study, Marisa’s unique, Rapid Transformational Therapy®️ (RTT®️), has helped tens of thousands of people worldwide to overcome their own, personal challenges and lead happier, more fulfilling lives. '
}

function getImageUrl(name: string) {
  return new URL(`./assets/images/${name}`, import.meta.url).href
}

function getSoundUrl(name: string) {
  return new URL(`./assets/sounds/${name}`, import.meta.url).href
}
</script>

<style></style>
