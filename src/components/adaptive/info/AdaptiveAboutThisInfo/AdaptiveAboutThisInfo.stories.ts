import { Meta, StoryObj } from '@storybook/vue3'
import { MVAdaptiveAboutThisInfo } from '.'
import { MVAdaptiveAboutThisInfoMeditationMixerButton } from './AdaptiveAboutThisInfoMeditationMixerButton'
import { MVAdaptiveAboutThisInfoSetDurationButton } from './AdaptiveAboutThisInfoSetDurationButton'

const meta: Meta<typeof MVAdaptiveAboutThisInfo> = {
  title: 'MVAdaptiveAboutThisInfo',
  component: MVAdaptiveAboutThisInfo
}

export default meta
type Story = StoryObj<typeof MVAdaptiveAboutThisInfo>

function getImageUrl(name: string) {
  return `/assets/images/${name}`
}

export const Default: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'About This',
    components: {
      MVAdaptiveAboutThisInfo,
      MVAdaptiveAboutThisInfoMeditationMixerButton
    },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><MVAdaptiveAboutThisInfo v-bind="args">
 
    </MVAdaptiveAboutThisInfo></div>`
  }),
  args: {
    headerTitle: 'About this info card',
    title: 'Phase 4: Envisioning the Future That is Bright',
    artistName: 'Vishen',
    description:
      'Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses.',

    image: getImageUrl('bg_sound_image_1.png'),
    ratings: 4.6,
    tags: [
      'Achieving goals',
      'Clarity on life vision',
      'Focus',
      'Meditation',
      'Health',
      'Finance',
      'Relationships',
      'Career'
    ]
  }
}

export const Scrollable: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'About This',
    components: {
      MVAdaptiveAboutThisInfo,
      MVAdaptiveAboutThisInfoMeditationMixerButton
    },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><MVAdaptiveAboutThisInfo v-bind="args">
 
    </MVAdaptiveAboutThisInfo></div>`
  }),
  args: {
    headerTitle: 'About this info card',
    title: 'Phase 4: Envisioning the Future That is Bright',
    artistName: 'Vishen',
    description:
      'Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses. Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses. Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses. Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses. Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses. Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses.',

    image: getImageUrl('bg_sound_image_1.png'),
    ratings: 4.6,
    tags: [
      'Achieving goals',
      'Clarity on life vision',
      'Focus',
      'Meditation',
      'Health',
      'Finance',
      'Relationships',
      'Career'
    ]
  }
}

export const MeditationMixer: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'About This',
    components: { MVAdaptiveAboutThisInfo, MVAdaptiveAboutThisInfoMeditationMixerButton },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><MVAdaptiveAboutThisInfo v-bind="args">
    <template #control>
      <MVAdaptiveAboutThisInfoMeditationMixerButton />
    </template>
    </MVAdaptiveAboutThisInfo></div>`
  }),
  args: {
    headerTitle: 'About this info card',
    title: 'Phase 4: Envisioning the Future That is Bright',
    artistName: 'Vishen',
    description:
      'Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses.',

    image: getImageUrl('bg_sound_image_1.png'),
    ratings: 4.6,
    tags: ['Achieving goals', 'Clarity on life vision', 'Focus']
  }
}

export const MeditationMixerActive: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Meditation Mixer - Active',
    components: { MVAdaptiveAboutThisInfo, MVAdaptiveAboutThisInfoMeditationMixerButton },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><MVAdaptiveAboutThisInfo v-bind="args">
    <template #control>
      <MVAdaptiveAboutThisInfoMeditationMixerButton :mixerEnabled="true" :track-title="'Track Title'" />
    </template>
    </MVAdaptiveAboutThisInfo></div>`
  }),
  args: {
    headerTitle: 'About this info card',
    title: 'Phase 4: Envisioning the Future That is Bright',
    artistName: 'Vishen',
    description:
      'Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses.',

    image: getImageUrl('bg_sound_image_1.png'),
    ratings: 4.6,
    tags: ['Achieving goals', 'Clarity on life vision', 'Focus']
  }
}

export const SetDuration: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'About This',
    components: {
      MVAdaptiveAboutThisInfo,
      MVAdaptiveAboutThisInfoMeditationMixerButton,
      MVAdaptiveAboutThisInfoSetDurationButton
    },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><MVAdaptiveAboutThisInfo v-bind="args">
    <template #control>
      <MVAdaptiveAboutThisInfoSetDurationButton />
    </template>
    </MVAdaptiveAboutThisInfo></div>`
  }),
  args: {
    headerTitle: 'About this info card',
    title: 'Phase 4: Envisioning the Future That is Bright',
    artistName: 'Vishen',
    description:
      'Being happy now is important, but so is thinking about where you want to go. Both are imperative for living a fulfilling life. In this meditation, you’ll uncover your vision for the next three years and experience it with all five senses.',

    image: getImageUrl('bg_sound_image_1.png'),
    ratings: 4.6,
    tags: ['Achieving goals', 'Clarity on life vision', 'Focus']
  }
}
