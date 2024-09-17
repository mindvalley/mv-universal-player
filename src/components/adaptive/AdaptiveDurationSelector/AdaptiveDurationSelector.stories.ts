import { Meta, StoryObj } from '@storybook/vue3'
import { MVAdaptiveDurationSelector } from '.'

const meta: Meta<typeof MVAdaptiveDurationSelector> = {
  title: 'MVAdaptiveDurationSelector',
  component: MVAdaptiveDurationSelector
}

export default meta
type Story = StoryObj<typeof MVAdaptiveDurationSelector>

export const Default: Story = {
  render: (args: any, { argTypes }) => ({
    title: 'Soundscape',
    components: { MVAdaptiveDurationSelector },
    setup() {
      return { args }
    },
    template: `<div class="mv-universal-player"><MVAdaptiveDurationSelector v-bind="args" /></div>`
  }),
  args: {
    duration: 100
  }
}
