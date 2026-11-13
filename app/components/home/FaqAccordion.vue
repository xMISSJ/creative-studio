<script setup lang="ts">
withDefaults(defineProps<{
  items: Array<{ id: string, q: string, a: string }>
  numbered?: boolean
}>(), {
  numbered: true,
})

const butterfly = usePublicAsset('/art/butterfly.png')
</script>

<template>
  <div class="faq-list">
    <details
      v-for="(item, index) in items"
      :key="item.id"
      class="faq-item"
    >
      <summary>
        <span>{{ numbered ? `${index + 1}. ` : '' }}{{ item.q }}</span>
        <span class="faq-mark" aria-hidden="true">
          <img
            :src="butterfly"
            alt=""
            width="173"
            height="137"
            class="faq-butterfly"
            decoding="async"
          >
        </span>
      </summary>
      <div class="faq-answer">
        <p class="pb-4 text-muted">{{ item.a }}</p>
      </div>
    </details>
  </div>
</template>
