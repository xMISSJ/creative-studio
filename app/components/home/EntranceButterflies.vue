<script setup lang="ts">
/**
 * Single perched butterfly for the entrance brand "o".
 * Flap: the near wing folds in farther than the far wing.
 */
</script>

<template>
  <span class="entrance-butterfly" aria-hidden="true">
    <svg class="entrance-butterfly-defs" aria-hidden="true" focusable="false">
      <defs>
        <g id="entrance-butterfly-wing">
          <path
            d="M2.2 28.4C8.4 42.6 14.1 36.5 20.2 56.8c4.5 14.9 11.5 19.3 23.3 17.6-7.5 5.1-10.2 13.1-2.1 27.1 9.6 16.6 26.4 29.1 34.8 30.8 8.5 1.7 17.7-5.8 19.7-16.5 2-10.7 2.9-11.9 10.2-45.5V58.1v-7.2S66.4 16.5 39.7 12.4C14.5 8.7-2.1 14.2 2.2 28.4Z"
          />
        </g>
      </defs>
    </svg>

    <span class="entrance-butterfly-tilt">
      <span class="entrance-butterfly-figure">
        <svg
          class="entrance-butterfly__wing entrance-butterfly__wing--left"
          viewBox="0 0 120 149"
          focusable="false"
        >
          <use href="#entrance-butterfly-wing" transform="translate(10 0)" />
        </svg>
        <svg
          class="entrance-butterfly__wing entrance-butterfly__wing--right"
          viewBox="0 0 120 149"
          focusable="false"
        >
          <use href="#entrance-butterfly-wing" transform="translate(10 0)" />
        </svg>
        <!-- Square viewBox so the body is not stretched. Thorax sits on the wing hinge. -->
        <svg
          class="entrance-butterfly__body"
          viewBox="0 0 149 149"
          focusable="false"
        >
          <path d="M74.5 56c4.6 1.4 6.8 7 6.4 16-.5 14-2.6 32-6.4 40-3.8-8-5.9-26-6.4-40-.4-9 1.8-14.6 6.4-16Z" />
          <g class="entrance-butterfly__antenna entrance-butterfly__antenna--left">
            <path
              d="M71.5 58C64 46 55 34 46 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.1"
              stroke-linecap="round"
            />
          </g>
          <g class="entrance-butterfly__antenna entrance-butterfly__antenna--right">
            <path
              d="M77.5 58C85 46 94 34 103 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.1"
              stroke-linecap="round"
            />
          </g>
        </svg>
      </span>
    </span>
  </span>
</template>
