<script setup lang="ts">
definePageMeta({
  layout: 'studio',
  middleware: 'admin',
})

defineI18nRoute(false)

const { t } = useShopI18n()
usePageMeta('meta.studioTitle', 'meta.studioDescription', { robots: 'noindex, nofollow' })
</script>

<template>
  <section>
    <h1 class="display-title text-3xl sm:text-4xl">{{ t('studio.homeTitle') }}</h1>
    <p class="mt-3 max-w-2xl text-base leading-relaxed text-muted">{{ t('studio.homeLead') }}</p>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{{ t('studio.staticHostNote') }}</p>

    <ul class="mt-8 grid items-stretch gap-4 sm:grid-cols-3">
      <li class="min-h-0">
        <NuxtLink to="/studio/products" class="flex h-full flex-col rounded-md border border-line bg-paper p-5 transition hover:border-accent">
          <h2 class="font-display text-xl">{{ t('studio.nav.products') }}</h2>
          <p class="mt-2 flex-1 text-sm text-muted">{{ t('studio.homeProducts') }}</p>
        </NuxtLink>
      </li>
      <li class="min-h-0">
        <NuxtLink to="/studio/art" class="flex h-full flex-col rounded-md border border-line bg-paper p-5 transition hover:border-accent">
          <h2 class="font-display text-xl">{{ t('studio.nav.art') }}</h2>
          <p class="mt-2 flex-1 text-sm text-muted">{{ t('studio.homeArt') }}</p>
        </NuxtLink>
      </li>
      <li class="min-h-0">
        <NuxtLink to="/studio/settings" class="flex h-full flex-col rounded-md border border-line bg-paper p-5 transition hover:border-accent">
          <h2 class="font-display text-xl">{{ t('studio.nav.settings') }}</h2>
          <p class="mt-2 flex-1 text-sm text-muted">{{ t('studio.homeSettings') }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
