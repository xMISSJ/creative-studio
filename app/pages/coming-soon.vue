<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { t } = useShopI18n()
usePageMeta('meta.comingSoonTitle', 'meta.comingSoonDescription', { robots: 'noindex, nofollow' })

const { data: gate, refresh } = await useFetch<{ enabled: boolean, unlocked: boolean }>('/api/preview/status', {
  key: 'preview-gate-status',
})

if (gate.value && (!gate.value.enabled || gate.value.unlocked)) {
  await navigateTo('/')
}

const code = ref('')
const pending = ref(false)
const errorKey = ref<'none' | 'missing' | 'wrong' | 'network'>('none')
const codeId = 'preview-access-code'
const errorId = 'preview-access-error'

async function onSubmit() {
  errorKey.value = 'none'
  if (!code.value.trim()) {
    errorKey.value = 'missing'
    return
  }
  pending.value = true
  try {
    await $fetch('/api/preview/unlock', {
      method: 'POST',
      body: { code: code.value.trim() },
    })
    code.value = ''
    await refresh()
    await navigateTo('/')
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
  <div class="coming-soon relative flex min-h-dvh flex-col overflow-hidden bg-canvas text-ink">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,var(--lilac-glow),transparent_42%),radial-gradient(circle_at_85%_10%,var(--blush),transparent_36%),radial-gradient(circle_at_70%_80%,var(--sage),transparent_40%)] opacity-80" aria-hidden="true" />

    <main id="main" class="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-12 sm:px-8">
      <div class="rounded-md border border-line bg-paper/95 p-6 shadow-[0_18px_40px_-28px_rgba(58,51,72,0.45)] sm:p-9">
        <div class="flex justify-center">
          <AppLogo centered />
        </div>

        <p class="mt-8 text-center text-xs font-bold tracking-[0.18em] text-accent uppercase">
          {{ t('comingSoon.eyebrow') }}
        </p>
        <h1 class="display-title mt-2 text-center text-4xl sm:text-5xl">
          {{ t('comingSoon.title') }}
        </h1>
        <p class="mt-4 text-center text-base leading-relaxed text-muted">
          {{ t('comingSoon.lead') }}
        </p>

        <section class="mt-8 rounded-md border border-line bg-lilac-mist/70 p-5 text-on-soft sm:p-6" aria-labelledby="preview-look-title">
          <h2 id="preview-look-title" class="font-display text-2xl leading-none text-ink sm:text-3xl">
            {{ t('comingSoon.lookTitle') }}
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            {{ t('comingSoon.lookLead') }}
          </p>

          <form class="mt-5 space-y-3" @submit.prevent="onSubmit">
            <div>
              <label class="text-sm font-bold text-ink" :for="codeId">{{ t('comingSoon.codeLabel') }}</label>
              <input
                :id="codeId"
                v-model="code"
                class="mt-1 w-full rounded-md border border-line bg-paper px-3 py-3 text-base text-ink"
                type="password"
                autocomplete="off"
                spellcheck="false"
                :aria-invalid="errorKey !== 'none' ? 'true' : undefined"
                :aria-describedby="errorKey !== 'none' ? errorId : undefined"
              >
              <p
                v-if="errorKey === 'missing'"
                :id="errorId"
                class="mt-2 text-sm text-accent"
                role="alert"
              >
                {{ t('comingSoon.codeMissing') }}
              </p>
              <p
                v-else-if="errorKey === 'wrong'"
                :id="errorId"
                class="mt-2 text-sm text-accent"
                role="alert"
              >
                {{ t('comingSoon.codeWrong') }}
              </p>
              <p
                v-else-if="errorKey === 'network'"
                :id="errorId"
                class="mt-2 text-sm text-accent"
                role="alert"
              >
                {{ t('comingSoon.codeNetwork') }}
              </p>
            </div>

            <button type="submit" class="btn btn-primary w-full" :disabled="pending">
              {{ pending ? t('comingSoon.checking') : t('comingSoon.submit') }}
            </button>
          </form>
        </section>

        <p class="mt-6 text-center text-sm text-muted">
          {{ t('comingSoon.footer') }}
        </p>
      </div>
    </main>
  </div>
</template>
