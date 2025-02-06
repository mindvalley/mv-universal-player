import { computed, onMounted, onUnmounted, ref } from 'vue-demi'

export function useDetectBrowser() {
  const isMobileOrTablet = ref(false)

  const checkScreenSize = () => {
    isMobileOrTablet.value = window.innerWidth < 1280 // Adjust this breakpoint as needed
  }

  onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })

  const isiPhoneOriPadSafari = computed(() => {
    return isAppleDevice.value && isTouchDevice.value && isSafari.value
  })

  const isiPhone = computed(() => {
    const ua = getUserAgent()
    return ua.indexOf('iphone') > -1
  })

  const isiPad = computed(() => {
    const ua = getUserAgent()
    return ua.indexOf('ipad') > -1
  })

  const isMac = computed(() => {
    const ua = getUserAgent()
    return ua.indexOf('macintosh') > -1
  })

  const isAppleDevice = computed(() => {
    return isiPhone.value || isiPad.value || isMac.value
  })

  const isTouchDevice = computed(() => {
    return navigator.maxTouchPoints > 0
  })

  const isSafari = computed(() => {
    const ua = getUserAgent()
    if (ua.indexOf('chrome') > -1 || ua.indexOf('firefox') > -1 || ua.indexOf('edg') > -1) {
      return false
    }
    if (ua.indexOf('safari') > -1) {
      return true
    }

    return false
  })

  function getUserAgent(): string {
    // Mac Safari
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15"
    // Safari - iPhone iOS 16
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
    // Safari - iPad mini iPadOS 16
    // "Mozilla/5.0 (iPad; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
    // Safari - iPad iPadOS 16
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15"
    // Microsoft Edge - MacOS
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37"
    // Microsoft Edge - Windows
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37"
    // Chrome - MacOS
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36"
    // Chrome - Windows
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
    // Firefox - MacOS
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0"
    // Firefox - Windows
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0"

    return window.navigator.userAgent.toLowerCase()
  }

  return { isiPhoneOriPadSafari, isiPhone, isiPad, isTouchDevice, isMobileOrTablet }
}
