<script setup lang="ts">
import { formatPageTitle } from '~~/site.config'

// titleTemplate functions must live here — nuxt.config cannot serialize them to the client
useHead({
  titleTemplate: (title) => formatPageTitle(title),
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
