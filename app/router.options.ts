import type { RouterConfig } from '@nuxt/schema'
import type { RouteLocationNormalized, RouterScrollBehavior } from 'vue-router'
import { START_LOCATION } from 'vue-router'
import { useNuxtApp } from '#app'

function prefersReducedMotion() {
  return import.meta.client
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function motionAwareBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth'
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

function position(
  to: RouteLocationNormalized,
  savedPosition: { left: number, top: number } | null,
  behavior: ScrollBehavior,
) {
  if (savedPosition) {
    return { ...savedPosition, behavior }
  }
  if (to.hash) {
    return { el: to.hash, top: hashScrollMargin(to.hash), behavior }
  }
  return { left: 0, top: 0, behavior }
}

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  const nuxtApp = useNuxtApp()
  const behavior = motionAwareBehavior()

  if (to.path.replace(/\/$/, '') === from.path.replace(/\/$/, '')) {
    if (from.hash && !to.hash) {
      return savedPosition ? { ...savedPosition, behavior } : { left: 0, top: 0, behavior }
    }
    if (to.hash) {
      return { el: to.hash, top: hashScrollMargin(to.hash), behavior }
    }
    return false
  }

  const allowScrollToTop = typeof to.meta.scrollToTop === 'function'
    ? to.meta.scrollToTop(to, from)
    : to.meta.scrollToTop

  if (allowScrollToTop === false) {
    return false
  }

  if (from === START_LOCATION) {
    return position(to, savedPosition, behavior)
  }

  return new Promise((resolve) => {
    const doScroll = () => {
      requestAnimationFrame(() => {
        if (useRouter().currentRoute.value.fullPath !== to.fullPath) {
          resolve(false)
          return
        }
        resolve(position(to, savedPosition, behavior))
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
