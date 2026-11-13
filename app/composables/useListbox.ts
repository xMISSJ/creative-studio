/**
 * APG-style listbox keyboard support for a trigger + option list.
 * Handles Escape (restore focus), Arrow/Home/End, and focusing the selected option on open.
 */
export function useListbox(options: {
  open: Ref<boolean>
  root: Ref<HTMLElement | null>
  trigger: Ref<HTMLElement | null>
  /** Called when Escape or outside dismiss closes the menu. */
  onClose?: () => void
}) {
  const optionSelector = '[role="option"]'

  function getOptions() {
    if (!options.root.value) return [] as HTMLElement[]
    return [...options.root.value.querySelectorAll<HTMLElement>(optionSelector)]
  }

  function focusOption(index: number) {
    const items = getOptions()
    if (!items.length) return
    const next = Math.min(Math.max(index, 0), items.length - 1)
    items[next]?.focus()
  }

  function focusSelectedOrFirst() {
    const items = getOptions()
    if (!items.length) return
    const selected = items.findIndex((el) => el.getAttribute('aria-selected') === 'true')
    focusOption(selected >= 0 ? selected : 0)
  }

  function close(restoreFocus = true) {
    if (!options.open.value) return
    options.open.value = false
    options.onClose?.()
    if (restoreFocus) {
      nextTick(() => options.trigger.value?.focus())
    }
  }

  function onDocPointer(event: PointerEvent) {
    if (!options.open.value || !options.root.value) return
    if (!options.root.value.contains(event.target as Node)) close(true)
  }

  function onKey(event: KeyboardEvent) {
    if (!options.open.value) return

    const items = getOptions()
    if (!items.length) return

    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const current = items.findIndex((el) => el === active)

    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(current < 0 ? 0 : current + 1)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption(current < 0 ? items.length - 1 : current - 1)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusOption(items.length - 1)
    }
  }

  watch(options.open, async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    focusSelectedOrFirst()
  })

  onMounted(() => {
    document.addEventListener('pointerdown', onDocPointer)
    document.addEventListener('keydown', onKey)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocPointer)
    document.removeEventListener('keydown', onKey)
  })

  return { close, focusSelectedOrFirst }
}
