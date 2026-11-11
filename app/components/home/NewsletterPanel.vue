<script setup lang="ts">
const { t } = useShopI18n()
const name = ref('')
const email = ref('')
const sent = ref(false)

function submit() {
  sent.value = true
  name.value = ''
  email.value = ''
}
</script>

<template>
  <section class="rounded-[2rem] bg-soft-pink px-6 py-10 text-on-soft sm:px-10" :aria-labelledby="'newsletter-title'">
    <h2 id="newsletter-title" class="text-center font-display text-3xl font-bold sm:text-4xl">
      {{ t('newsletter.title') }}
    </h2>
    <p class="mx-auto mt-3 max-w-xl text-center text-current/75">{{ t('newsletter.body') }}</p>
    <form class="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row" @submit.prevent="submit">
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
          :placeholder="t('newsletter.placeholder')"
        >
      </div>
      <button type="submit" class="btn btn-primary">{{ t('newsletter.submit') }}</button>
    </form>
    <p v-if="sent" class="mt-4 text-center font-bold" role="status">{{ t('newsletter.thanks') }}</p>
  </section>
</template>
