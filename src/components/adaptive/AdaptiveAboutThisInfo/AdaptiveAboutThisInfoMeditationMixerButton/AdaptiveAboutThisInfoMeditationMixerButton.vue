<script setup lang="ts">
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  trackTitle: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button
    class="flex flex-row w-full pl-4 pr-2 text-teal-300 bg-white-12a border border-white-12a rounded-lg items-center"
    :class="[isActive ? 'py-2' : 'py-3']"
  >
    <span class="flex items-center mr-2">
      <svg v-svg symbol="sliders-outlined" class="h-4 w-4"></svg>
    </span>
    <span v-if="!isActive" class="title-9 flex-grow text-start">Mixer available</span>
    <div v-else class="marquee flex-grow overflow-hidden">
      <div class="marquee-content">
        <span v-for="i in 10" :key="i" class="title-9">Mixing with {{ trackTitle }}</span>
      </div>
    </div>
    <span class="ml-2">
      <svg v-svg symbol="chevron-right-outlined" class="h-4 w-4 text-white"></svg>
    </span>
  </button>
</template>

<style scoped>
.marquee {
  width: calc(100% - 2rem); /* Adjust based on icon and arrow widths */
}

.marquee-content {
  display: inline-flex;
  white-space: nowrap;
  animation: marquee 35s linear infinite;
}

.marquee-content span {
  display: inline-block;
  padding-right: 50px; /* Space between repeated elements */
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
