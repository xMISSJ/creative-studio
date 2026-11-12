<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: 'moon' | 'cart' | 'user' | 'sun' | 'monitor' | 'close' | 'heart' | 'play' | 'chevron' | 'chevronDown'
  filled?: boolean
}>(), {
  filled: false,
})

const viewBox = computed(() => (props.name === 'heart' ? '0 0 64 64' : '0 0 24 24'))

const heartOutline = 'M31.024 18.847c-.255-.298 3.357-3.638 3.733-3.954a18.2 18.2 0 0 1 15.564-4.028 8.88 8.88 0 0 1 6.92 6.148c1.53 5.463-2.499 11.7-6.04 15.515-3.141 3.385-6.834 6.212-9.697 9.835a31.4 31.4 0 0 0-5.309 8.301 7.3 7.3 0 0 1-1.185 2.28c-1.03 1.083-3.26.43-4.311-.324-1.385-.994-2.012-2.971-3.088-4.281a20.7 20.7 0 0 0-3.753-3.481c-5.916-4.524-15.085-6.232-16.817-14.575-1.985-7.8.788-15.307 9.02-17.535 5.615-1.477 11.361 1.986 14.963 6.1m1.374 25.751c3.48-8.434 12.704-12.252 17.515-19.736 1.106-1.72 2.505-4.458 1.267-6.457-1.256-2.027-4.62-2.334-6.743-2.107a12.5 12.5 0 0 0-8.043 4.746c-1.379 1.687-2.11 3.716-3.675 5.292a2.56 2.56 0 0 1-2.036.928c-1.876.035-2.95-1.29-3.802-2.796a27.5 27.5 0 0 0-4.19-5.09c-3.077-2.793-7.28-.94-9.195 2.24a9.04 9.04 0 0 0 .653 10.262 13.1 13.1 0 0 0 3.968 2.988 83 83 0 0 1 7.57 4.28 39 39 0 0 1 3.538 2.603c1.094.91 1.997 2.034 3.173 2.847'
const heartFilled = 'M31.024 18.847c-.255-.298 3.357-3.638 3.733-3.954a18.2 18.2 0 0 1 15.564-4.028 8.88 8.88 0 0 1 6.92 6.148c1.53 5.463-2.499 11.7-6.04 15.515-3.141 3.385-6.834 6.212-9.697 9.835a31.4 31.4 0 0 0-5.309 8.301 7.3 7.3 0 0 1-1.185 2.28c-1.03 1.083-3.26.43-4.311-.324-1.385-.994-2.012-2.971-3.088-4.281a20.7 20.7 0 0 0-3.753-3.481c-5.916-4.524-15.085-6.232-16.817-14.575-1.985-7.8.788-15.307 9.02-17.535 5.615-1.477 11.361 1.986 14.963 6.1'
</script>

<template>
  <svg
    :viewBox="viewBox"
    class="size-5"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="name === 'moon'" d="M16 3.5A8.5 8.5 0 1 0 20.5 15 6.5 6.5 0 0 1 16 3.5z" />
    <path v-else-if="name === 'cart'" d="M5 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 7z" />
    <path v-if="name === 'cart'" d="M8 7 9.2 4.5A1 1 0 0 1 10.1 4h3.8a1 1 0 0 1 .9.5L16 7M9 20.5h.1M16 20.5h.1" />
    <path v-else-if="name === 'user'" d="M12 12a3.2 3.2 0 1 0-3.2-3.2A3.2 3.2 0 0 0 12 12zm-6.2 7.2a6.2 6.2 0 0 1 12.4 0" />
    <path v-else-if="name === 'sun'" d="M12 8.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2zM12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1" />
    <path v-else-if="name === 'monitor'" d="M4 5.5h16v10H4zM8 19.5h8M12 15.5v4" />
    <path v-else-if="name === 'close'" d="M6 6l12 12M18 6 6 18" />
    <path
      v-else-if="name === 'heart' && filled"
      :d="heartFilled"
      fill="currentColor"
      stroke="none"
    />
    <path
      v-else-if="name === 'heart'"
      fill-rule="evenodd"
      clip-rule="evenodd"
      :d="heartOutline"
      fill="currentColor"
      stroke="none"
    />
    <path v-else-if="name === 'play'" d="M9 7.5v9l8-4.5z" fill="currentColor" stroke="none" />
    <path v-else-if="name === 'chevron'" d="M9 6l6 6-6 6" />
    <path v-else-if="name === 'chevronDown'" d="M6 9l6 6 6-6" />
  </svg>
</template>
