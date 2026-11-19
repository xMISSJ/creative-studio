<script setup lang="ts">
definePageMeta({
  layout: false,
})

defineI18nRoute(false)

const { t } = useShopI18n()
usePageMeta('meta.studioLoginTitle', 'meta.studioLoginDescription', { robots: 'noindex, nofollow' })

const { data: session, refresh } = useAdminSession()
const password = ref('')
const showPassword = ref(false)
const errorKey = ref<'none' | 'wrong' | 'missing' | 'network'>('none')
const pending = ref(false)
const passwordId = 'studio-admin-password'
const errorId = 'studio-admin-password-error'

if (import.meta.client && session.value?.authenticated) {
  await navigateTo('/studio')
}

watch(session, (value) => {
  if (value?.authenticated) navigateTo('/studio')
})

async function onSubmit() {
  errorKey.value = 'none'
  if (!password.value) {
    errorKey.value = 'missing'
    return
  }
  pending.value = true
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    })
    password.value = ''
    await refresh()
    await navigateTo('/studio')
  } catch (error: unknown) {
    const status = typeof error === 'object' && error && 'statusCode' in error
      ? Number((error as { statusCode?: number }).statusCode)
      : 0
    errorKey.value = status === 401 ? 'wrong' : 'network'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-canvas px-4 py-12 text-ink">
    <section class="w-full max-w-md rounded-md border border-line bg-paper p-6 sm:p-8">
      <p class="text-xs font-bold tracking-[0.18em] text-accent uppercase">{{ t('studio.eyebrow') }}</p>
      <h1 class="display-title mt-2 text-3xl">{{ t('studio.loginTitle') }}</h1>
      <p class="mt-3 text-sm leading-relaxed text-muted">{{ t('studio.loginLead') }}</p>

      <p
        v-if="session && !session.configured"
        class="mt-4 rounded-md bg-lilac-soft px-3 py-2 text-sm text-on-soft"
        role="status"
      >
        {{ t('studio.notConfigured') }}
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="text-sm font-bold" :for="passwordId">{{ t('studio.passwordLabel') }}</label>
          <div class="relative mt-1">
            <input
              :id="passwordId"
              v-model="password"
              class="w-full rounded-md border border-line bg-canvas py-3 pr-12 pl-3 text-base"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :aria-invalid="errorKey !== 'none' ? 'true' : undefined"
              :aria-describedby="errorKey !== 'none' ? errorId : undefined"
            >
            <button
              type="button"
              class="icon-btn absolute top-1/2 right-1 -translate-y-1/2"
              :aria-label="showPassword ? t('studio.hidePassword') : t('studio.showPassword')"
              :aria-pressed="showPassword ? 'true' : 'false'"
              @click="showPassword = !showPassword"
            >
              <AppIcon :name="showPassword ? 'eyeOff' : 'eye'" />
            </button>
          </div>
          <p
            v-if="errorKey === 'missing'"
            :id="errorId"
            class="mt-2 text-sm text-accent"
            role="alert"
          >
            {{ t('studio.passwordMissing') }}
          </p>
          <p
            v-else-if="errorKey === 'wrong'"
            :id="errorId"
            class="mt-2 text-sm text-accent"
            role="alert"
          >
            {{ t('studio.passwordWrong') }}
          </p>
          <p
            v-else-if="errorKey === 'network'"
            :id="errorId"
            class="mt-2 text-sm text-accent"
            role="alert"
          >
            {{ t('studio.loginNetwork') }}
          </p>
        </div>

        <button type="submit" class="btn btn-primary w-full" :disabled="pending || (session && !session.configured)">
          {{ pending ? t('studio.loggingIn') : t('studio.loginSubmit') }}
        </button>
      </form>

      <div class="mt-6">
        <NuxtLinkLocale to="/" class="btn btn-ghost w-full">{{ t('studio.backToShop') }}</NuxtLinkLocale>
      </div>
    </section>
  </div>
</template>
