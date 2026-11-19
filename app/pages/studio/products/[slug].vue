<script setup lang="ts">
import {
  badgeKeys,
  collections,
  productTypes,
  type BadgeKey,
  type CatalogItem,
  type CollectionSlug,
  type ProductTypeSlug,
} from '#shared/catalog'

definePageMeta({
  layout: 'studio',
  middleware: 'admin',
})

defineI18nRoute(false)

const { t } = useShopI18n()
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

usePageMetaValues(
  () => t('meta.studioProductEditTitle'),
  () => t('meta.studioProductEditDescription'),
  { robots: 'noindex, nofollow' },
)

const { data, refresh } = await useFetch('/api/admin/catalog', { key: 'admin-catalog' })

const item = computed(() => data.value?.items.find((entry: CatalogItem) => entry.slug === slug.value) ?? null)

const form = reactive({
  price: '',
  stock: '',
  collection: 'classic' as CollectionSlug,
  type: 'coloring-books' as ProductTypeSlug,
  featured: false,
  badge: '' as '' | BadgeKey,
  sort: '',
  image: '',
})

watch(item, (value) => {
  if (!value) return
  form.price = (value.price / 100).toFixed(2)
  form.stock = String(value.stock)
  form.collection = value.collection
  form.type = value.type
  form.featured = value.featured
  form.badge = value.badge || ''
  form.sort = String(value.sort)
  form.image = value.image
}, { immediate: true })

const pending = ref(false)
const uploadPending = ref(false)
const messageKey = ref<'none' | 'saved' | 'failed' | 'uploadFailed' | 'uploadTooLarge' | 'uploadQuota'>('none')

async function save() {
  if (!item.value) return
  pending.value = true
  messageKey.value = 'none'
  try {
    await $fetch(`/api/admin/catalog/${item.value.slug}`, {
      method: 'PUT',
      body: {
        price: Math.round(Number(form.price.replace(',', '.')) * 100),
        stock: Math.round(Number(form.stock)),
        collection: form.collection,
        type: form.type,
        featured: form.featured,
        badge: form.badge || '',
        sort: Math.round(Number(form.sort)),
        image: form.image,
      },
    })
    await refresh()
    messageKey.value = 'saved'
  } catch {
    messageKey.value = 'failed'
  } finally {
    pending.value = false
  }
}

async function onUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !item.value) return
  uploadPending.value = true
  messageKey.value = 'none'
  try {
    const body = new FormData()
    body.append('file', file)
    body.append('target', 'covers')
    const uploaded = await $fetch<{ path: string }>('/api/admin/upload', {
      method: 'POST',
      body,
    })
    form.image = uploaded.path
    await $fetch(`/api/admin/catalog/${item.value.slug}`, {
      method: 'PUT',
      body: { image: uploaded.path },
    })
    await refresh()
    messageKey.value = 'saved'
  } catch (error: unknown) {
    const status = typeof error === 'object' && error && 'statusCode' in error
      ? Number((error as { statusCode?: number }).statusCode)
      : 0
    if (status === 413) messageKey.value = 'uploadTooLarge'
    else if (status === 507) messageKey.value = 'uploadQuota'
    else messageKey.value = 'uploadFailed'
  } finally {
    uploadPending.value = false
    input.value = ''
  }
}
</script>

<template>
  <section v-if="item">
    <p class="text-sm">
      <NuxtLink to="/studio/products" class="font-bold text-accent">{{ t('studio.backToProducts') }}</NuxtLink>
    </p>
    <h1 class="display-title mt-3 text-3xl">{{ t(`products.${item.slug}.title`) }}</h1>
    <p class="mt-1 text-sm text-muted">{{ item.slug }}</p>

    <form class="mt-8 grid max-w-3xl gap-6 lg:grid-cols-[12rem_1fr]" @submit.prevent="save">
      <div>
        <img :src="form.image" alt="" class="aspect-square w-full rounded-md border border-line object-cover">
        <label class="btn btn-ghost mt-3 inline-flex w-full cursor-pointer justify-center">
          <span>{{ uploadPending ? t('studio.uploading') : t('studio.uploadCover') }}</span>
          <input class="sr-only" type="file" accept="image/*,.svg" :disabled="uploadPending" @change="onUpload">
        </label>
      </div>

      <div class="space-y-4 rounded-md border border-line bg-paper p-5">
        <div>
          <label class="text-sm font-bold" for="studio-price">{{ t('studio.col.price') }}</label>
          <input id="studio-price" v-model="form.price" class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3" type="number" min="0" step="0.01">
        </div>
        <div>
          <label class="text-sm font-bold" for="studio-stock">{{ t('studio.col.stock') }}</label>
          <input id="studio-stock" v-model="form.stock" class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3" type="number" min="0" step="1">
        </div>
        <div>
          <label class="text-sm font-bold" for="studio-collection">{{ t('studio.field.collection') }}</label>
          <select id="studio-collection" v-model="form.collection" class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3">
            <option v-for="entry in collections" :key="entry.slug" :value="entry.slug">
              {{ t(`collections.${entry.slug}.title`) }}
            </option>
          </select>
        </div>
        <div>
          <label class="text-sm font-bold" for="studio-type">{{ t('studio.field.type') }}</label>
          <select id="studio-type" v-model="form.type" class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3">
            <option v-for="entry in productTypes" :key="entry.slug" :value="entry.slug">
              {{ t(`productTypes.${entry.slug}.title`) }}
            </option>
          </select>
        </div>
        <div>
          <label class="text-sm font-bold" for="studio-badge">{{ t('studio.field.badge') }}</label>
          <select id="studio-badge" v-model="form.badge" class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3">
            <option value="">{{ t('studio.field.badgeNone') }}</option>
            <option v-for="badge in badgeKeys" :key="badge" :value="badge">
              {{ t(`badges.${badge}`) }}
            </option>
          </select>
        </div>
        <div>
          <label class="text-sm font-bold" for="studio-sort">{{ t('studio.field.sort') }}</label>
          <input id="studio-sort" v-model="form.sort" class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3" type="number" step="1">
        </div>
        <label class="flex items-center gap-3 text-sm font-bold">
          <input v-model="form.featured" type="checkbox" class="size-5">
          {{ t('studio.field.featured') }}
        </label>
        <div>
          <label class="text-sm font-bold" for="studio-image">{{ t('studio.field.imagePath') }}</label>
          <input id="studio-image" v-model="form.image" class="mt-1 w-full rounded-md border border-line bg-canvas px-3 py-3" type="text">
        </div>

        <p v-if="messageKey === 'saved'" class="text-sm text-muted" role="status">{{ t('studio.saved') }}</p>
        <p v-else-if="messageKey === 'failed'" class="text-sm text-accent" role="alert">{{ t('studio.saveFailed') }}</p>
        <p v-else-if="messageKey === 'uploadTooLarge'" class="text-sm text-accent" role="alert">{{ t('studio.uploadTooLarge') }}</p>
        <p v-else-if="messageKey === 'uploadQuota'" class="text-sm text-accent" role="alert">{{ t('studio.uploadQuota') }}</p>
        <p v-else-if="messageKey === 'uploadFailed'" class="text-sm text-accent" role="alert">{{ t('studio.uploadFailed') }}</p>

        <button type="submit" class="btn btn-primary" :disabled="pending">
          {{ pending ? t('studio.saving') : t('studio.save') }}
        </button>
      </div>
    </form>
  </section>

  <section v-else>
    <h1 class="display-title text-3xl">{{ t('studio.productMissing') }}</h1>
    <NuxtLink to="/studio/products" class="mt-4 inline-flex font-bold text-accent">{{ t('studio.backToProducts') }}</NuxtLink>
  </section>
</template>
