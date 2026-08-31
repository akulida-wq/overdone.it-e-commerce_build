<script setup>
// R9 — the S10 «We earn…» icons redrawn to match the customer's wireframe
// references (SVG icon example 1/2): isometric cube skeletons (hex outline +
// three front ribs), nested opacity-0.5 depth layers, rounded joins, one
// tiny red accent per icon. Meanings kept: percent / growth / renew /
// balance. Unified 96×96 viewBox, stroke 1.5 (project icon rule).
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 96 }
})

// iso-cube path helpers (C = cos30 ≈ 0.866): hexagon outline + front ribs
const C = 0.866
function hex(cx, cy, r) {
  const w = C * r
  return `M${cx} ${cy - r}L${cx + w} ${cy - r / 2}L${cx + w} ${cy + r / 2}L${cx} ${cy + r}L${cx - w} ${cy + r / 2}L${cx - w} ${cy - r / 2}Z`
}
function ribs(cx, cy, r) {
  const w = C * r
  return `M${cx - w} ${cy - r / 2}L${cx} ${cy}L${cx + w} ${cy - r / 2}M${cx} ${cy}L${cx} ${cy + r}`
}
function cube(cx, cy, r) {
  return hex(cx, cy, r) + ribs(cx, cy, r)
}
</script>

<template>
  <svg
    class="icon-line"
    :width="size"
    :height="size"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 1. percent — a percentage of real sales: big cube shell, nested
         depth layer, two mini-cubes as the «%» dots + red slash -->
    <g v-if="name === 'percent'" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path :d="hex(48, 48, 40)" />
      <path :d="hex(48, 48, 32)" opacity="0.5" />
      <path :d="cube(34, 34, 10)" />
      <path :d="cube(62, 62, 10)" opacity="0.5" />
      <path d="M64 28L32 68" stroke="var(--color-accent)" stroke-opacity="0.85" />
    </g>

    <!-- 2. growth — a stair of rising cubes + red up-arrow -->
    <g v-else-if="name === 'growth'" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path :d="cube(22, 70, 12)" opacity="0.5" />
      <path :d="cube(45, 58, 13)" />
      <path :d="cube(68, 44, 14)" opacity="0.5" />
      <path d="M22 58V46M45 45V33M22 46l11-6M45 33l11-6" opacity="0.5" />
      <path d="M62 22h14v14" stroke="var(--color-accent)" stroke-opacity="0.85" />
      <path d="M60 38l16-16" stroke="var(--color-accent)" stroke-opacity="0.85" />
    </g>

    <!-- 3. renew — two linked cubes on a cycle: connector arcs, red return -->
    <g v-else-if="name === 'renew'" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path :d="cube(32, 36, 15)" />
      <path :d="hex(32, 36, 10)" opacity="0.5" />
      <path :d="cube(64, 62, 15)" opacity="0.5" />
      <path d="M48 20a30 30 0 0130 30" />
      <path d="M74 42l4 8 8-4" />
      <path d="M48 78a30 30 0 01-30-30" stroke="var(--color-accent)" stroke-opacity="0.85" />
      <path d="M22 56l-4-8-8 4" stroke="var(--color-accent)" stroke-opacity="0.85" />
    </g>

    <!-- 4. balance — a beam over a pivot cube, a cube on each side -->
    <g v-else stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 32h68" />
      <path d="M26 32v14M70 32v14" />
      <path :d="cube(26, 58, 13)" />
      <path :d="hex(26, 58, 8)" opacity="0.5" />
      <path :d="cube(70, 58, 13)" opacity="0.5" />
      <path :d="cube(48, 24, 9)" />
      <path d="M48 34v44" />
      <path d="M36 82h24" opacity="0.5" />
      <circle cx="48" cy="32" r="3" stroke="var(--color-accent)" stroke-opacity="0.85" />
    </g>
  </svg>
</template>
