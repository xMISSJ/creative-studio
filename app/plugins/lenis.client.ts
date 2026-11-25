import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export default defineNuxtPlugin((nuxtApp) => {
  const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    respectReducedMotion: true,
    stopInertiaOnNavigate: true,
    // Soft glide on wheel; touch stays native.
    lerp: 0.09,
    wheelMultiplier: 0.85,
    syncTouch: false,
  })

  const cart = useCart()
  watch(cart.isOpen, (open) => {
    if (open) {
      lenis.stop()
    }
    else {
      lenis.start()
    }
  }, { immediate: true })

  nuxtApp.hook('page:transition:finish', () => {
    lenis.resize()
  })

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      lenis.destroy()
    })
  }

  return {
    provide: {
      lenis,
    },
  }
})
