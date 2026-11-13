<script setup lang="ts">
const butterfly = usePublicAsset('/art/butterfly.png')
</script>

<template>
  <img
    :src="butterfly"
    alt=""
    width="173"
    height="137"
    class="pointer-events-none absolute bottom-[78%] left-1/2 w-[0.64em] max-w-none -translate-x-[calc(50%-7px)] select-none"
    decoding="async"
    aria-hidden="true"
  >
</template>
