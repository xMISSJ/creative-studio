<script setup lang="ts">
const { t } = useShopI18n()
const { currencies, currency, current, setCurrency } = useCurrency()

const options = computed(() =>
  currencies.map((entry) => ({
    value: entry.code,
    label: entry.code,
  })),
)

const symbolByCode = computed(() =>
  Object.fromEntries(currencies.map((entry) => [entry.code, entry.symbol])) as Record<string, string>,
)
</script>

<template>
  <AppListbox
    :model-value="currency"
    :options="options"
    :label="t('currency.label')"
    list-id="currency-list-header"
    menu-class="min-w-[9.5rem]"
    @update:model-value="setCurrency"
  >
    <template #trigger>
      <span class="min-w-0 truncate" aria-hidden="true">{{ current.symbol }}</span>
      <span class="min-w-0 truncate">{{ current.code }}</span>
    </template>
    <template #option="{ option, selected }">
      <span class="w-5 shrink-0 text-center tabular-nums" aria-hidden="true">
        {{ symbolByCode[option.value] }}
      </span>
      <span class="truncate">{{ option.label }}</span>
      <span
        v-if="selected"
        class="ms-auto size-1.5 rounded-full bg-accent"
        aria-hidden="true"
      />
    </template>
  </AppListbox>
</template>
