<script setup lang="ts"></script>

<template>
  <button
    data-testid="adaptive-about-this-info-set-duration-button"
    class="flex flex-row w-full py-3 px-2 text-teal-300 bg-white-8a hover:bg-white-18a border border-white-12a rounded-lg items-center justify-between"
  >
    <span data-testid="set-duration-icon" class="flex flex-row ml-2">
      <span><svg v-svg symbol="stopwatch-outlined" class="h-4 w-4"></svg></span
      ><span data-testid="set-duration-text" class="heading-9 ml-[6px] leading-4"
        >Set duration</span
      >
    </span>
    <span data-testid="set-duration-chevron">
      <svg v-svg symbol="chevron-right-outlined" class="h-4 w-4 text-white"></svg>
    </span>
  </button>
</template>
