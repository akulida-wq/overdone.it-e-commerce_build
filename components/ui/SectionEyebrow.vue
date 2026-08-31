<script setup>
defineProps({
  // eyebrow labels stay in English in both locales (design element,
  // same as on the overdone.it homepage) — value still comes from locales
  label: { type: String, required: true }
})
</script>

<template>
  <p class="section-eyebrow">○ {{ label }}</p>
</template>

<style lang="scss" scoped>
.section-eyebrow {
  @include mono-caption;
}
</style>
