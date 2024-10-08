<script setup lang="ts"></script>

<template>
  <span class="marquee-content">
    <slot></slot>
  </span>
</template>

<style scoped>
.marquee-content {
  display: inline-flex;
  white-space: nowrap;
  animation: marquee 60s linear infinite;
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
