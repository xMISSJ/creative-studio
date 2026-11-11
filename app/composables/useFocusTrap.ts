export function useFocusTrap(open: Ref<boolean>, root: Ref<HTMLElement | null>) {
  const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  let previous: HTMLElement | null = null

  function onKeydown(event: KeyboardEvent) {
    if (!open.value || !root.value) return

    if (event.key === 'Escape') {
      event.preventDefault()
      open.value = false
      return
    }

    if (event.key !== 'Tab') return

    const items = [...root.value.querySelectorAll<HTMLElement>(focusable)]
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(open, async (isOpen) => {
    if (!import.meta.client) return

    if (isOpen) {
      previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      root.value?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    } else {
      document.removeEventListener('keydown', onKeydown)
      const target = previous
      previous = null
      nextTick(() => target?.focus())
    }
  })

  onBeforeUnmount(() => {
    if (import.meta.client) document.removeEventListener('keydown', onKeydown)
  })
}
