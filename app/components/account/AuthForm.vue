<script setup lang="ts">
const props = defineProps<{
  mode: 'login' | 'register'
}>()

const { t } = useShopI18n()
const name = ref('')
const email = ref('')
const password = ref('')
const sent = ref(false)

const isRegister = computed(() => props.mode === 'register')

function submit() {
  sent.value = true
  password.value = ''
}
</script>

<template>
  <form class="panel mt-8 max-w-lg p-6 sm:p-8" @submit.prevent="submit">
    <p class="text-sm text-muted">{{ t('auth.notice') }}</p>
    <div v-if="isRegister" class="mt-5">
      <label class="mb-2 block font-bold" for="account-name">{{ t('auth.name') }}</label>
      <input id="account-name" v-model="name" class="field" name="name" autocomplete="name" required :placeholder="t('auth.namePlaceholder')">
    </div>
    <div class="mt-5">
      <label class="mb-2 block font-bold" for="account-email">{{ t('auth.email') }}</label>
      <input id="account-email" v-model="email" class="field" type="email" name="email" autocomplete="email" required :placeholder="t('auth.emailPlaceholder')">
    </div>
    <div class="mt-5">
      <label class="mb-2 block font-bold" for="account-password">{{ t('auth.password') }}</label>
      <input
        id="account-password"
        v-model="password"
        class="field"
        type="password"
        name="password"
        :autocomplete="isRegister ? 'new-password' : 'current-password'"
        required
        minlength="8"
      >
    </div>
    <button type="submit" class="btn btn-primary mt-6">
      {{ isRegister ? t('auth.submitRegister') : t('auth.submitLogin') }}
    </button>
    <p v-if="sent" class="mt-4 font-bold" role="status">{{ t('auth.thanks') }}</p>
    <p class="mt-6">
      <NuxtLinkLocale v-if="isRegister" class="link" to="/login">{{ t('auth.switchToLogin') }}</NuxtLinkLocale>
      <NuxtLinkLocale v-else class="link" to="/register">{{ t('auth.switchToRegister') }}</NuxtLinkLocale>
    </p>
  </form>
</template>
