<script setup lang="ts">
export type AppListboxOption = {
  value: string
  label: string
  lang?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: AppListboxOption[]
    /** Accessible name when there is no visible labelledBy */
    label?: string
    labelledBy?: string
    listId: string
    triggerClass?: string
    menuClass?: string
  }>(),
  {
    label: undefined,
    labelledBy: undefined,
    triggerClass: '',
    menuClass: 'min-w-[13.5rem]',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)

const { locked } = useOverlay()
const { close } = useListbox({ open, root, trigger })

const current = computed(
  () => props.options.find((entry) => entry.value === props.modelValue) ?? props.options[0],
)

function toggle() {
  open.value = !open.value
}

function choose(value: string) {
  close(false)
  trigger.value?.focus()
  if (value !== props.modelValue) emit('update:modelValue', value)
}

watch(() => props.modelValue, () => close(false))
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
      :class="triggerClass"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-label="labelledBy ? undefined : label"
      :aria-labelledby="labelledBy"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <slot name="trigger" :option="current">
        <span class="min-w-0 flex-1 truncate text-start">{{ current?.label }}</span>
      </slot>
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
      :aria-label="labelledBy ? undefined : label"
      :aria-labelledby="labelledBy"
      class="locale-menu absolute start-0 top-[calc(100%+0.4rem)] z-50"
      :class="menuClass"
    >
      <li v-for="entry in options" :key="entry.value" role="none">
        <button
          type="button"
          role="option"
          class="locale-option"
          :aria-selected="entry.value === modelValue"
          :lang="entry.lang"
          @click="choose(entry.value)"
        >
          <slot name="option" :option="entry" :selected="entry.value === modelValue">
            <span class="truncate">{{ entry.label }}</span>
            <span
              v-if="entry.value === modelValue"
              class="ms-auto size-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
          </slot>
        </button>
      </li>
    </ul>
  </div>
</template>
