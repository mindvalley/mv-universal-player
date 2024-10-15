<script setup lang="ts"></script>

<template>
  <button
    class="flex flex-row w-full py-3 px-2 text-teal-300 bg-white-12a border border-white-12a rounded-lg items-center justify-between"
  >
    <span class="flex flex-row ml-2">
      <span><svg v-svg symbol="stopwatch-outlined" class="h-4 w-4"></svg></span
      ><span class="title-9 ml-[6px]">Set duration</span>
    </span>
    <span>
      <svg v-svg symbol="chevron-right-outlined" class="h-4 w-4 text-white"></svg>
    </span>
  </button>
</template>
