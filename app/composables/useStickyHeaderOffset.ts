/**
 * Keeps `--header-offset` in sync with the sticky header height so hash
 * targets and the entrance stage clear the bar on every breakpoint.
 */
export function useStickyHeaderOffset(header: Ref<HTMLElement | null>) {
  let observer: ResizeObserver | null = null
  let raf = 0

  function apply() {
    if (!import.meta.client) return
    const el = header.value
    if (!el) return

    const height = Math.max(0, Math.round(el.getBoundingClientRect().height))
    document.documentElement.style.setProperty('--header-offset', `${height}px`)
  }

  function schedule() {
    if (!import.meta.client || raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      apply()
    })
  }

  onMounted(() => {
    schedule()
    requestAnimationFrame(schedule)
    void document.fonts?.ready?.then(schedule)

    if (!header.value) return
    observer = new ResizeObserver(schedule)
    observer.observe(header.value)
  })

  onBeforeUnmount(() => {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
    observer?.disconnect()
    observer = null
  })
}
