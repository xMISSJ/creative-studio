<script setup lang="ts">
const { t } = useShopI18n()
const { count } = useCart()
const { menuOpen, toggleMenu, openCart } = useOverlay()
const route = useRoute()

const links = computed(() => [
  { to: '/', label: t('nav.home'), match: (path: string) => path === '/' || /^\/[a-z]{2}\/?$/.test(path) },
  { to: '/shop', label: t('nav.shop'), match: (path: string) => path.includes('/shop') || path.includes('/collections/') },
  { to: '/faq', label: t('nav.faq'), match: (path: string) => path.includes('/faq') },
  { to: '/about', label: t('nav.about'), match: (path: string) => path.includes('/about') },
])

function isCurrent(match: (path: string) => boolean) {
  return match(route.path) ? 'page' : undefined
}
</script>

<template>
  <header>
    <div class="border-b border-line bg-paper">
      <div class="container-page grid h-[4.25rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 lg:h-[4.75rem]">
        <div class="flex items-center justify-start gap-1">
          <button
            type="button"
            class="icon-btn lg:hidden"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            :aria-label="t('nav.menu')"
            @click="toggleMenu"
          >
            <AppIcon name="menu" />
          </button>
          <NuxtLinkLocale
            to="/shop"
            class="icon-btn hidden text-muted lg:inline-grid"
            :aria-label="t('shop.searchLabel')"
          >
            <AppIcon name="search" />
          </NuxtLinkLocale>
          <LocaleSwitcher variant="header" />
        </div>

        <AppLogo centered />

        <div class="flex items-center justify-end gap-1">
          <div class="hidden sm:block">
            <ThemeToggle />
          </div>
          <NuxtLinkLocale class="icon-btn hidden sm:inline-grid" to="/account" :aria-label="t('nav.account')">
            <AppIcon name="user" />
          </NuxtLinkLocale>
          <button type="button" class="icon-btn relative" :aria-label="t('cart.open', { count })" @click="openCart">
            <AppIcon name="cart" />
            <span
              v-if="count > 0"
              class="absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-[var(--button)] px-1 text-[0.7rem] font-bold text-[var(--on-button)]"
              aria-hidden="true"
            >
              {{ count }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <nav
    class="topbar sticky top-0 z-40 hidden border-b border-line lg:block"
    :aria-label="t('nav.primary')"
  >
    <ul class="container-page flex flex-wrap items-center justify-center gap-1 py-1.5">
      <li v-for="link in links" :key="link.label">
        <NuxtLinkLocale
          :to="link.to"
          class="nav-link text-[0.95rem]"
          :aria-current="isCurrent(link.match)"
        >
          {{ link.label }}
        </NuxtLinkLocale>
      </li>
    </ul>
  </nav>
</template>
