import { StorybookConfig } from '@storybook/vue3-vite'
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/**/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions'
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  }
}
export default config
