import type { RouterConfig } from '@nuxt/schema'
import type { RouteLocationNormalized, RouterScrollBehavior } from 'vue-router'
import { START_LOCATION } from 'vue-router'
import { useNuxtApp } from '#app'

function prefersReducedMotion() {
  return import.meta.client
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Cross-page hash targets after the new page mounts. */
function hashBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'instant' : 'smooth'
}

function stickyHeaderOffset() {
  const header = document.querySelector('header')
  if (header) {
    return Math.max(0, Math.round(header.getBoundingClientRect().height))
  }
  return Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
}

function hashScrollMargin(hash: string) {
  const el = document.getElementById(hash.slice(1))
  const elementMargin = el
    ? (Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0)
    : 0
  // Live header height (not scroll-padding alone) so a resized bar cannot leave targets under the nav.
  return stickyHeaderOffset() + elementMargin
}

/** Hard jump to top so route changes feel like a new page (not a glide). */
function jumpToTop() {
  if (!import.meta.client) {
    return
  }
  const lenis = useNuxtApp().$lenis
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
    return
  }
  window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
}

function position(
  to: RouteLocationNormalized,
  savedPosition: { left: number, top: number } | null,
  behavior: ScrollBehavior,
) {
  if (savedPosition) {
    return { ...savedPosition, behavior: 'instant' as ScrollBehavior }
  }
  if (to.hash) {
    return { el: to.hash, top: hashScrollMargin(to.hash), behavior }
  }
  return { left: 0, top: 0, behavior: 'instant' as ScrollBehavior }
}

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  const nuxtApp = useNuxtApp()
  const samePath = to.path.replace(/\/$/, '') === from.path.replace(/\/$/, '')

  if (samePath) {
    // In-page anchors: Lenis `anchors: true` handles the ease; do not double-scroll.
    return false
  }

  const allowScrollToTop = typeof to.meta.scrollToTop === 'function'
    ? to.meta.scrollToTop(to, from)
    : to.meta.scrollToTop

  if (allowScrollToTop === false) {
    return false
  }

  if (from === START_LOCATION) {
    return position(to, savedPosition, 'instant')
  }

  // Wait until the leaving page is gone (out-in), then jump like a new page load.
  return new Promise((resolve) => {
    const doScroll = () => {
      requestAnimationFrame(() => {
        if (useRouter().currentRoute.value.fullPath !== to.fullPath) {
          resolve(false)
          return
        }
        if (!savedPosition && !to.hash) {
          jumpToTop()
        }
        resolve(position(to, savedPosition, to.hash ? hashBehavior() : 'instant'))
      })
    }

    nuxtApp.hooks.hookOnce('page:loading:end', () => {
      const transitionPromise = (nuxtApp as { '~transitionPromise'?: Promise<void> })['~transitionPromise']
      if (transitionPromise) {
        transitionPromise.then(doScroll)
      }
      else {
        doScroll()
      }
    })
  })
}

export default {
  scrollBehavior,
} satisfies RouterConfig
