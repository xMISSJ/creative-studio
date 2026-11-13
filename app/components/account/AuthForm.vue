<script setup lang="ts">
const props = defineProps<{
  mode: 'login' | 'register'
}>()

const { t } = useShopI18n()
const name = ref('')
const email = ref('')
const password = ref('')
const sent = ref(false)
const attempted = ref(false)

const isRegister = computed(() => props.mode === 'register')

const nameError = computed(() => {
  if (!attempted.value || !isRegister.value) return ''
  return name.value.trim() ? '' : t('auth.nameError')
})

const emailError = computed(() => {
  if (!attempted.value) return ''
  if (!email.value.trim()) return t('auth.emailError')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) return t('auth.emailInvalid')
  return ''
})

const passwordError = computed(() => {
  if (!attempted.value) return ''
  if (!password.value) return t('auth.passwordError')
  if (password.value.length < 8) return t('auth.passwordShort')
  return ''
})

function submit() {
  attempted.value = true
  if (nameError.value || emailError.value || passwordError.value) return
  sent.value = true
  password.value = ''
  attempted.value = false
}
</script>

<template>
  <form class="panel mt-8 max-w-lg p-6 sm:p-8" novalidate @submit.prevent="submit">
    <p class="text-sm text-muted">{{ t('auth.notice') }}</p>
    <div v-if="isRegister" class="mt-5">
      <label class="mb-2 block font-bold" for="account-name">{{ t('auth.name') }}</label>
      <input
        id="account-name"
        v-model="name"
        class="field"
        name="name"
        autocomplete="name"
        required
        :aria-invalid="nameError ? true : undefined"
        :aria-describedby="nameError ? 'account-name-error' : undefined"
        :placeholder="t('auth.namePlaceholder')"
      >
      <p v-if="nameError" id="account-name-error" class="mt-2 text-sm font-bold text-warn" role="alert">
        {{ nameError }}
      </p>
    </div>
    <div class="mt-5">
      <label class="mb-2 block font-bold" for="account-email">{{ t('auth.email') }}</label>
      <input
        id="account-email"
        v-model="email"
        class="field"
        type="email"
        name="email"
        autocomplete="email"
        required
        :aria-invalid="emailError ? true : undefined"
        :aria-describedby="emailError ? 'account-email-error' : undefined"
        :placeholder="t('auth.emailPlaceholder')"
      >
      <p v-if="emailError" id="account-email-error" class="mt-2 text-sm font-bold text-warn" role="alert">
        {{ emailError }}
      </p>
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
        :aria-invalid="passwordError ? true : undefined"
        :aria-describedby="passwordError ? 'account-password-error' : undefined"
      >
      <p v-if="passwordError" id="account-password-error" class="mt-2 text-sm font-bold text-warn" role="alert">
        {{ passwordError }}
      </p>
    </div>
    <button type="submit" class="btn btn-primary mt-6">
      {{ isRegister ? t('auth.submitRegister') : t('auth.submitLogin') }}
    </button>
    <p v-if="sent" class="mt-4 font-bold" role="status">{{ t('auth.thanks') }}</p>
    <p class="mt-6">
      <NuxtLinkLocale v-if="isRegister" class="link link-hit" to="/login">{{ t('auth.switchToLogin') }}</NuxtLinkLocale>
      <NuxtLinkLocale v-else class="link link-hit" to="/register">{{ t('auth.switchToRegister') }}</NuxtLinkLocale>
    </p>
  </form>
</template>
