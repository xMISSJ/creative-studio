<script setup lang="ts">
defineProps<{
  name: 'moon' | 'cart' | 'user' | 'sun' | 'monitor' | 'menu' | 'close' | 'search' | 'heart' | 'play' | 'chevron' | 'chevronDown'
}>()
</script>

<template>
  <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-if="name === 'moon'" d="M16 3.5A8.5 8.5 0 1 0 20.5 15 6.5 6.5 0 0 1 16 3.5z" />
    <path v-else-if="name === 'cart'" d="M5 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 7z" />
    <path v-if="name === 'cart'" d="M8 7 9.2 4.5A1 1 0 0 1 10.1 4h3.8a1 1 0 0 1 .9.5L16 7M9 20.5h.1M16 20.5h.1" />
    <path v-else-if="name === 'user'" d="M12 12a3.2 3.2 0 1 0-3.2-3.2A3.2 3.2 0 0 0 12 12zm-6.2 7.2a6.2 6.2 0 0 1 12.4 0" />
    <path v-else-if="name === 'sun'" d="M12 8.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2zM12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1" />
    <path v-else-if="name === 'monitor'" d="M4 5.5h16v10H4zM8 19.5h8M12 15.5v4" />
    <path v-else-if="name === 'menu'" d="M4 7h16M4 12h16M4 17h16" />
    <path v-else-if="name === 'close'" d="M6 6l12 12M18 6 6 18" />
    <path v-else-if="name === 'search'" d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM20 20l-3.5-3.5" />
    <path v-else-if="name === 'heart'" d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 7.5a3.8 3.8 0 0 1 7 3.3C19 15.6 12 20 12 20z" />
    <path v-else-if="name === 'play'" d="M9 7.5v9l8-4.5z" fill="currentColor" stroke="none" />
    <path v-else-if="name === 'chevron'" d="M9 6l6 6-6 6" />
    <path v-else-if="name === 'chevronDown'" d="M6 9l6 6 6-6" />
  </svg>
</template>
