<script setup>
// R5 — the S8 card ghost-arts rebuilt in the style of the customer's
// SVG icon example 1/2: layered isometric wireframe cubes (stroke 2, nested
// contours, 0.5-opacity depth layers) COMPOSED with a meaning overlay per
// step: 0 observation → magnifier over the cube, 1 planning → blueprint
// dimensions, 2 agreement → two linked cubes, 3 launch → a cube lifting off
// a platform, 4 growth → a cube stair + rising arrow.
defineProps({
  step: { type: Number, required: true }
})

const C = 0.866

// isometric cube: hex outline + the three front ribs (example-1 geometry)
function cube(cx, cy, r) {
  const top = `${cx} ${cy - r}`
  const tr = `${cx + C * r} ${cy - r / 2}`
  const br = `${cx + C * r} ${cy + r / 2}`
  const bot = `${cx} ${cy + r}`
  const bl = `${cx - C * r} ${cy + r / 2}`
  const tl = `${cx - C * r} ${cy - r / 2}`
  return {
    hex: `M${top}L${tr}L${br}L${bot}L${bl}L${tl}Z`,
    ribs: `M${tl}L${cx} ${cy}M${tr}L${cx} ${cy}M${cx} ${cy}L${bot}`
  }
}
</script>

<template>
  <svg
    class="step-art"
    viewBox="0 0 220 220"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 0. observation: nested cube + magnifier -->
    <g v-if="step === 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path :d="cube(104, 96, 62).hex" />
      <path :d="cube(104, 96, 62).ribs" />
      <path :d="cube(104, 96, 50).hex" />
      <path :d="cube(104, 96, 50).ribs" />
      <g opacity="0.5">
        <path :d="cube(104, 96, 38).hex" />
        <path :d="cube(104, 96, 38).ribs" />
      </g>
      <circle cx="150" cy="140" r="33" />
      <circle cx="150" cy="140" r="26" opacity="0.5" />
      <path d="M174 164l24 24" />
    </g>

    <!-- 1. planning: cube + blueprint dimension lines -->
    <g v-else-if="step === 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path :d="cube(112, 108, 56).hex" />
      <path :d="cube(112, 108, 56).ribs" />
      <g opacity="0.5">
        <path :d="cube(112, 108, 44).hex" />
        <path :d="cube(112, 108, 44).ribs" />
      </g>
      <path d="M38 52v112M32 52h12M32 164h12" opacity="0.7" />
      <path d="M76 26h72M76 20v12M148 20v12" opacity="0.7" />
      <path d="M112 178v18M164 138l16 10" stroke-dasharray="3 6" />
      <path :d="cube(186, 168, 14).hex" opacity="0.7" />
    </g>

    <!-- 2. agreement: two cubes linked -->
    <g v-else-if="step === 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path :d="cube(72, 128, 44).hex" />
      <path :d="cube(72, 128, 44).ribs" />
      <g opacity="0.5">
        <path :d="cube(72, 128, 33).hex" />
        <path :d="cube(72, 128, 33).ribs" />
      </g>
      <path :d="cube(152, 84, 44).hex" />
      <path :d="cube(152, 84, 44).ribs" />
      <g opacity="0.5">
        <path :d="cube(152, 84, 33).hex" />
        <path :d="cube(152, 84, 33).ribs" />
      </g>
      <path d="M104 106l22-12M96 152l40-22" stroke-dasharray="3 6" />
      <circle cx="113" cy="101" r="3.5" />
      <circle cx="116" cy="141" r="3.5" />
    </g>

    <!-- 3. launch: a cube lifting off a platform -->
    <g v-else-if="step === 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path :d="cube(110, 160, 44).hex" opacity="0.7" />
      <path :d="cube(110, 160, 44).ribs" opacity="0.5" />
      <path :d="cube(110, 62, 34).hex" />
      <path :d="cube(110, 62, 34).ribs" />
      <path d="M84 116l-8 14M110 122v18M136 116l8 14" stroke-dasharray="3 6" />
      <path d="M174 54l14-14M182 76h18" opacity="0.6" />
      <path d="M28 76h18M36 54l-14-14" opacity="0.6" />
    </g>

    <!-- 4. growth: a cube stair + rising arrow -->
    <g v-else stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <g opacity="0.5">
        <path :d="cube(56, 162, 30).hex" />
        <path :d="cube(56, 162, 30).ribs" />
      </g>
      <path :d="cube(108, 126, 34).hex" opacity="0.75" />
      <path :d="cube(108, 126, 34).ribs" opacity="0.75" />
      <path :d="cube(160, 86, 38).hex" />
      <path :d="cube(160, 86, 38).ribs" />
      <path d="M120 44L172 8" opacity="0.9" />
      <path d="M156 8h16v16" opacity="0.9" />
      <path d="M74 138l8-6M126 100l8-6" stroke-dasharray="3 6" />
    </g>
  </svg>
</template>
