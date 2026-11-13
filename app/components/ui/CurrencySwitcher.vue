<script setup lang="ts">
const { t } = useShopI18n()
const { currencies, currency, current, setCurrency } = useCurrency()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const listId = 'currency-list-header'

const { locked } = useOverlay()
const { close } = useListbox({ open, root, trigger })

function toggle() {
  open.value = !open.value
}

function choose(code: string) {
  close(false)
  trigger.value?.focus()
  setCurrency(code)
}

watch(currency, () => close(false))
watch(locked, (value) => {
  if (value) close(false)
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      ref="trigger"
      type="button"
      class="locale-trigger"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-label="t('currency.label')"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="min-w-0 truncate" aria-hidden="true">{{ current.symbol }}</span>
      <span class="min-w-0 truncate">{{ current.code }}</span>
      <span
        class="shrink-0 text-muted transition"
        :class="open ? 'rotate-180' : ''"
        aria-hidden="true"
      >
        <AppIcon name="chevronDown" />
      </span>
    </button>

    <ul
      v-show="open"
      :id="listId"
      role="listbox"
      :aria-label="t('currency.label')"
      class="locale-menu absolute start-0 top-[calc(100%+0.4rem)] z-50 min-w-[9.5rem]"
    >
      <li v-for="entry in currencies" :key="entry.code" role="none">
        <button
          type="button"
          role="option"
          class="locale-option"
          :aria-selected="entry.code === currency"
          @click="choose(entry.code)"
        >
          <span class="w-5 shrink-0 text-center tabular-nums" aria-hidden="true">{{ entry.symbol }}</span>
          <span class="truncate">{{ entry.code }}</span>
          <span
            v-if="entry.code === currency"
            class="ms-auto size-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
