<script setup lang="ts">
const { t } = useShopI18n()
const { count, isOpen } = useCart()
const { openCart } = useOverlay()
const route = useRoute()
const header = ref<HTMLElement | null>(null)

useStickyHeaderOffset(header)

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
  <header ref="header" class="sticky top-0 z-40">
    <div class="border-b border-line bg-paper">
      <div class="container-page grid h-[4.75rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 lg:h-[5.25rem]">
        <div class="flex items-center justify-start gap-2.5">
          <LocaleSwitcher />
          <CurrencySwitcher />
        </div>

        <AppLogo centered />

        <div class="flex items-center justify-end gap-1">
          <ThemeToggle />
          <NuxtLinkLocale class="icon-btn" to="/account" :aria-label="t('nav.account')">
            <AppIcon name="user" />
          </NuxtLinkLocale>
          <button
            type="button"
            class="icon-btn relative"
            :aria-label="t('cart.open', { count })"
            :aria-expanded="isOpen"
            aria-controls="cart-drawer"
            @click="openCart"
          >
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

    <nav
      class="topbar border-b border-line"
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
  </header>
</template>
