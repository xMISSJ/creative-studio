<script setup lang="ts">
const { t, locale, locales } = useShopI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const listId = 'locale-list-header'

/** Options come from `nuxt.config.ts` `i18n.locales`. Register new languages there. */
const localeList = computed(() =>
  locales.value.map((entry) => {
    if (typeof entry === 'string') {
      return { code: entry, language: entry, name: entry }
    }
    return {
      code: entry.code,
      language: entry.language ?? entry.code,
      name: entry.name ?? entry.code,
    }
  }),
)

const current = computed(() => localeList.value.find((entry) => entry.code === locale.value) ?? localeList.value[0])

const { locked } = useOverlay()
const { close } = useListbox({ open, root, trigger })

function toggle() {
  open.value = !open.value
}

async function choose(code: string) {
  close(false)
  trigger.value?.focus()
  if (code === locale.value) return
  const path = switchLocalePath(code)
  if (path) await router.push(path)
}

watch(() => locale.value, () => close(false))
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
      :aria-label="t('locale.label')"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="min-w-0 truncate">{{ current?.name }}</span>
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
      :aria-label="t('locale.label')"
      class="locale-menu absolute start-0 top-[calc(100%+0.4rem)] z-50 min-w-[13.5rem]"
    >
      <li v-for="entry in localeList" :key="entry.code" role="none">
        <button
          type="button"
          role="option"
          class="locale-option"
          :aria-selected="entry.code === locale"
          :lang="entry.language"
          @click="choose(entry.code)"
        >
          <span class="truncate">{{ entry.name }}</span>
          <span
            v-if="entry.code === locale"
            class="ms-auto size-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
