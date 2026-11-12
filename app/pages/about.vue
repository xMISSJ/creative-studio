<script setup lang="ts">
const { t, brand } = useShopI18n()
const studioDeskImage = usePublicAsset('/art/studio-desk.jpg')
usePageMeta('meta.aboutTitle', 'meta.aboutDescription')

const markXiao = brand.subtitle.at(0) ?? ''
const markYi = brand.subtitle.at(1) ?? ''
</script>

<template>
  <article>
    <section class="bg-lilac text-on-soft">
      <div class="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <PageIntro :eyebrow="t('about.eyebrow')" :title="t('about.title')" :lead="t('about.lead')" />
        <div class="mat">
          <img :src="studioDeskImage" :alt="t('about.alt')" width="1340" height="900" class="aspect-[4/5] w-full rounded-md object-cover">
        </div>
      </div>
    </section>

    <section class="container-page py-14 sm:py-16">
      <div class="mx-auto max-w-2xl">
        <div class="space-y-5 text-lg leading-relaxed text-muted">
          <p>{{ t('about.story') }}</p>
          <p>{{ t('about.storyGrief') }}</p>
          <p>{{ t('about.storyArt') }}</p>
          <i18n-t keypath="about.storyName" tag="p" :name="brand.name">
            <template #subtitle>
              <span class="font-about-mark text-[1.45em] leading-none text-ink" lang="zh-Hans">{{ brand.subtitle }}</span>
            </template>
            <template #xiao>
              <span class="font-about-mark text-[1.45em] leading-none text-ink" lang="zh-Hans">{{ markXiao }}</span>
            </template>
            <template #yi>
              <span class="font-about-mark text-[1.45em] leading-none text-ink" lang="zh-Hans">{{ markYi }}</span>
            </template>
            <template #dadName>
              <span class="font-about-mark text-[1.45em] leading-none text-ink" lang="zh-Hans">孙义栋</span>
            </template>
          </i18n-t>
        </div>
        <div class="mt-10">
          <NuxtLinkLocale class="btn btn-primary" to="/shop">{{ t('about.shop') }}</NuxtLinkLocale>
        </div>
      </div>
      <div class="mt-16">
        <NewsletterPanel />
      </div>
    </section>
  </article>
</template>
