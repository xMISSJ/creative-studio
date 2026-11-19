<script setup lang="ts">
import type { DigitalArtShowcase } from '#shared/catalog'

definePageMeta({
  layout: 'studio',
  middleware: 'admin',
})

defineI18nRoute(false)

const { t } = useShopI18n()
usePageMeta('meta.studioArtTitle', 'meta.studioArtDescription', { robots: 'noindex, nofollow' })

const { data, status, error, refresh } = await useFetch<DigitalArtShowcase>('/api/admin/digital-art', {
  key: 'admin-digital-art',
})

const pendingTarget = ref<'avatars' | 'characters' | null>(null)
const messageKey = ref<'none' | 'saved' | 'failed' | 'uploadTooLarge' | 'uploadQuota'>('none')

async function upload(target: 'avatars' | 'characters', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  pendingTarget.value = target
  messageKey.value = 'none'
  try {
    const body = new FormData()
    body.append('file', file)
    body.append('target', target)
    if (target === 'characters') body.append('group', 'chibi')
    await $fetch('/api/admin/upload', { method: 'POST', body })
    await refresh()
    messageKey.value = 'saved'
  } catch (error: unknown) {
    const status = typeof error === 'object' && error && 'statusCode' in error
      ? Number((error as { statusCode?: number }).statusCode)
      : 0
    if (status === 413) messageKey.value = 'uploadTooLarge'
    else if (status === 507) messageKey.value = 'uploadQuota'
    else messageKey.value = 'failed'
  } finally {
    pendingTarget.value = null
    input.value = ''
  }
}
</script>

<template>
  <section>
    <h1 class="display-title text-3xl">{{ t('studio.artTitle') }}</h1>
    <p class="mt-2 max-w-2xl text-sm text-muted">{{ t('studio.artLead') }}</p>

    <p v-if="messageKey === 'saved'" class="mt-4 text-sm text-muted" role="status">{{ t('studio.saved') }}</p>
    <p v-else-if="messageKey === 'uploadTooLarge'" class="mt-4 text-sm text-accent" role="alert">{{ t('studio.uploadTooLarge') }}</p>
    <p v-else-if="messageKey === 'uploadQuota'" class="mt-4 text-sm text-accent" role="alert">{{ t('studio.uploadQuota') }}</p>
    <p v-else-if="messageKey === 'failed'" class="mt-4 text-sm text-accent" role="alert">{{ t('studio.uploadFailed') }}</p>
    <p v-else-if="status === 'pending'" class="mt-4 text-sm text-muted">{{ t('studio.loading') }}</p>
    <p v-else-if="error" class="mt-4 text-sm text-accent" role="alert">{{ t('studio.loadFailed') }}</p>

    <div v-else class="mt-8 space-y-10">
      <section>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="section-title text-lg">{{ t('studio.artAvatars') }}</h2>
          <label class="btn btn-ghost cursor-pointer">
            <span>{{ pendingTarget === 'avatars' ? t('studio.uploading') : t('studio.uploadAvatar') }}</span>
            <input class="sr-only" type="file" accept="image/*" :disabled="pendingTarget === 'avatars'" @change="upload('avatars', $event)">
          </label>
        </div>
        <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          <li v-for="avatar in data?.avatars || []" :key="avatar.slug" class="rounded-md border border-line bg-paper p-2">
            <img :src="avatar.image" alt="" class="aspect-square w-full object-cover" width="120" height="120">
            <p class="mt-2 truncate text-xs text-muted">{{ avatar.slug }}</p>
          </li>
        </ul>
        <p v-if="!(data?.avatars || []).length" class="mt-3 text-sm text-muted">{{ t('studio.artEmpty') }}</p>
      </section>

      <section>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="section-title text-lg">{{ t('studio.artCharacters') }}</h2>
          <label class="btn btn-ghost cursor-pointer">
            <span>{{ pendingTarget === 'characters' ? t('studio.uploading') : t('studio.uploadCharacter') }}</span>
            <input class="sr-only" type="file" accept="image/*" :disabled="pendingTarget === 'characters'" @change="upload('characters', $event)">
          </label>
        </div>
        <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          <li v-for="character in data?.characters || []" :key="character.slug" class="rounded-md border border-line bg-paper p-2">
            <img :src="character.image" alt="" class="aspect-square w-full object-cover" width="120" height="120">
            <p class="mt-2 truncate text-xs text-muted">{{ character.slug }}</p>
          </li>
        </ul>
        <p v-if="!(data?.characters || []).length" class="mt-3 text-sm text-muted">{{ t('studio.artEmpty') }}</p>
      </section>
    </div>
  </section>
</template>
