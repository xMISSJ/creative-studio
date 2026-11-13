<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useShopI18n()
const localePath = useLocalePath()
const missing = computed(() => props.error.statusCode === 404)
const pageTitle = computed(() => (missing.value ? t('error.title') : t('error.genericTitle')))

usePageMetaValues(
  pageTitle,
  () => (missing.value ? t('error.body') : t('error.genericBody')),
  { robots: 'noindex' },
)

function goHome() {
  clearError({ redirect: localePath('/') })
}
</script>

<template>
  <NuxtLayout>
    <section class="container-page py-16">
      <p class="font-display text-7xl text-accent" aria-hidden="true">{{ error.statusCode }}</p>
      <h1 class="display-title mt-4 max-w-3xl text-4xl sm:text-6xl">
        {{ missing ? t('error.title') : t('error.genericTitle') }}
      </h1>
      <p class="mt-4 max-w-xl text-lg text-muted">
        {{ missing ? t('error.body') : t('error.genericBody') }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <button type="button" class="btn btn-primary" @click="goHome">{{ t('error.home') }}</button>
        <NuxtLinkLocale class="btn btn-ghost" to="/shop">{{ t('error.shop') }}</NuxtLinkLocale>
      </div>
    </section>
  </NuxtLayout>
</template>
