<script setup>
// Section heading with red accent words: the string uses [brackets] to mark
// the accent — e.g. "Сайт — лише [видима частина]" (map in PAGE_SPEC).
const props = defineProps({
  text: { type: String, required: true },
  tag: { type: String, default: 'h2' }
})

const segments = computed(() => {
  const parts = []
  const re = /\[([^\]]+)\]/g
  let last = 0
  let m
  while ((m = re.exec(props.text)) !== null) {
    if (m.index > last) parts.push({ accent: false, text: props.text.slice(last, m.index) })
    parts.push({ accent: true, text: m[1] })
    last = re.lastIndex
  }
  if (last < props.text.length) parts.push({ accent: false, text: props.text.slice(last) })
  return parts
})
</script>

<template>
  <component :is="tag" class="section-title">
    <!-- the inner line is what mask-reveals slide (V2 P5); the component
         itself clips it, so every title is maskable via the .v2-mask class -->
    <span class="section-title__line">
      <template v-for="(seg, i) in segments" :key="i">
        <span v-if="seg.accent" class="section-title__accent">{{ seg.text }}</span>
        <template v-else>{{ seg.text }}</template>
      </template>
    </span>
  </component>
</template>

<style lang="scss" scoped>
.section-title {
  color: var(--color-text);
  overflow: hidden;

  &__line {
    display: block;
    // R3.1.6/R14: the mask must not shave glyphs at line-height 1 — SF Pro
    // descenders (p, g, y, р, у) reach ~0.21em below the baseline, so the
    // window reserves 0.25em under and 0.12em above (UA diacritics й, ї);
    // negative margins give the space back so layout metrics don't change
    padding: 0.12em 0 0.25em;
    margin: -0.12em 0 -0.25em;
  }

  &__accent {
    color: var(--color-accent);
    // акцент не должен рваться между строками («on / us»)
    white-space: nowrap;
  }
}
</style>
