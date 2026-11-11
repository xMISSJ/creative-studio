<script setup lang="ts">
import { digitalArtCharacterGroups } from '#shared/catalog'

const { t } = useShopI18n()
const { activeDigitalCategory } = useShopBrowse()
const { data } = await useDigitalArt()

const showingAvatars = computed(() => activeDigitalCategory.value === 'avatars')
const showingCharacterArt = computed(() => activeDigitalCategory.value === 'character-art')

const avatars = computed(() =>
  [...(data.value?.avatars ?? [])].sort((a, b) => a.sort - b.sort),
)

const characterGroups = computed(() =>
  digitalArtCharacterGroups.map((group) => ({
    ...group,
    items: (data.value?.characters ?? [])
      .filter((entry) => entry.group === group.slug)
      .slice()
      .sort((a, b) => a.sort - b.sort),
  })),
)
</script>

<template>
  <div class="flex flex-col gap-10">
    <ShopDigitalArtCategories />

    <section
      v-if="showingAvatars"
      :aria-label="t('digitalArt.categories.avatars.title')"
    >
      <p v-if="!avatars.length" class="text-muted">
        {{ t('shop.digitalArt.avatarsEmpty') }}
      </p>
      <ul v-else class="grid list-none grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        <li
          v-for="(avatar, index) in avatars"
          :key="avatar.slug"
          class="rise"
          :class="index === 0 ? 'delay-1' : index === 1 ? 'delay-2' : index === 2 ? 'delay-3' : ''"
        >
          <div class="mat overflow-hidden rounded-[1rem] bg-lilac-mist">
            <img
              :src="avatar.image"
              alt=""
              width="400"
              height="400"
              class="aspect-square w-full object-contain"
              loading="lazy"
            >
          </div>
        </li>
      </ul>
    </section>

    <section
      v-else-if="showingCharacterArt"
      class="flex flex-col gap-12"
      :aria-label="t('digitalArt.categories.character-art.title')"
    >
      <div
        v-for="group in characterGroups"
        :key="group.slug"
        class="flex flex-col gap-6"
      >
        <div>
          <h2 class="font-display text-xl font-bold text-ink sm:text-2xl">
            {{ t(`digitalArt.characterGroups.${group.slug}.title`) }}
          </h2>
          <p class="mt-2 max-w-2xl text-muted">{{ t(`digitalArt.characterGroups.${group.slug}.summary`) }}</p>
        </div>

        <p v-if="!group.items.length" class="text-muted">
          {{ t('shop.digitalArt.charactersEmpty') }}
        </p>
        <ul v-else class="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="(piece, index) in group.items"
            :key="piece.slug"
            class="rise"
            :class="index === 0 ? 'delay-1' : index === 1 ? 'delay-2' : index === 2 ? 'delay-3' : ''"
          >
            <div class="mat overflow-hidden rounded-[1.2rem] bg-lilac-mist/30">
              <img
                :src="piece.image"
                alt=""
                width="1024"
                height="1024"
                class="aspect-square w-full object-cover"
                loading="lazy"
              >
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
