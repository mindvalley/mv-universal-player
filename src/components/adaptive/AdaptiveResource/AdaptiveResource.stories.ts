import type { Meta, StoryObj } from '@storybook/vue3'
import MVAdaptiveResource from '.'

const meta: Meta<typeof MVAdaptiveResource> = {
  title: 'MVAdaptiveResource',
  component: MVAdaptiveResource
}

export default meta
type Story = StoryObj<typeof MVAdaptiveResource>

export const Default: Story = {
  render: (args: any, { argTypes }) => ({
    components: { MVAdaptiveResource },
    setup() {
      return { args }
    },
    template: `<MVAdaptiveResource v-bind="args" />`
  })
}
