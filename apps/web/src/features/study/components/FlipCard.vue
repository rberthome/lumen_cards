<script setup lang="ts">
defineProps<{ flipped: boolean }>();
</script>

<template>
  <div class="flip relative min-h-60">
    <div class="flip-inner" :class="{ flipped }">
      <div class="flip-face"><slot name="front" /></div>
      <div class="flip-face flip-back"><slot name="back" /></div>
    </div>
  </div>
</template>

<style scoped>
.flip {
  perspective: 1200px;
}
.flip-inner {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.flip-inner.flipped {
  transform: rotateY(180deg);
}
.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.flip-back {
  transform: rotateY(180deg);
}
@media (prefers-reduced-motion: reduce) {
  .flip-inner { transition: none; }
}
</style>
