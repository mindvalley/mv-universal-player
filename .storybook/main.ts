import type { StorybookConfig } from '@storybook/vue-vite'
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/**/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
      }
    }
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/vue-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
}
export default config
