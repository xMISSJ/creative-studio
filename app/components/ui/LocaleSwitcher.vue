<script setup lang="ts">
const props = defineProps<{
  variant?: 'header' | 'menu'
}>()

const { t, locale, locales } = useShopI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const listId = computed(() => (props.variant === 'menu' ? 'locale-list-menu' : 'locale-list-header'))

const flags: Record<string, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
  es: '🇪🇸',
  zh: '🇨🇳',
  ko: '🇰🇷',
  ja: '🇯🇵',
}

const localeList = computed(() =>
  locales.value.map((entry) => {
    if (typeof entry === 'string') {
      return { code: entry, language: entry, name: entry, flag: flags[entry] ?? '🌐' }
    }
    return {
      code: entry.code,
      language: entry.language ?? entry.code,
      name: entry.name ?? entry.code,
      flag: flags[entry.code] ?? '🌐',
    }
  }),
)

const current = computed(() => localeList.value.find((entry) => entry.code === locale.value) ?? localeList.value[0])

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

async function choose(code: string) {
  close()
  if (code === locale.value) return
  const path = switchLocalePath(code)
  if (path) await router.push(path)
}

function onDocPointer(event: PointerEvent) {
  if (!open.value || !root.value) return
  if (!root.value.contains(event.target as Node)) close()
}

function onKey(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer)
  document.removeEventListener('keydown', onKey)
})

watch(() => locale.value, close)
</script>

<template>
  <div
    ref="root"
    class="relative"
    :class="variant === 'menu' ? 'w-full' : 'hidden sm:block'"
  >
    <button
      type="button"
      class="locale-trigger"
      :class="variant === 'menu' ? 'w-full justify-between' : ''"
      :aria-expanded="open"
      :aria-controls="listId"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="flex min-w-0 items-center gap-2">
        <span class="locale-flag" aria-hidden="true">{{ current?.flag }}</span>
        <span class="truncate">{{ current?.name }}</span>
      </span>
      <span
        class="inline-flex shrink-0 text-muted transition"
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
      class="locale-menu"
      :class="variant === 'menu' ? 'relative mt-2 w-full' : 'absolute start-0 top-[calc(100%+0.4rem)] z-50 min-w-[13.5rem]'"
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
          <span class="locale-flag" aria-hidden="true">{{ entry.flag }}</span>
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
