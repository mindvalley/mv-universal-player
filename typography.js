const plugin = require('tailwindcss/plugin')
const _ = require('lodash')

/**
 * Generates typography utility classes
 *
 * @param {Object} options  options for generating/formating typography
 * @param {string} options.casing the case to use for classnames, the default is `kebabCase`
 *  which results to kebab-cased class names eg. `.title-bold-1`
 *  For supported casing option available in [lodash ](https://lodash.com/)
 *  Remember to pass in the lodash casing utility function name as string
 * @return {Object}  generated utility classes
 *
 */
const typographyPlugin = ({ casing = 'kebabCase' } = {}) =>
  plugin(function ({ addComponents, theme }) {
    const screens = theme('screens', {})

    const sharpGroteskSemibold21 = {
      fontFamily: '"Sharp Grotesk Semibold 21", sans-serif'
    }

    const sharpGroteskMedium20 = {
      fontFamily: '"Sharp Grotesk Medium 20", sans-serif'
    }

    const SharpGroteskBook19 = {
      fontFamily: '"Sharp Grotesk Book 19", sans-serif'
    }

    const headlines = {
      titleBold1: {
        ...sharpGroteskSemibold21,
        fontSize: '60px',
        letterSpacing: '0.25px',
        lineHeight: '68px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '72px',
          lineHeight: '80px'
        }
      },
      titleBold2: {
        ...sharpGroteskSemibold21,
        fontSize: '44px',
        letterSpacing: '0.25px',
        lineHeight: '52px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '60px',
          letterSpacing: '0.25px',
          lineHeight: '68px'
        }
      },
      titleBold3: {
        ...sharpGroteskSemibold21,
        fontSize: '36px',
        lineHeight: '44px',
        letterSpacing: '0.25px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '48px',
          lineHeight: '56px'
        }
      },
      titleBold4: {
        ...sharpGroteskSemibold21,
        fontSize: '32px',
        letterSpacing: '0.25px',
        lineHeight: '38px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '36px',
          lineHeight: '44px'
        }
      },
      titleBold5: {
        ...sharpGroteskSemibold21,
        fontSize: '24px',
        letterSpacing: '0.25px',
        lineHeight: '30px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '28px',
          lineHeight: '34px'
        }
      },
      titleBold6: {
        ...sharpGroteskSemibold21,
        fontSize: '22px',
        letterSpacing: '0.25px',
        lineHeight: '26px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '24px',
          lineHeight: '30px'
        }
      },
      titleBold7: {
        ...sharpGroteskSemibold21,
        fontSize: '20px',
        letterSpacing: '0.25px',
        lineHeight: '24px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '22px',
          lineHeight: '26px'
        }
      },
      titleBold8: {
        ...sharpGroteskSemibold21,
        fontSize: '18px',
        letterSpacing: '0.25px',
        lineHeight: '22px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '20px',
          lineHeight: '24px'
        }
      },
      titleBold9: {
        ...sharpGroteskSemibold21,
        fontSize: '16px',
        letterSpacing: '0.25px',
        lineHeight: '20px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '18px',
          lineHeight: '22px'
        }
      },
      titleBold10: {
        ...sharpGroteskSemibold21,
        fontSize: '14px',
        letterSpacing: '0.25px',
        lineHeight: '18px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '16px',
          lineHeight: '20px'
        }
      },
      titleBold11: {
        ...sharpGroteskSemibold21,
        fontSize: '12px',
        letterSpacing: '0.25px',
        lineHeight: '16px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '14px',
          lineHeight: '18px'
        }
      }
    }

    const subheadlines = {
      title1: {
        ...sharpGroteskMedium20,
        fontSize: '48px',
        letterSpacing: '0.25px',
        lineHeight: '56px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '60px',
          lineHeight: '68px'
        }
      },
      title2: {
        ...sharpGroteskMedium20,
        fontSize: '36px',
        letterSpacing: '0.25px',
        lineHeight: '44px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '48px',
          lineHeight: '56px'
        }
      },
      title3: {
        ...sharpGroteskMedium20,
        fontSize: '32px',
        letterSpacing: '0.25px',
        lineHeight: '38px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '36px',
          lineHeight: '44px'
        }
      },
      title4: {
        ...sharpGroteskMedium20,
        fontSize: '28px',
        letterSpacing: '0.25px',
        lineHeight: '34px',

        [`@media (min-width: ${screens.lg})`]: {
          fontSize: '28px',
          lineHeight: '34px'
        }
      },
      title5: {
        ...sharpGroteskMedium20,
        fontSize: '24px',
        letterSpacing: '0.25px',
        lineHeight: '30px'
      },
      title6: {
        ...sharpGroteskMedium20,
        fontSize: '20px',
        letterSpacing: '0.25px',
        lineHeight: '24px'
      },
      title7: {
        ...sharpGroteskMedium20,
        fontSize: '16px',
        letterSpacing: '0.25px',
        lineHeight: '20px'
      },
      title8: {
        ...sharpGroteskMedium20,
        fontSize: '14px',
        letterSpacing: '0.25px',
        lineHeight: '18px'
      },
      title9: {
        ...sharpGroteskMedium20,
        fontSize: '12px',
        letterSpacing: '0.35px',
        lineHeight: '16px'
      },
      title10: {
        ...sharpGroteskMedium20,
        fontSize: '10px',
        letterSpacing: '0.35px',
        lineHeight: '14px'
      }
    }

    const body = {
      body: {
        ...SharpGroteskBook19,
        fontSize: '16px',
        letterSpacing: '0.35px',
        lineHeight: '22px'
      },
      bodyBold: {
        ...sharpGroteskSemibold21,
        fontSize: '16px',
        letterSpacing: '0.25px',
        lineHeight: '22px'
      },
      bodySmall: {
        ...SharpGroteskBook19,
        fontSize: '14px',
        letterSpacing: '0.35px',
        lineHeight: '20px'
      },
      bodySmallBold: {
        ...sharpGroteskSemibold21,
        fontSize: '14px',
        letterSpacing: '0.35px',
        lineHeight: '20px'
      }
    }

    const others = {
      caption: {
        ...SharpGroteskBook19,
        fontSize: '12px',
        letterSpacing: '0.5px',
        lineHeight: '16px'
      },
      overline: {
        ...sharpGroteskMedium20,
        fontSize: '14px',
        letterSpacing: '0.5px',
        lineHeight: '20px',
        textTransform: 'uppercase'
      },
      disclaimerText: {
        ...SharpGroteskBook19,
        fontSize: '12px',
        letterSpacing: '0.5px',
        lineHeight: '16px'
      }
    }

    const buttonTypography = {
      buttonText: {
        ...sharpGroteskMedium20,
        fontSize: '16px',
        letterSpacing: '0.25px',
        lineHeight: '20px'
      },
      buttonTextMedium: {
        ...sharpGroteskMedium20,
        fontSize: '14px',
        letterSpacing: '0.25px',
        lineHeight: '18px'
      },
      buttonTextSmall: {
        ...sharpGroteskMedium20,
        fontSize: '12px',
        letterSpacing: '0.35px',
        lineHeight: '16px'
      }
    }

    const typographyWithClassNameChanged = changeClassNames(
      {
        ...headlines,
        ...body,
        ...subheadlines,
        ...buttonTypography,
        ...others
      },
      casing
    )

    const typography = unitsToRelative(typographyWithClassNameChanged)

    addComponents(typography)
  })

function changeClassNames(typography, casing) {
  return _.mapKeys(typography, (value, key) =>
    _[casing] ? `.${_[casing](key)}` : `.${_.kebabCase(key)}`
  )
}

function unitsToRelative(typography) {
  return _.transform(typography, function (result, value, key) {
    const covertValue = () =>
      _.includes(['fontSize', 'letterSpacing', 'lineHeight'], key) ? toRem(value) : value

    result[key] = _.isObject(value) ? unitsToRelative(value) : covertValue()
  })
}

function toRem(sizeInPx) {
  return sizeInPx.replace(/px/g, '') / 16 + 'rem'
}

module.exports = typographyPlugin
