import type { Meta, StoryObj } from '@storybook/vue3'
import { MVMeditationResource } from '.'

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
const meta: Meta<typeof MVMeditationResource> = {
  title: 'MVMeditationResource',
  component: MVMeditationResource
}

export default meta
type Story = StoryObj<typeof MVMeditationResource>

export const Default: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'MedtiationResource',
    components: { MVMeditationResource },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20"><MVMeditationResource v-bind="args" /></div></div>`
  }),
  args: {
    key: audio2.assetId,
    id: audio2.assetId,
    audioSources: audio2.sources,
    duration: audio2.duration,
    posterUrl: audio2.posterUrl,
    title: audio2.title,
    artistName: audio2.artistName
  }
}

export const PreviousNext: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'MedtiationResource',
    components: { MVMeditationResource },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20"><MVMeditationResource v-bind="args" /></div></div>`
  }),
  args: {
    key: audio2.assetId,
    id: audio2.assetId,
    audioSources: audio2.sources,
    duration: audio2.duration,
    posterUrl: audio2.posterUrl,
    title: audio2.title,
    artistName: audio2.artistName,
    showPreviousNext: true
  }
}
