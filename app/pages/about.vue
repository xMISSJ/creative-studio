<script setup lang="ts">
const { t, brand, locale } = useShopI18n()
const studioDeskImage = usePublicAsset('/art/studio-desk.jpg')
usePageMeta('meta.aboutTitle', 'meta.aboutDescription')

const markXiao = brand.subtitle.at(0) ?? ''
const markYi = brand.subtitle.at(1) ?? ''
const showWordMeanings = computed(() => locale.value !== 'zh')
const markClass = computed(() =>
  locale.value === 'zh'
    ? 'font-bold text-ink'
    : 'font-about-mark text-[1.15em] leading-none text-ink',
)

const memoryWordMeanings = useMessageList('about.nameWords')
const memoryWordMarks = [
  { chars: '回忆', pinyin: 'huí yì' },
  { chars: '记忆', pinyin: 'jì yì' },
  { chars: '追忆', pinyin: 'zhuī yì' },
  { chars: '忆念', pinyin: 'yì niàn' },
  { chars: '怀忆', pinyin: 'huái yì' },
  { chars: '忆旧', pinyin: 'yì jiù' },
] as const

const memoryWords = computed(() =>
  memoryWordMarks.map((word, index) => ({
    ...word,
    meaning: memoryWordMeanings.value[index] ?? '',
  })),
)
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
          <p>{{ t('about.storyHidden') }}</p>
        </div>

        <div class="mt-14 border-t border-line pt-12 sm:mt-16 sm:pt-14">
          <h2 class="display-title text-3xl text-ink sm:text-4xl">{{ t('about.nameTitle') }}</h2>
          <div class="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            <i18n-t keypath="about.nameOrigin" tag="p" translate="no">
              <template #name>
                <span class="font-bold text-ink">{{ brand.name }}</span>
              </template>
              <template #subtitle>
                <span :class="markClass" lang="zh-Hans">{{ brand.subtitle }}</span>
              </template>
              <template #xiao>
                <span :class="markClass" lang="zh-Hans">{{ markXiao }}</span>
              </template>
              <template #yi>
                <span :class="markClass" lang="zh-Hans">{{ markYi }}</span>
              </template>
            </i18n-t>
            <i18n-t keypath="about.nameShorten" tag="p" translate="no">
              <template #yi>
                <span :class="markClass" lang="zh-Hans">{{ markYi }}</span>
              </template>
            </i18n-t>
            <ul
              class="space-y-3 rounded-md border border-line bg-paper px-5 py-5 sm:px-6"
              :class="showWordMeanings ? 'w-full' : 'w-fit max-w-full'"
              translate="no"
            >
              <li
                v-for="word in memoryWords"
                :key="word.chars"
                class="grid gap-1 text-base leading-snug sm:items-baseline sm:gap-4"
                :class="showWordMeanings
                  ? 'sm:grid-cols-[4.5rem_6.5rem_1fr]'
                  : 'grid-cols-[auto_auto] gap-x-5'"
              >
                <span :class="markClass" lang="zh-Hans">{{ word.chars }}</span>
                <span class="font-sans text-sm tracking-wide text-ink/70">{{ word.pinyin }}</span>
                <span v-if="showWordMeanings">{{ word.meaning }}</span>
              </li>
            </ul>
            <i18n-t keypath="about.nameDad" tag="p" translate="no">
              <template #yi>
                <span :class="markClass" lang="zh-Hans">{{ markYi }}</span>
              </template>
              <template #yiChar>
                <span :class="markClass" lang="zh-Hans">义</span>
              </template>
              <template #dadName>
                <span :class="markClass" lang="zh-Hans">孙义栋</span>
              </template>
            </i18n-t>
            <p>{{ t('about.nameMemo') }}</p>
            <i18n-t keypath="about.nameClose" tag="p" translate="no">
              <template #subtitle>
                <span :class="markClass" lang="zh-Hans">{{ brand.subtitle }}</span>
              </template>
              <template #name>
                <span class="font-bold text-ink">{{ brand.name }}</span>
              </template>
            </i18n-t>
          </div>
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
