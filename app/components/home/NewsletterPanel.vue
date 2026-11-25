<script setup lang="ts">
const { t } = useShopI18n()
const art = usePublicAsset('/art/seagull-contact.png')
const name = ref('')
const email = ref('')
const sent = ref(false)
const attempted = ref(false)

const emailError = computed(() => {
  if (!attempted.value) return ''
  if (!email.value.trim()) return t('newsletter.emailError')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return t('newsletter.emailInvalid')
  return ''
})

function submit() {
  attempted.value = true
  if (emailError.value) return
  sent.value = true
  name.value = ''
  email.value = ''
  attempted.value = false
}
</script>

<template>
  <section
    class="newsletter-panel relative z-10 overflow-visible rounded-md bg-soft-pink px-6 pt-32 pb-10 text-on-soft sm:px-10 sm:pt-36 sm:pb-12"
    aria-labelledby="newsletter-title"
  >
    <img
      class="pointer-events-none absolute top-0 left-1/2 z-20 w-60 -translate-x-1/2 -translate-y-[42%] object-contain sm:w-64 md:w-72"
      :src="art"
      :alt="t('newsletter.artAlt')"
      width="919"
      height="653"
      decoding="async"
      loading="lazy"
    >

    <div class="relative z-10 text-center">
      <h2 id="newsletter-title" class="display-title text-3xl sm:text-4xl">
        {{ t('newsletter.title') }}
      </h2>
      <p class="mx-auto mt-3 max-w-xl text-current/75">{{ t('newsletter.body') }}</p>
      <form class="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center" novalidate @submit.prevent="submit">
        <div class="min-w-0 flex-1">
          <label class="sr-only" for="newsletter-name">{{ t('newsletter.nameLabel') }}</label>
          <input
            id="newsletter-name"
            v-model="name"
            class="field"
            type="text"
            name="name"
            autocomplete="name"
            :placeholder="t('newsletter.namePlaceholder')"
          >
        </div>
        <div class="min-w-0 flex-1">
          <label class="sr-only" for="newsletter-email">{{ t('newsletter.emailLabel') }}</label>
          <input
            id="newsletter-email"
            v-model="email"
            class="field"
            type="email"
            name="email"
            autocomplete="email"
            required
            :aria-invalid="emailError ? true : undefined"
            :aria-describedby="emailError ? 'newsletter-email-error' : undefined"
            :placeholder="t('newsletter.placeholder')"
          >
        </div>
        <button type="submit" class="btn btn-primary">{{ t('newsletter.submit') }}</button>
        <p
          v-if="emailError"
          id="newsletter-email-error"
          class="basis-full text-center text-sm font-bold text-warn"
          role="alert"
        >
          {{ emailError }}
        </p>
      </form>
      <p v-if="sent" class="mt-4 text-center font-bold" role="status">{{ t('newsletter.thanks') }}</p>
    </div>
  </section>
</template>
