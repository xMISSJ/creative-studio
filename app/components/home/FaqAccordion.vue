<script setup lang="ts">
withDefaults(defineProps<{
  items: Array<{ id: string, q: string, a: string }>
  numbered?: boolean
}>(), {
  numbered: true,
})
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
        <span class="faq-mark text-accent" aria-hidden="true">
          <AppIcon name="heart" class="faq-heart faq-heart-outline" />
          <AppIcon name="heart" filled class="faq-heart faq-heart-filled" />
        </span>
      </summary>
      <div class="faq-answer">
        <p class="pb-4 text-muted">{{ item.a }}</p>
      </div>
    </details>
  </div>
</template>
