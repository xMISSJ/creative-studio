<script setup lang="ts">
const { t } = useShopI18n()
usePageMeta('meta.loginTitle', 'meta.loginDescription')
</script>

<template>
  <section class="container-page py-12">
    <PageIntro :eyebrow="t('auth.loginEyebrow')" :title="t('auth.loginTitle')" :lead="t('auth.loginLead')" />
    <AuthForm mode="login" />
  </section>
</template>
