import { ObjectDirective } from 'vue'

const TOOLTIP_MARGIN = 10 // Margin between tooltip and element or viewport edge

export const tooltip: ObjectDirective = {
  mounted(el, binding) {
    el.setAttribute('data-tooltip', binding.value)
    el.addEventListener('mouseenter', showTooltip)
    el.addEventListener('mouseleave', hideTooltip)
  },
  unmounted(el) {
    el.removeEventListener('mouseenter', showTooltip)
    el.removeEventListener('mouseleave', hideTooltip)
  }
}

function showTooltip(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const tooltipText = target.getAttribute('data-tooltip')
  if (!tooltipText) return

  const tooltip = document.createElement('div')
  tooltip.textContent = tooltipText
  tooltip.className = 'custom-tooltip'
  document.body.appendChild(tooltip)

  const { position, left, top } = calculatePosition(target, tooltip)

  tooltip.classList.add(`tooltip-${position}`)
  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`
}

function calculatePosition(target: HTMLElement, tooltip: HTMLElement) {
  const targetRect = target.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const positions = [
    { name: 'top', available: targetRect.top > tooltipRect.height + TOOLTIP_MARGIN },
    {
      name: 'bottom',
      available: viewportHeight - targetRect.bottom > tooltipRect.height + TOOLTIP_MARGIN
    },
    { name: 'left', available: targetRect.left > tooltipRect.width + TOOLTIP_MARGIN },
    {
      name: 'right',
      available: viewportWidth - targetRect.right > tooltipRect.width + TOOLTIP_MARGIN
    }
  ]

  const position = positions.find((pos) => pos.available)?.name || 'top'

  let left, top

  switch (position) {
    case 'top':
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
      top = targetRect.top - tooltipRect.height - TOOLTIP_MARGIN
      break
    case 'bottom':
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
      top = targetRect.bottom + TOOLTIP_MARGIN
      break
    case 'left':
      left = targetRect.left - tooltipRect.width - TOOLTIP_MARGIN
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2
      break
    case 'right':
      left = targetRect.right + TOOLTIP_MARGIN
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2
      break
  }

  // Ensure the tooltip stays within the viewport
  left = Math.max(
    TOOLTIP_MARGIN,
    Math.min(left, viewportWidth - tooltipRect.width - TOOLTIP_MARGIN)
  )
  top = Math.max(
    TOOLTIP_MARGIN,
    Math.min(top, viewportHeight - tooltipRect.height - TOOLTIP_MARGIN)
  )

  return { position, left, top }
}

function hideTooltip() {
  const tooltip = document.querySelector('.custom-tooltip')
  if (tooltip) {
    document.body.removeChild(tooltip)
  }
}
