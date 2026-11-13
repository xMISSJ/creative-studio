<script setup lang="ts">
const { t, locale, locales } = useShopI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

/** Options come from `nuxt.config.ts` `i18n.locales`. Register new languages there. */
const localeList = computed(() =>
  locales.value.map((entry) => {
    if (typeof entry === 'string') {
      return { value: entry, label: entry, lang: entry }
    }
    return {
      value: entry.code,
      label: entry.name ?? entry.code,
      lang: entry.language ?? entry.code,
    }
  }),
)

async function choose(code: string) {
  if (code === locale.value) return
  const path = switchLocalePath(code)
  if (path) await router.push(path)
}
</script>

<template>
  <AppListbox
    :model-value="locale"
    :options="localeList"
    :label="t('locale.label')"
    list-id="locale-list-header"
    menu-class="min-w-[13.5rem]"
    @update:model-value="choose"
  />
</template>
