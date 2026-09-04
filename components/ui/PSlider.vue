<script setup>
// V2 slider (Figma S9/S12 track) — R3.9 rework: FREE continuous values, no
// step snapping. The visual is a lane of 1px ticks (3px pitch): the mockup
// base state is a red «trail» that builds up from the left toward the value,
// a taller crescendo AT the value and a quick falloff to grey on the right.
// The crescendo (and the displayed value — they share one lerp) glides after
// the thumb; hovering lifts it slightly, dragging lifts more and glows.
// A transparent NATIVE input[type=range] on top keeps mouse, touch and
// keyboard accessible; arrows move by ~2% of the range (R3.9 «плавный шаг»).
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 0.1 },
  // keyboard arrows jump by this fraction of the range
  keyStepPct: { type: Number, default: 2 },
  label: { type: String, required: true },
  inputId: { type: String, required: true },
  showValue: { type: Boolean, default: true },
  // R5: «≈» prefix for interpolated (approximate) display values
  approx: { type: Boolean, default: false },
  // formats a raw value into the displayed/announced string
  format: { type: Function, default: null },
  // the two extreme labels under the track
  ends: { type: Array, default: null },
  // R27: the form slider drops the grey range captions entirely
  showEnds: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

const fmt = (v) => (props.format ? props.format(v) : String(Math.round(v)))

const endLabels = computed(() =>
  props.ends ? props.ends.map(String) : [fmt(props.min), fmt(props.max)]
)

const fillPct = computed(() => {
  const span = props.max - props.min
  return span > 0 ? ((props.modelValue - props.min) / span) * 100 : 0
})

// tick lane geometry (mockup: 1px ticks, 3px pitch, 574px reference width)
const TICKS = 192
const LANE_W = 574

// the crescendo AND the displayed number ride the same lerp (R3.9.4 rolling)
const { gsap, reducedMotion } = useScrollMotion()
const visualPct = ref(fillPct.value)
const dragging = ref(false)
const hovering = ref(false)

// R5 hover state (Figma 983:55440): the red zone widens (~±63 → ±78) and
// the swell around the value grows taller — animated smoothly via hoverAmt
const hoverAmt = ref(0)

watch([hovering, dragging], ([h, d]) => {
  const target = h || d ? 1 : 0
  if (reducedMotion.value) {
    hoverAmt.value = target
    return
  }
  gsap.to(hoverAmt, { value: target, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
})

// 960 SSR'd tick rects (5 sliders × 192) bloated the HTML by ~110KB — the
// SVG lane renders client-side only; SSR paints an identical CSS tick strip
const hydrated = ref(false)
onMounted(() => { hydrated.value = true })

watch(fillPct, (v) => {
  if (reducedMotion.value) {
    visualPct.value = v
    return
  }
  gsap.to(visualPct, { value: v, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
})

const posX = computed(() => (visualPct.value / 100) * (LANE_W - 1))

// rolling display: format the lerped value, announce the real one
const valueText = computed(() => {
  const text = fmt(props.min + ((props.max - props.min) * visualPct.value) / 100)
  return props.approx ? `≈ ${text}` : text
})
const ariaText = computed(() => {
  const text = fmt(props.modelValue)
  return props.approx ? `≈ ${text}` : text
})

// R5 (Figma 983:55440): a smooth gaussian swell of tick heights around the
// value; hovering/dragging widens and lifts it
// R8/R9 (фото 10): the envelope is a flat-top block with near-vertical
// edges — the 12th-power exponent makes the draggable zone read «резко»,
// like the mockup, instead of a rounded bell
// R11 (r6-s17): the mockup thumb is a NARROW low block — tighter sigma and
// a smaller lift than before
function tickHeight(i) {
  const d = i * 3 - posX.value
  const swell = Math.exp(-((d / (9 + hoverAmt.value * 5)) ** 12))
  return 8 + swell * (5 + hoverAmt.value * 3 + (dragging.value ? 2 : 0))
}

// symmetric compact red zone around the value (base ±63, hover ±78)
function tickColor(i) {
  const d = Math.abs(i * 3 - posX.value)
  const t = Math.max(0, 1 - d / (36 + hoverAmt.value * 12)) // R11: compact zone
  if (t <= 0) return 'rgba(122, 122, 122, 0.25)'
  const mix = (a, b) => Math.round(a + (b - a) * t)
  return `rgba(${mix(122, 241)}, ${mix(122, 38)}, ${mix(122, 37)}, ${(0.25 + 0.75 * t).toFixed(2)})`
}

function onInput(e) {
  const v = Number(e.target.value)
  emit('update:modelValue', v)
  emit('input', v)
}

function onChange(e) {
  emit('change', Number(e.target.value))
}

// arrows glide by keyStepPct of the range (free sliders have a tiny native step)
function onKeydown(e) {
  const ks = ((props.max - props.min) * props.keyStepPct) / 100
  let delta = 0
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = ks
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -ks
  else return
  e.preventDefault()
  const next = Math.min(props.max, Math.max(props.min, props.modelValue + delta))
  if (next !== props.modelValue) {
    emit('update:modelValue', next)
    emit('input', next)
    emit('change', next)
  }
}
</script>

<template>
  <div class="p-slider">
    <div class="p-slider__head">
      <label class="p-slider__label" :for="inputId">{{ label }}</label>
      <span v-if="showValue" class="p-slider__value" aria-hidden="true">{{ valueText }}</span>
    </div>

    <div
      class="p-slider__zone"
      @pointerenter="hovering = true"
      @pointerleave="hovering = false"
    >
      <input
        :id="inputId"
        class="p-slider__input"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :aria-valuetext="ariaText"
        @input="onInput"
        @change="onChange"
        @keydown="onKeydown"
        @pointerdown="dragging = true"
        @pointerup="dragging = false"
        @pointercancel="dragging = false"
      />

      <svg
        v-if="hydrated"
        class="p-slider__lane"
        :viewBox="`0 0 ${LANE_W} 20`"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          v-for="i in TICKS"
          :key="i"
          :x="(i - 1) * 3"
          :y="(20 - tickHeight(i - 1)) / 2"
          width="1"
          :height="tickHeight(i - 1)"
          :fill="tickColor(i - 1)"
        />
      </svg>
      <span v-else class="p-slider__lane p-slider__lane--static" aria-hidden="true" />
    </div>

    <div v-if="showEnds" class="p-slider__ends" aria-hidden="true">
      <span>{{ endLabels[0] }}</span>
      <span>{{ endLabels[1] }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p-slider {
  display: flex;
  flex-direction: column;
  gap: $spacing-2; // R5: tighter label-lane-ends rhythm

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-4;
  }

  &__label {
    font-size: $fs-body;
    letter-spacing: -0.03em;
    color: var(--color-text);
  }

  &__value {
    font-size: $fs-body;
    letter-spacing: -0.03em;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
  }

  &__zone {
    position: relative;
    height: 32px; // 16px lane + touch room
    display: flex;
    align-items: center;
  }

  // invisible native input on top: it owns mouse/touch/keyboard
  &__input {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    inset: -8px 0;
    z-index: 3;
    width: 100%;
    height: calc(100% + 16px);
    margin: 0;
    opacity: 0;
    background: transparent;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 44px;
      height: 44px;
    }

    &::-moz-range-thumb {
      width: 44px;
      height: 44px;
      border: none;
    }

    // keyboard focus ring around the lane
    &:focus-visible ~ .p-slider__lane {
      outline: 2px solid var(--color-accent);
      outline-offset: 6px;
      border-radius: 2px;
    }
  }

  &__lane {
    width: 100%;
    height: 20px;
    display: block;
    transition: filter 250ms ease;

    // pre-hydration stand-in: same tick rhythm, centered 8px strip
    &--static {
      background-image: repeating-linear-gradient(
        90deg,
        rgba(122, 122, 122, 0.25) 0 1px,
        transparent 1px 3px
      );
      background-size: 100% 8px;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  // R3.9.2 hover micro-glow; drag state glows stronger (crescendo also lifts)
  &__zone:hover &__lane {
    filter: drop-shadow(0 0 5px rgba(241, 38, 37, 0.35));
  }

  &__input:active ~ &__lane {
    filter: drop-shadow(0 0 8px var(--color-glow));
  }

  @media (prefers-reduced-motion: reduce) {
    &__lane,
    &__zone:hover &__lane,
    &__input:active ~ &__lane {
      transition: none;
      filter: none;
    }
  }

  &__ends {
    display: flex;
    justify-content: space-between;
    font-size: $fs-small;
    letter-spacing: -0.03em;
    color: var(--color-text-muted);
  }
}
</style>
