<script setup lang="ts">
const { t } = useShopI18n()
usePageMeta('meta.accountTitle', 'meta.accountDescription')
</script>

<template>
  <section class="container-page py-12">
    <PageIntro :eyebrow="t('account.eyebrow')" :title="t('account.title')" :lead="t('account.lead')" />
    <div class="mt-8 flex flex-wrap gap-3">
      <NuxtLinkLocale class="btn btn-primary" to="/login">{{ t('account.login') }}</NuxtLinkLocale>
      <NuxtLinkLocale class="btn btn-ghost" to="/register">{{ t('account.register') }}</NuxtLinkLocale>
    </div>
    <div class="mt-10 grid gap-4 md:grid-cols-3">
      <article class="panel p-5">
        <h2 class="font-display text-2xl">{{ t('account.sections.orders.title') }}</h2>
        <p class="mt-2 text-muted">{{ t('account.sections.orders.body') }}</p>
      </article>
      <article class="panel p-5">
        <h2 class="font-display text-2xl">{{ t('account.sections.profile.title') }}</h2>
        <p class="mt-2 text-muted">{{ t('account.sections.profile.body') }}</p>
      </article>
      <article class="panel p-5">
        <h2 class="font-display text-2xl">{{ t('account.sections.addresses.title') }}</h2>
        <p class="mt-2 text-muted">{{ t('account.sections.addresses.body') }}</p>
      </article>
    </div>
  </section>
</template>
