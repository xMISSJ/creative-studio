<script setup lang="ts">
const { t, tm, text, locale } = useShopI18n()
usePageMeta('meta.aboutTitle', 'meta.aboutDescription')
const materials = useMessageList('about.materials')

const steps = computed(() => {
  void locale.value
  const value = tm('about.steps')
  if (!Array.isArray(value)) return []
  return value.flatMap((step) => {
    if (!step || typeof step !== 'object' || !('title' in step) || !('body' in step)) return []
    return [{ title: text(step.title), body: text(step.body) }]
  })
})
</script>

<template>
  <article class="container-page py-12">
    <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <PageIntro :eyebrow="t('about.eyebrow')" :title="t('about.title')" :lead="t('about.lead')" />
      <div class="mat">
        <img src="/art/studio-desk.jpg" :alt="t('about.alt')" width="1340" height="900" class="aspect-[4/5] w-full rounded-[1.2rem] object-cover">
      </div>
    </div>
    <div class="mt-10 max-w-3xl space-y-4 text-lg">
      <p>{{ t('about.story') }}</p>
      <p>{{ t('about.storyGrief') }}</p>
      <p>{{ t('about.storyArt') }}</p>
      <p>{{ t('about.storyMore') }}</p>
    </div>
    <section class="mt-14" :aria-labelledby="'process-title'">
      <h2 id="process-title" class="font-display text-4xl">{{ t('about.processTitle') }}</h2>
      <ol class="mt-6 grid gap-4 sm:grid-cols-2">
        <li v-for="(step, index) in steps" :key="step.title" class="panel p-5">
          <p class="font-display text-3xl text-accent" aria-hidden="true">{{ index + 1 }}</p>
          <h3 class="mt-2 font-display text-2xl">{{ step.title }}</h3>
          <p class="mt-2 text-muted">{{ step.body }}</p>
        </li>
      </ol>
    </section>
    <section class="mt-14 max-w-3xl">
      <h2 class="font-display text-4xl">{{ t('about.materialsTitle') }}</h2>
      <ul class="mt-4 list-disc space-y-2 ps-5 text-muted">
        <li v-for="item in materials" :key="item">{{ item }}</li>
      </ul>
      <NuxtLinkLocale class="btn btn-primary mt-8" to="/shop">{{ t('about.shop') }}</NuxtLinkLocale>
    </section>
    <div class="mt-16">
      <NewsletterPanel />
    </div>
  </article>
</template>
