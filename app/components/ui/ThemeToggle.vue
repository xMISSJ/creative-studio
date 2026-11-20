<script setup lang="ts">
const colorMode = useColorMode()
const { t } = useShopI18n()

type ThemePreference = 'system' | 'light' | 'dark'

const preference = computed<ThemePreference>(() => {
  const value = colorMode.preference
  if (value === 'dark' || value === 'light' || value === 'system') return value
  return 'system'
})

const nextPreference = computed<ThemePreference>(() => {
  if (preference.value === 'system') return 'light'
  if (preference.value === 'light') return 'dark'
  return 'system'
})

const label = computed(() => {
  if (nextPreference.value === 'light') return t('theme.toLight')
  if (nextPreference.value === 'dark') return t('theme.toDark')
  return t('theme.toSystem')
})

const icon = computed(() => {
  if (preference.value === 'system') return 'monitor'
  if (preference.value === 'dark') return 'moon'
  return 'sun'
})

function cycle() {
  colorMode.preference = nextPreference.value
}
</script>

<template>
  <button type="button" class="icon-btn" :aria-label="label" @click="cycle">
    <AppIcon :name="icon" />
  </button>
</template>
