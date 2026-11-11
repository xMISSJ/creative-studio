<script setup lang="ts">
const colorMode = useColorMode()
const { t } = useShopI18n()

const isDark = computed(() => colorMode.preference === 'dark' || colorMode.value === 'dark')

const label = computed(() => (isDark.value ? t('theme.toLight') : t('theme.toDark')))
const icon = computed(() => (isDark.value ? 'moon' : 'sun'))

function cycle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button type="button" class="icon-btn" :aria-label="label" @click="cycle">
    <AppIcon :name="icon" />
  </button>
</template>
