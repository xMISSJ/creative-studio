<script setup lang="ts">
const { t } = useShopI18n()
const { activeDigitalCategory } = useShopBrowse()
const { data } = await useDigitalArt()

const showingAvatars = computed(() => activeDigitalCategory.value === 'avatars')
const showingCharacterArt = computed(() => activeDigitalCategory.value === 'character-art')

const avatars = computed(() =>
  [...(data.value?.avatars ?? [])].sort((a, b) => a.sort - b.sort),
)

const characters = computed(() =>
  [...(data.value?.characters ?? [])].sort((a, b) => a.sort - b.sort),
)
</script>

<template>
  <div class="flex flex-col gap-8">
    <ShopDigitalArtCategories />

    <section
      v-if="showingAvatars"
      :aria-label="t('digitalArt.categories.avatars.title')"
    >
      <p v-if="!avatars.length" class="text-muted">
        {{ t('shop.digitalArt.avatarsEmpty') }}
      </p>
      <AvatarClothesline v-else :avatars="avatars" />
    </section>

    <section
      v-else-if="showingCharacterArt"
      :aria-label="t('digitalArt.categories.character-art.title')"
    >
      <p v-if="!characters.length" class="text-muted">
        {{ t('shop.digitalArt.charactersEmpty') }}
      </p>
      <ul
        v-else
        class="grid list-none grid-cols-1 gap-3 sm:gap-4"
        :class="characters.length === 1
          ? 'max-w-xl'
          : characters.length === 2
            ? 'sm:grid-cols-2'
            : 'sm:grid-cols-2 lg:grid-cols-3'"
      >
        <li
          v-for="(piece, index) in characters"
          :key="piece.slug"
          class="group rise"
          :class="index === 0 ? 'delay-1' : index === 1 ? 'delay-2' : index === 2 ? 'delay-3' : ''"
        >
          <div class="gallery-mat lift overflow-hidden">
            <img
              :src="piece.image"
              alt=""
              width="1024"
              height="1024"
              class="aspect-square w-full scale-[1.08] object-cover"
              loading="lazy"
            >
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
