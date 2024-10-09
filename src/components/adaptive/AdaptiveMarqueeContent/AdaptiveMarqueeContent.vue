<script setup lang="ts"></script>

<template>
  <div class="marquee-container">
    <div class="marquee-content">
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
  animation: marquee 30s linear infinite;
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
