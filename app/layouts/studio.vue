<script setup lang="ts">
const { t } = useShopI18n()
const route = useRoute()
const { refresh } = useAdminSession()

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await refresh()
  await navigateTo('/studio/login')
}

function navActive(path: string, exact = false) {
  if (exact) return route.path === path
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <div class="studio-shell min-h-screen bg-canvas text-ink">
    <header class="border-b border-line bg-paper">
      <div class="container-page flex flex-wrap items-center justify-between gap-3 py-4">
        <div class="min-w-0">
          <p class="text-xs font-bold tracking-[0.18em] text-accent uppercase">{{ t('studio.eyebrow') }}</p>
          <p class="font-display text-2xl leading-none">{{ t('studio.title') }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLinkLocale to="/" class="btn btn-ghost">{{ t('studio.backToShop') }}</NuxtLinkLocale>
          <button type="button" class="btn btn-ghost" @click="logout">
            {{ t('studio.logout') }}
          </button>
        </div>
      </div>
      <nav class="container-page pb-3" :aria-label="t('studio.navLabel')">
        <ul class="flex flex-wrap gap-2">
          <li>
            <NuxtLink
              to="/studio"
              class="chip"
              :aria-current="navActive('/studio', true) ? 'true' : undefined"
            >
              {{ t('studio.nav.home') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/studio/products"
              class="chip"
              :aria-current="navActive('/studio/products') ? 'true' : undefined"
            >
              {{ t('studio.nav.products') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/studio/art"
              class="chip"
              :aria-current="navActive('/studio/art') ? 'true' : undefined"
            >
              {{ t('studio.nav.art') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/studio/settings"
              class="chip"
              :aria-current="navActive('/studio/settings') ? 'true' : undefined"
            >
              {{ t('studio.nav.settings') }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
    <main id="main" class="container-page py-8">
      <slot />
    </main>
  </div>
</template>
