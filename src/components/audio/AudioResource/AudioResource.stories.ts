import type { Meta, StoryObj } from '@storybook/vue'

import { MVAudioResource } from '.'
import { MVAudioPlayer } from './../AudioPlayer'
import { MVAudioDescription } from './../AudioDescription'
import { MVMeditationMixer, MVMeditationTrackItem, MVMeditationVolumeSlider } from './../Meditation'
import { MVCarousel, MVCarouselSlide } from './../../carousel'

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
  ratings: 4,
  totalRatings: 5,
  authorImage: getImageUrl('rtt_marisa_author.jpeg'),
  headline: 'Creator Of Rapid Transformational Therapy®',
  description:
    'An internationally award-winning qualified hypnotherapist with advanced certificates in hypnotherapy from the Hypnotism Training Institute of Los Angeles. Marisa has completed additional studies in hypno-healing, advanced hypnotherapy, medical hypnotherapy and Gestalt Analysis.\r\n\r\nHaving undertaken further studies at the Proudfoot School of Hypnotherapy and Psychotherapy and the Atkinson Ball College of Hypnotherapy, Marisa has dedicated the last three decades to researching, testing and applying the most beneficial principles of Hypnotherapy, Psychotherapy, NLP, CBT and Neuroscience. \r\n\r\nThe result of over 30 years of careful and rigorous study, Marisa’s unique, Rapid Transformational Therapy®️ (RTT®️), has helped tens of thousands of people worldwide to overcome their own, personal challenges and lead happier, more fulfilling lives. ',
  backgroundSounds: backgroundSounds
}

function getImageUrl(name: string) {
  return `src/assets/images/${name}`
}

function getSoundUrl(name: string) {
  return `src/assets/sounds/${name}`
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
  render: (args, { argTypes }) => ({
    components: { MVAudioPlayer, MVAudioResource },
    props: Object.keys(argTypes),
    template: `<MVAudioPlayer><MVAudioResource  v-bind="$props" class="my-10 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center" style="background-image: url(${args.posterUrl});"></MVAudioResource></MVAudioPlayer>`
  }),
  args: {
    assetId: `${audio.id}`,
    sources: audio.sources,
    duration: audio.duration,
    posterUrl: audio.posterUrl,
    title: audio.title,
    artistName: audio.artistName,
    ratings: audio.ratings,
    totalRatings: audio.totalRatings,
    blurEffect: true,
    overlay: true,
    showFavourite: true
  }
}

export const AudioResourceWithDescription: Story = {
  render: (args, { argTypes }) => ({
    title: 'dddd',
    components: { MVAudioPlayer, MVAudioResource, MVAudioDescription },
    props: Object.keys(argTypes),
    template: `
    <MVAudioPlayer>
        <MVAudioResource  v-bind="$props" 
        class="my-10 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
        style="background-image: url(${args.posterUrl});">

        <template #audio-description>
        <MVAudioDescription
          image-src="${args.authorImage}"
          name="${args.artistName}"
          headline="${args.headline}"
          description="${args.description}"
          show-more-text="Show More"
          show-less-text="Show Less"
          class="pt-8"
        />
      </template>

        </MVAudioResource>
    </MVAudioPlayer>`
  }),
  args: {
    ...Default.args,
    authorImage: audio.authorImage,
    name: audio.artistName,
    headline: audio.headline,
    description: audio.description
  }
}

export const AudioResourceWithMeditationMixer: Story = {
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
    template: `
      <MVAudioPlayer>
          <MVAudioResource  v-bind="$props" 
          class="my-10 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
          style="background-image: url(${args.posterUrl});">
  
          <template #audio-description>
          <MVAudioDescription
            image-src="${args.authorImage}"
            name="${args.artistName}"
            headline="${args.headline}"
            description="${args.description}"
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
      </MVAudioPlayer>`
  }),
  args: {
    ...Default.args,
    ...AudioResourceWithDescription.args,
    backgroundSounds: audio.backgroundSounds
  }
}
