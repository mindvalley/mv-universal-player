import type { Meta, StoryObj } from '@storybook/vue3'
import { MVSoundscapeResource } from '.'
import { action } from '@storybook/addon-actions'

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
  tags: ['Achieving goals', 'Clarity on life vision', 'Focus']
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
  tags: ['Changing habits', 'New Mindset', 'Improve Health']
}

const audio3 = {
  assetId: '3',
  sources: [{ type: 'audio/mpeg', src: getSoundUrl('soundscape_1.mp3') }],
  isFavourite: false,
  duration: 103,
  posterUrl: getImageUrl('free_youself_from_depression.jpeg'),
  title: 'Free Yourself from Depression and Anxiety',
  artistName: 'Marisa Peer',
  ratings: 4,
  totalRatings: 5,
  authorImage: getImageUrl('rtt_marisa_author.jpeg'),
  headline: 'Creator Of Rapid Transformational Therapy®',
  description:
    "Celebrity therapist Marisa Peer's proven techniques will free you from a life of negative patterns and thinking. This hypnosis session softly guides us into a state of deep introspection, where we boost our self-esteem and free ourselves from negative thoughts and patterns by programming healthier habits around eating, exercise, hobbies, thinking, self-love and self-esteem, and relating to others.",
  tags: ['Changing habits', 'New Mindset', 'Improve Health']
}

const video1 = {
  id: '1',
  markers: [
    {
      __typename: 'Marker',
      id: '3e13b3af-9d39-4147-b724-2d8125f7d1f1',
      name: 'Marker 1',
      time: 35
    },
    {
      __typename: 'Marker',
      id: 'c329b19f-fb46-4bc1-983e-099ce011dc13',
      name: 'Marker 2 minutes',
      time: 120
    },
    {
      __typename: 'Marker',
      id: '4966c85c-401e-4590-8bcb-2ed3ad74072b',
      name: 'Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh.',
      time: 125
    }
  ],
  sources: [{ type: 'video/mp4', src: '//vjs.zencdn.net/v/oceans.mp4' }],
  duration: 46000,
  posterUrl: getImageUrl('removing_inner_blocks_success.jpeg'),
  title: 'Removing Inner Block to Success',
  artistName: 'Marisa Peer',
  ratings: 5,
  totalRatings: 4,
  coverAsset: getImageUrl('removing_inner_blocks_success.jpeg'),
  authorImage: getImageUrl('rtt_marisa_author.jpeg'),
  headline: 'Creator Of Rapid Transformational Therapy®',
  description:
    'An internationally award-winning qualified hypnotherapist with advanced certificates in hypnotherapy from the Hypnotism Training Institute of Los Angeles. Marisa has completed additional studies in hypno-healing, advanced hypnotherapy, medical hypnotherapy and Gestalt Analysis.\r\n\r\nHaving undertaken further studies at the Proudfoot School of Hypnotherapy and Psychotherapy and the Atkinson Ball College of Hypnotherapy, Marisa has dedicated the last three decades to researching, testing and applying the most beneficial principles of Hypnotherapy, Psychotherapy, NLP, CBT and Neuroscience. \r\n\r\nThe result of over 30 years of careful and rigorous study, Marisa’s unique, Rapid Transformational Therapy®️ (RTT®️), has helped tens of thousands of people worldwide to overcome their own, personal challenges and lead happier, more fulfilling lives. ',
  tags: ['Achieving goals', 'Clarity on life vision', 'Focus']
}

const audios = [audio1, audio2]

function getImageUrl(name: string) {
  return `/assets/images/${name}`
}

function getSoundUrl(name: string) {
  return `/assets/sounds/${name}`
}
const meta: Meta<typeof MVSoundscapeResource> = {
  title: 'MVSoundscapeResource',
  component: MVSoundscapeResource
}

export default meta
type Story = StoryObj<typeof MVSoundscapeResource>

export const Default: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Soundscape',
    components: { MVSoundscapeResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20 absolute bottom-0 left-0 right-0"><MVSoundscapeResource v-bind="args"
       @play="logEvent('play', $event)"
    @pause="logEvent('pause', $event)" @maximize="logEvent('maximize', $event)" @minimize="logEvent('minimize', $event)" @muted="logEvent('muted', $event)" @close="logEvent('close', $event)" @collection-open="logEvent('collection-open', $event)" @setDuration="logEvent('setDuration', $event)"  @ended="logEvent('ended', $event)" @error="logEvent('error', $event)" @playtime="logEvent('playtime', $event)"  /></div></div>`
  }),
  args: {
    key: audio1.assetId,
    id: audio1.assetId,
    audioSources: audio1.sources,
    duration: audio1.duration,
    posterUrl: audio1.posterUrl,
    title: audio1.title,
    artistName: audio1.artistName,
    description: audio1.description,
    ratings: audio1.ratings,
    tags: audio1.tags
  }
}

export const LoopingEnabled: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Looping Enabled',
    components: { MVSoundscapeResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20 absolute bottom-0 left-0 right-0"><MVSoundscapeResource v-bind="args" /></div></div>`
  }),
  args: {
    key: audio1.assetId,
    id: audio1.assetId,
    audioSources: audio1.sources,
    duration: audio1.duration,
    posterUrl: audio1.posterUrl,
    title: audio1.title,
    artistName: audio1.artistName,
    description: audio1.description,
    ratings: audio1.ratings,
    tags: audio1.tags
  }
}

export const LoopingEnabledShort: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Looping Enabled',
    components: { MVSoundscapeResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20 absolute bottom-0 left-0 right-0"><MVSoundscapeResource v-bind="args" /></div></div>`
  }),
  args: {
    key: audio3.assetId,
    id: audio3.assetId,
    audioSources: audio3.sources,
    duration: audio3.duration,
    posterUrl: audio3.posterUrl,
    title: audio3.title,
    artistName: audio3.artistName,
    description: audio3.description,
    ratings: audio3.ratings,
    tags: audio3.tags
  }
}

export const PreviousNext: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Looping Enabled',
    components: { MVSoundscapeResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20 absolute bottom-0 left-0 right-0"><MVSoundscapeResource v-bind="args" @previous="logEvent('previous', $event)" @next="logEvent('next', $event)" /></div></div>`
  }),
  args: {
    key: audio1.assetId,
    id: audio1.assetId,
    audioSources: audio1.sources,
    duration: audio1.duration,
    posterUrl: audio1.posterUrl,
    title: audio1.title,
    artistName: audio1.artistName,
    showPreviousNext: true,
    description: audio1.description,
    ratings: audio1.ratings,
    tags: audio1.tags
  }
}

export const ImmersiveLoopingVideo: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Immersive - Looping Video',
    components: { MVSoundscapeResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20 absolute bottom-0 left-0 right-0"><MVSoundscapeResource v-bind="args" /></div></div>`
  }),
  args: {
    key: audio1.assetId,
    id: audio1.assetId,
    audioSources: audio1.sources,
    videoSources: video1.sources,
    duration: audio1.duration,
    posterUrl: audio1.posterUrl,
    title: audio1.title,
    artistName: audio1.artistName,
    description: audio1.description,
    ratings: audio1.ratings,
    tags: audio1.tags
  }
}

export const ImmersiveDynamicVideo: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Immersive - Dynamic Video',
    components: { MVSoundscapeResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="mt-20 absolute bottom-0 left-0 right-0"><MVSoundscapeResource v-bind="args" /></div></div>`
  }),
  args: {
    key: audio2.assetId,
    id: audio2.assetId,
    audioSources: audio2.sources,
    duration: audio2.duration,
    posterUrl: audio2.posterUrl,
    title: audio2.title,
    artistName: audio2.artistName,
    description: audio2.description,
    ratings: audio2.ratings,
    tags: audio2.tags
  }
}
