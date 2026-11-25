<script setup lang="ts">
const { t, tm, text, locale } = useShopI18n()
usePageMeta('meta.termsTitle', 'meta.termsDescription')

const sections = computed(() => {
  void locale.value
  const raw = tm('terms.sections')
  if (!Array.isArray(raw)) return []

  return raw.map((entry) => {
    const section = entry as Record<string, unknown>
    const paragraphs = Array.isArray(section.paragraphs)
      ? section.paragraphs.map((item) => text(item)).filter(Boolean)
      : []
    const items = Array.isArray(section.items)
      ? section.items.map((item) => text(item)).filter(Boolean)
      : []
    return {
      title: text(section.title),
      paragraphs,
      items,
      after: section.after ? text(section.after) : '',
    }
  }).filter((section) => section.title)
})
</script>

<template>
  <article>
    <section class="bg-lilac-mist text-on-soft">
      <div class="container-page py-12 sm:py-16">
        <div class="rise">
          <PageIntro
            :eyebrow="t('terms.eyebrow')"
            :title="t('terms.title')"
            :lead="t('terms.lead')"
          />
          <p class="mt-4 text-sm opacity-80">{{ t('terms.updated') }}</p>
        </div>
      </div>
    </section>

    <section class="container-page py-12 sm:py-16" :aria-label="t('terms.title')">
      <div class="rise delay-1 mx-auto max-w-2xl space-y-10">
        <section
          v-for="(section, index) in sections"
          :key="`${index}-${section.title}`"
          class="space-y-3"
        >
          <h2 class="font-display text-2xl leading-none text-ink sm:text-3xl">
            {{ section.title }}
          </h2>
          <p
            v-for="(paragraph, paragraphIndex) in section.paragraphs"
            :key="paragraphIndex"
            class="text-base leading-relaxed text-muted"
          >
            {{ paragraph }}
          </p>
          <ul
            v-if="section.items.length"
            class="list-disc space-y-2 pl-5 text-base leading-relaxed text-muted"
          >
            <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
              {{ item }}
            </li>
          </ul>
          <p v-if="section.after" class="text-base leading-relaxed text-muted">
            {{ section.after }}
          </p>
        </section>

        <p class="text-sm text-muted">
          <NuxtLinkLocale class="font-bold text-accent underline-offset-4 hover:underline" to="/returns">
            {{ t('nav.returns') }}
          </NuxtLinkLocale>
        </p>
      </div>
    </section>
  </article>
</template>
