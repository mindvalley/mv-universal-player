/** @type {import('tailwindcss').Config} */

import { colors } from '@mindvalley/design-system'
import { colors as b2bColors } from '@mindvalley/design-system/b2b'

module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  important: '.mv-universal-player',
  theme: {
    screens: {
      xs: '375px', // Mobile Portrait
      sm: '480px', // Mobile Landscape
      md: '768px', // Tablet Portrait
      lg: '992px', // Tablet Landscape
      xl: '1280px', // Desktop
      '2xl': '1800px' // Large Desktop
    },
    fontFamily: {
      sans: ['"Sharp Grotesk Book 19"', 'sans-serif']
    },
    colors: {
      ...colors,
      ...b2bColors
    },
    // Place custom config here. This will generate Tailwind config + custom config.
    extend: {
      aspectRatio: {
        portrait: '3 / 4'
      },
      maxWidth: {
        '500px': '500px'
      },
      animation: {
        fade: 'fade 2.8s ease-in-out',
        'spin-horizontal': 'spin-horizontal 2.5s linear infinite',
        'fade-out': 'fade-out 0.5s linear'
      },
      keyframes: {
        fade: {
          '0%, 100%': { opacity: 0 },
          '15%, 85%': { opacity: 1 }
        },
        'spin-horizontal': {
          '0%': { transform: 'rotateY(0deg)' },
          to: { transform: 'rotateY(1turn)' }
        },
        'fade-out': {
          '0%': { opacity: 1 },
          to: { opacity: 0 }
        }
      },
      colors: {
        overlay: 'rgba(0, 0, 0, 0.75)',
        transparent: 'transparent'
      }
    },
    zIndex: {
      // Used for hiding elements
      '-10': '-100',

      // Foreground, Base. Default of every element.
      5: '0',

      // Overlay for floating elements under fixed navbar
      10: '100',

      // When you want an element to float but still under a fixed navbar
      15: '200',

      // Overlay for elements at fixed navbar level
      20: '300',

      // Fixed navbar level
      25: '400',

      // Overlay for highest level
      30: '500',

      // Elements here are on the highest level & will prevent user from interacting
      // with anything else other than it. Example: Completion modal.
      35: '600'
    }
  },
  safelist: ['aspect-square', 'aspect-video', 'aspect-portrait', 'carousel'],
  plugins: [
    require('@mindvalley/design-system/dist/tailwind/plugins/typography.js')({
      brands: ['mindvalley', 'b2b']
    })
  ]
}
