<script setup lang="ts">
const { t } = useShopI18n()
usePageMeta('meta.registerTitle', 'meta.registerDescription', { robots: 'noindex, nofollow' })
</script>

<template>
  <section class="container-page py-12">
    <PageIntro :eyebrow="t('auth.registerEyebrow')" :title="t('auth.registerTitle')" :lead="t('auth.registerLead')" />
    <AuthForm mode="register" />
  </section>
</template>
