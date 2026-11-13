<script setup lang="ts">
defineProps<{
  centered?: boolean
}>()

const { brand } = useShopI18n()
const butterfly = usePublicAsset('/art/butterfly.png')

const nameParts = computed(() => {
  const name = brand.name
  const index = name.toLowerCase().indexOf('o')
  if (index === -1) {
    return { before: name, letter: '', after: '' }
  }
  return {
    before: name.slice(0, index),
    letter: name.slice(index, index + 1),
    after: name.slice(index + 1),
  }
})
</script>

<template>
  <NuxtLinkLocale
    to="/"
    class="relative inline-flex min-w-0 items-center justify-center overflow-visible rounded-full"
    :class="centered ? 'mx-auto' : ''"
    :aria-label="`${brand.name} ${brand.subtitle}`"
  >
    <span
      class="flex min-w-0 flex-col leading-none"
      :class="centered ? 'items-center text-center' : 'items-start text-start'"
      translate="no"
    >
      <span class="whitespace-nowrap font-logo text-[1.65rem] font-bold tracking-tight text-ink [word-spacing:-0.2em] sm:text-[1.85rem]">
        <template v-if="nameParts.letter">
          {{ nameParts.before }}<span class="relative inline-block">{{ nameParts.letter }}<img
            :src="butterfly"
            alt=""
            width="173"
            height="137"
            class="pointer-events-none absolute bottom-[68%] left-1/2 w-[0.64em] max-w-none -translate-x-[calc(50%-2px)] translate-y-[1px] select-none"
            decoding="async"
            aria-hidden="true"
          ></span>{{ nameParts.after }}
        </template>
        <template v-else>
          {{ brand.name }}
        </template>
      </span>
      <span
        class="font-about-mark -mt-1 text-[1.3rem] leading-none text-ink/80 sm:text-[1.45rem]"
        lang="zh-Hans"
      >
        {{ brand.subtitle }}
      </span>
    </span>
  </NuxtLinkLocale>
</template>
