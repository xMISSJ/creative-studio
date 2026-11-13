<script setup lang="ts">
const { t } = useShopI18n()
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
  <section class="rounded-md bg-soft-pink px-6 py-10 text-on-soft sm:px-10" aria-labelledby="newsletter-title">
    <h2 id="newsletter-title" class="display-title text-center text-3xl sm:text-4xl">
      {{ t('newsletter.title') }}
    </h2>
    <p class="mx-auto mt-3 max-w-xl text-center text-current/75">{{ t('newsletter.body') }}</p>
    <form class="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap" novalidate @submit.prevent="submit">
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
  </section>
</template>
