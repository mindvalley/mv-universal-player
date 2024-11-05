import { ObjectDirective } from 'vue'

const TOOLTIP_MARGIN = 10 // Margin between tooltip and element or viewport edge

export const tooltip: ObjectDirective = {
  mounted(el, binding) {
    el.setAttribute('data-tooltip', binding.value)
    el.addEventListener('pointerenter', showTooltip)
    el.addEventListener('pointerleave', hideTooltip)
    document.addEventListener('click', hideTooltipOnClickOutside)
  },
  updated(el, binding) {
    el.setAttribute('data-tooltip', binding.value)
    const tooltip = document.querySelector('.custom-tooltip')
    if (tooltip && el.matches(':hover')) {
      showTooltip({ currentTarget: el } as PointerEvent)
    }
  },
  unmounted(el) {
    el.removeEventListener('pointerenter', showTooltip)
    el.removeEventListener('pointerleave', hideTooltip)
    document.removeEventListener('click', hideTooltipOnClickOutside)
  }
}

function showTooltip(event: PointerEvent) {
  hideTooltip()
  const target = event.currentTarget as HTMLElement
  const tooltipText = target.getAttribute('data-tooltip')
  if (!tooltipText) return

  const tooltip = document.createElement('div')
  tooltip.textContent = tooltipText
  tooltip.className = 'custom-tooltip'

  // Check if we're in fullscreen mode
  const isFullscreen = !!document.fullscreenElement

  if (isFullscreen) {
    document.fullscreenElement?.appendChild(tooltip)
    const targetRect = target.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()

    // Use viewport-relative positioning like in normal mode
    let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
    let top = targetRect.top - tooltipRect.height - TOOLTIP_MARGIN

    // Ensure tooltip stays within viewport
    left = Math.max(
      TOOLTIP_MARGIN,
      Math.min(left, window.innerWidth - tooltipRect.width - TOOLTIP_MARGIN)
    )
    top = Math.max(
      TOOLTIP_MARGIN,
      Math.min(top, window.innerHeight - tooltipRect.height - TOOLTIP_MARGIN)
    )

    tooltip.style.left = `${left}px`
    tooltip.style.top = `${top}px`
  } else {
    // In normal mode, append to body
    document.body.appendChild(tooltip)
    const { position, left, top } = calculatePositionNormal(target, tooltip)
    tooltip.style.left = `${left}px`
    tooltip.style.top = `${top}px`
  }
}

function calculatePositionNormal(target: HTMLElement, tooltip: HTMLElement) {
  const targetRect = target.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Use viewport-relative positioning for normal mode
  let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
  let top = targetRect.top - tooltipRect.height - TOOLTIP_MARGIN

  // Ensure tooltip stays within viewport
  left = Math.max(
    TOOLTIP_MARGIN,
    Math.min(left, viewportWidth - tooltipRect.width - TOOLTIP_MARGIN)
  )
  top = Math.max(
    TOOLTIP_MARGIN,
    Math.min(top, viewportHeight - tooltipRect.height - TOOLTIP_MARGIN)
  )

  return { position: 'top', left, top }
}

function hideTooltip() {
  const tooltip = document.querySelector('.custom-tooltip')
  if (tooltip) {
    tooltip.parentElement?.removeChild(tooltip)
  }
}

function hideTooltipOnClickOutside(event: MouseEvent) {
  const tooltip = document.querySelector('.custom-tooltip')
  if (tooltip && !(event.target as HTMLElement).closest('[data-tooltip]')) {
    hideTooltip()
  }
}
