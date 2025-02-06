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

  // Make target position relative if it isn't already
  if (window.getComputedStyle(target).position === 'static') {
    target.style.position = 'relative'
  }

  const tooltip = document.createElement('div')
  tooltip.textContent = tooltipText
  tooltip.className = 'custom-tooltip'

  // Append to target instead of container
  target.appendChild(tooltip)
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
