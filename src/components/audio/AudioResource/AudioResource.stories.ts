import type { Meta, StoryObj } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import { MVAudioResource } from '.'
import { MVAudioPlayer } from './../AudioPlayer'
import { MVAudioDescription } from './../AudioDescription'
import { MVMeditationMixer, MVMeditationTrackItem, MVMeditationVolumeSlider } from './../Meditation'
import { MVCarousel, MVCarouselSlide } from './../../carousel'

const backgroundSounds = [
  {
    id: '1',
    image: getImageUrl('bg_sound_image_1.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_1.wav.mp3') }]
  },
  {
    id: '2',
    image: getImageUrl('bg_sound_image_2.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_2.wav.mp3') }]
  },
  {
    id: '3',
    image: getImageUrl('bg_sound_image_3.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_3.wav.mp3') }]
  },
  {
    id: '4',
    image: getImageUrl('bg_sound_image_4.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_4.wav.mp3') }]
  },
  {
    id: '5',
    image: getImageUrl('bg_sound_image_5.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_5.wav.mp3') }]
  },
  {
    id: '6',
    image: getImageUrl('bg_sound_image_6.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_6.wav.mp3') }]
  },
  {
    id: '7',
    image: getImageUrl('bg_sound_image_7.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_7.wav.mp3') }]
  },
  {
    id: '8',
    image: getImageUrl('bg_sound_image_8.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_8.wav.mp3') }]
  },
  {
    id: '9',
    image: getImageUrl('bg_sound_image_9.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_9.wav.mp3') }]
  },
  {
    id: '10',
    image: getImageUrl('bg_sound_image_10.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_10.wav.mp3') }]
  },
  {
    id: '11',
    image: getImageUrl('bg_sound_image_11.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_11.wav.mp3') }]
  },
  {
    id: '12',
    image: getImageUrl('bg_sound_image_12.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_12.mp3.mp3') }]
  },
  {
    id: '13',
    image: getImageUrl('bg_sound_image_13.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_13.mp3.mp3') }]
  },
  {
    id: '14',
    image: getImageUrl('bg_sound_image_14.png'),
    sources: [{ type: '', src: getSoundUrl('bg_sound_14.wav.mp3') }]
  }
]

const audio1 = {
  assetId: '1',
  sources: [
    { type: 'audio/mpeg', src: getSoundUrl('removing_inner_blocks_success_audio.mp3.mp3') }
  ],
  isFavourite: false,
  duration: 1932.669,
  posterUrl: getImageUrl('removing_inner_blocks_success.jpeg'),
  title: 'Removing Inner Block to Success',
  artistName: 'Marisa Peer',
  ratings: 4,
  totalRatings: 5,
  authorImage: getImageUrl('rtt_marisa_author.jpeg'),
  headline: 'Creator Of Rapid Transformational Therapy®',
  description:
    'An internationally award-winning qualified hypnotherapist with advanced certificates in hypnotherapy from the Hypnotism Training Institute of Los Angeles. Marisa has completed additional studies in hypno-healing, advanced hypnotherapy, medical hypnotherapy and Gestalt Analysis.\r\n\r\nHaving undertaken further studies at the Proudfoot School of Hypnotherapy and Psychotherapy and the Atkinson Ball College of Hypnotherapy, Marisa has dedicated the last three decades to researching, testing and applying the most beneficial principles of Hypnotherapy, Psychotherapy, NLP, CBT and Neuroscience. \r\n\r\nThe result of over 30 years of careful and rigorous study, Marisa’s unique, Rapid Transformational Therapy®️ (RTT®️), has helped tens of thousands of people worldwide to overcome their own, personal challenges and lead happier, more fulfilling lives. ',
  backgroundSounds: backgroundSounds
}

const audio2 = {
  assetId: '2',
  sources: [{ type: 'audio/mpeg', src: getSoundUrl('free_yourself_from_depression.m4a.mp3.mp3') }],
  isFavourite: false,
  duration: 1831.24,
  posterUrl: getImageUrl('free_youself_from_depression.jpeg'),
  title: 'Free Yourself from Depression and Anxiety',
  artistName: 'Marisa Peer',
  ratings: 4,
  totalRatings: 5,
  authorImage: getImageUrl('rtt_marisa_author.jpeg'),
  headline: 'Creator Of Rapid Transformational Therapy®',
  description:
    "Celebrity therapist Marisa Peer's proven techniques will free you from a life of negative patterns and thinking. This hypnosis session softly guides us into a state of deep introspection, where we boost our self-esteem and free ourselves from negative thoughts and patterns by programming healthier habits around eating, exercise, hobbies, thinking, self-love and self-esteem, and relating to others.",
  backgroundSounds: backgroundSounds
}

const audios = [audio1, audio2]

function getImageUrl(name: string) {
  return `/assets/images/${name}`
}

function getSoundUrl(name: string) {
  return `/assets/sounds/${name}`
}

const meta: Meta<typeof MVAudioResource> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'MVAudioResource',
  component: MVAudioResource
}

export default meta
type Story = StoryObj<typeof MVAudioResource>

export const Default: Story = {
  render: (args: any, { argTypes }) => ({
    components: { MVAudioPlayer, MVAudioResource },
    methods: { logEvent: action('') },
    props: Object.keys(argTypes),
    template: `<div class="mv-universal-player"><MVAudioPlayer><MVAudioResource  v-bind="$props" class="my-10 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"   :style="{
      'background-image': 'url(' + posterUrl + ')'
    }"
    @play="logEvent('play', $event)"
    @pause="logEvent('pause', $event)"
    @seeking="logEvent('seeking', $event)"
    @ended="logEvent('ended', $event)"
    @rewind="logEvent('rewind', $event)"
    @fastforward="logEvent('fastforward', $event)"
    @playbackSpeed="logEvent('playbackSpeed', $event)"
    @favourite="logEvent('favourite', $event)"
    @timeupdate="logEvent('timeupdate', $event)"
    ></MVAudioResource></MVAudioPlayer></div>`
  }),
  args: {
    assetId: audio1.assetId,
    sources: audio1.sources,
    duration: audio1.duration,
    posterUrl: audio1.posterUrl,
    title: audio1.title,
    artistName: audio1.artistName,
    ratings: audio1.ratings,
    totalRatings: audio1.totalRatings,
    isFavourite: audio1.isFavourite,
    blurEffect: true,
    overlay: true,
    showFavourite: true
  }
}

export const WithDescription: Story = {
  render: (args: any, { argTypes }) => ({
    components: { MVAudioPlayer, MVAudioResource, MVAudioDescription },
    methods: { logEvent: action('') },
    props: Object.keys(argTypes),
    template: `
    <div class="mv-universal-player">
    <MVAudioPlayer>
        <MVAudioResource  v-bind="$props" 
        class="my-10 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
        :style="{
          'background-image': 'url(' + posterUrl + ')'
        }"
        @play="logEvent('play', $event)"
        @pause="logEvent('pause', $event)"
        @seeking="logEvent('seeking', $event)"
        @ended="logEvent('ended', $event)"
        @rewind="logEvent('rewind', $event)"
        @fastforward="logEvent('fastforward', $event)"
        @playbackSpeed="logEvent('playbackSpeed', $event)"
        @favourite="logEvent('favourite', $event)"
        @timeupdate="logEvent('timeupdate', $event)"
        >

        <template #audio-description>
        <MVAudioDescription
        :image-src="authorImage"
        :name="artistName"
        :headline="headline"
        :description="description"
        show-more-text="Show More"
        show-less-text="Show Less"
        class="pt-8"
        />
      </template>

        </MVAudioResource>
    </MVAudioPlayer>
    </div>
    `
  }),
  args: {
    ...Default.args,
    authorImage: audio1.authorImage,
    name: audio1.artistName,
    headline: audio1.headline,
    description: audio1.description
  }
}

export const WithMeditationMixer: Story = {
  render: (args: any, { argTypes }) => ({
    components: {
      MVAudioPlayer,
      MVAudioResource,
      MVAudioDescription,
      MVMeditationMixer,
      MVMeditationTrackItem,
      MVMeditationVolumeSlider,
      MVCarousel,
      MVCarouselSlide
    },
    methods: { logEvent: action('') },
    props: Object.keys(argTypes),
    template: `
    <div class="mv-universal-player">
      <MVAudioPlayer>
          <MVAudioResource  v-bind="$props" 
          class="my-10 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
          :style="{
            'background-image': 'url(' + posterUrl + ')'
          }"
          @play="logEvent('play', $event)"
          @pause="logEvent('pause', $event)"
          @seeking="logEvent('seeking', $event)"
          @ended="logEvent('ended', $event)"
          @rewind="logEvent('rewind', $event)"
          @fastforward="logEvent('fastforward', $event)"
          @playbackSpeed="logEvent('playbackSpeed', $event)"
          @favourite="logEvent('favourite', $event)"
          @timeupdate="logEvent('timeupdate', $event)"
          >
  
          <template #audio-description>
          <MVAudioDescription
            :image-src="authorImage"
            :name="artistName"
            :headline="headline"
            :description="description"
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
                <MVMeditationTrackItem :sources="sound.sources" :background-src="sound.image"
                :id="sound.id"
                @play="logEvent('play', $event)"
                @pause="logEvent('pause', $event)"
                @timeupdate="logEvent('timeupdate', $event)"
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
      </MVAudioPlayer>
      </div>
      `
  }),
  args: {
    ...Default.args,
    ...WithDescription.args,
    backgroundSounds: audio1.backgroundSounds
  }
}

export const MultipleAudios: Story = {
  render: (args, { argTypes }) => ({
    components: {
      MVAudioPlayer,
      MVAudioResource,
      MVAudioDescription,
      MVMeditationMixer,
      MVMeditationTrackItem,
      MVMeditationVolumeSlider,
      MVCarousel,
      MVCarouselSlide
    },
    props: Object.keys(argTypes),
    methods: { logEvent: action('') },
    template: `
    <div class="mv-universal-player">
      <MVAudioPlayer>
          <MVAudioResource v-for="(audio, index) in audios"  v-bind="audio"
          class="my-10 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
          :style="{
            'background-image': 'url(' + audio.posterUrl + ')'
          }"
          :key="index"   
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
          @timeupdate="logEvent('timeupdate', $event)"
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
              <MVCarouselSlide v-for="(sound, index) in audio.backgroundSounds" :key="index + 1">
                <MVMeditationTrackItem :sources="sound.sources" :background-src="sound.image" 
                :id="sound.id"
                @play="logEvent('play', $event)"
                @pause="logEvent('pause', $event)"
                @timeupdate="logEvent('timeupdate', $event)"
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
      </MVAudioPlayer>
      </div>
      `
  }),
  args: {
    audios: audios
  }
}
