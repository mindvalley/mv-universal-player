<script setup lang="ts"></script>

<template>
  <div data-testid="adaptive-marquee-content" class="marquee-container">
    <div data-testid="marquee-content" class="marquee-content">
      <slot v-for="i in 10" :key="i"></slot>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  overflow: hidden;
  display: flex;
  width: 100%;
}

.marquee-content {
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
  animation: marquee 60s linear infinite;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
