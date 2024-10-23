import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import { MVVideoResource } from '.'
import { MVVideoDescription } from './../VideoDescription'

function getImageUrl(name: string) {
  return `/assets/images/${name}`
}

const video = {
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
  duration: 1932.669,
  posterUrl: getImageUrl('removing_inner_blocks_success.jpeg'),
  title: 'Removing Inner Block to Success',
  artistName: 'Marisa Peer',
  ratings: 5,
  totalRatings: 4,
  coverAsset: getImageUrl('removing_inner_blocks_success.jpeg'),
  authorImage: getImageUrl('rtt_marisa_author.jpeg'),
  headline: 'Creator Of Rapid Transformational Therapy®',
  description:
    'An internationally award-winning qualified hypnotherapist with advanced certificates in hypnotherapy from the Hypnotism Training Institute of Los Angeles. Marisa has completed additional studies in hypno-healing, advanced hypnotherapy, medical hypnotherapy and Gestalt Analysis.\r\n\r\nHaving undertaken further studies at the Proudfoot School of Hypnotherapy and Psychotherapy and the Atkinson Ball College of Hypnotherapy, Marisa has dedicated the last three decades to researching, testing and applying the most beneficial principles of Hypnotherapy, Psychotherapy, NLP, CBT and Neuroscience. \r\n\r\nThe result of over 30 years of careful and rigorous study, Marisa’s unique, Rapid Transformational Therapy®️ (RTT®️), has helped tens of thousands of people worldwide to overcome their own, personal challenges and lead happier, more fulfilling lives. '
}

const meta: Meta<typeof MVVideoResource> = {
  title: 'MVVideoResource',
  component: MVVideoResource
}

export default meta

type Story = StoryObj<typeof MVVideoResource>

export const Default: Story = {
  render: (args: any, { argTypes }) => ({
    components: { MVVideoResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><MVVideoResource v-bind="args" @play="logEvent('play', $event)" @pause="logEvent('pause', $event)" @seeking="logEvent('seeking', $event)" @ended="logEvent('ended', $event)" @rewind="logEvent('rewind', $event)" @fastforward="logEvent('fastforward', $event)" @playbackSpeed="logEvent('playbackSpeed', $event)" @favourite="logEvent('favourite', $event)" @timeupdate="logEvent('timeupdate', $event)" @error="logEvent('error', $event)"></MVVideoResource></div>`
  }),
  args: {
    assetId: video.id,
    markers: video.markers,
    sources: video.sources,
    duration: video.duration,
    posterUrl: video.posterUrl,
    title: video.title,
    artistName: video.artistName,
    ratings: video.ratings,
    totalRatings: video.totalRatings
  }
}

export const OverlayControls: Story = {
  render: (args: any, { argTypes }) => ({
    components: { MVVideoResource },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="overflow-hidden rounded-[20px] bg-black"><MVVideoResource v-bind="args" @play="logEvent('play', $event)" @pause="logEvent('pause', $event)" @seeking="logEvent('seeking', $event)" @ended="logEvent('ended', $event)" @rewind="logEvent('rewind', $event)" @fastforward="logEvent('fastforward', $event)" @playbackSpeed="logEvent('playbackSpeed', $event)" @favourite="logEvent('favourite', $event)" @timeupdate="logEvent('timeupdate', $event)" @error="logEvent('error', $event)"></MVVideoResource></div></div>`
  }),
  args: {
    assetId: video.id,
    markers: video.markers,
    sources: video.sources,
    duration: video.duration,
    posterUrl: video.posterUrl,
    title: video.title,
    artistName: video.artistName,
    ratings: video.ratings,
    totalRatings: video.totalRatings,
    overlayControls: true
  }
}

export const WithDescription: Story = {
  render: (args: any, { argTypes }) => ({
    components: { MVVideoResource, MVVideoDescription },
    methods: { logEvent: action('') },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><div class="overflow-hidden rounded-[20px] bg-black"><MVVideoResource v-bind="args" @play="logEvent('play', $event)" @pause="logEvent('pause', $event)" @seeking="logEvent('seeking', $event)" @ended="logEvent('ended', $event)" @rewind="logEvent('rewind', $event)" @fastforward="logEvent('fastforward', $event)" @playbackSpeed="logEvent('playbackSpeed', $event)" @favourite="logEvent('favourite', $event)" @timeupdate="logEvent('timeupdate', $event)" @error="logEvent('error', $event)">
    <template #video-description>
      <MVVideoDescription :headline="args.headline" :description="args.description" :image-src="args.imageSrc" class="p-4 md:py-6" :blur-effect="args.blurEffect" :ratings-count="args.ratingsCount" :average-rating="args.averageRating"
      :overlay="args.overlay"
      :show-more-text="args.showMoreText"
      :show-less-text="args.showLessText"
      />
    </template>
    </MVVideoResource></div></div>`
  }),
  args: {
    ...Default.args,
    headline: video.headline,
    description: video.description,
    imageSrc: video.authorImage,
    ratingsCount: 5,
    averageRating: 3,
    overlay: true,
    showMoreText: 'Show More',
    showLessText: 'Show Less',
    blurEffect: true
  }
}
