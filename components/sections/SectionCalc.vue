<script setup>
// V2 S9 «Terms are tailored to each business» (Figma 887:51605): left —
// title, lead and 8 factor chips; right — the estimate panel (title, divider,
// four tick-track sliders, divider, result + disclaimer). The estimate logic
// is the previous version's formula (TODO(FAKE) — согласовать с экономикой)
// adapted to the step sliders; the rolling counter arrives in P8.
const { t } = useLang()
const rootEl = ref(null)
const { sectionReveal, gsap, reducedMotion } = useScrollMotion()

// R10/R13: the customer's percent floats behind the left half — the
// hero-cart animation: a barely-there slow idle drift up/down, and a light
// 3D tilt (rotateY ±6 / rotateX ±4, lerp 0.07) that follows the cursor
// ANYWHERE over the section (r13: «в области левой секции», not just the
// svg itself); the tilt targets are computed relative to the mark's centre
const markWrap = ref(null)
const markTilt = ref(null)
const markEl = ref(null)
let rafId = 0
let tRX = 0
let tRY = 0
let cRX = 0
let cRY = 0

function onCalcMove(e) {
  if (!markWrap.value) return
  const r = markWrap.value.getBoundingClientRect()
  const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width))
  const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height))
  // R29: заказчик — поворот влево/вправо чуть меньше, вверх/вниз чуть больше
  tRY = nx * 10
  tRX = ny * -12
}

function onCalcLeave() {
  tRX = 0
  tRY = 0
}

function tiltLoop() {
  cRX += (tRX - cRX) * 0.07
  cRY += (tRY - cRY) * 0.07
  if (markTilt.value) {
    markTilt.value.style.transform = `rotateX(${cRX.toFixed(3)}deg) rotateY(${cRY.toFixed(3)}deg)`
  }
  rafId = requestAnimationFrame(tiltLoop)
}

// R17: the heat-up triggers only over the actual slider LANES (not the
// whole estimate panel) — listeners go on every .p-slider__zone
function onZoneEnter() { sliderHover.value = true }
function onZoneLeave() { sliderHover.value = false }
let zones = []

onMounted(() => {
  sectionReveal(rootEl.value)

  zones = [...rootEl.value.querySelectorAll('.calc-panel .p-slider__zone')]
  zones.forEach((z) => {
    z.addEventListener('pointerenter', onZoneEnter)
    z.addEventListener('pointerleave', onZoneLeave)
  })

  if (reducedMotion.value) return
  // R27: the chip glow loop (paused entirely under reduced motion)
  nextLit()
  litTimer = setInterval(nextLit, 1600)
  // «еле-еле» — slower and shallower than the cart, but the same breath
  gsap.to(markEl.value, { y: 12, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    rootEl.value.addEventListener('mousemove', onCalcMove, { passive: true })
    rootEl.value.addEventListener('mouseleave', onCalcLeave)
    rafId = requestAnimationFrame(tiltLoop)
  }
})

onBeforeUnmount(() => {
  zones.forEach((z) => {
    z.removeEventListener('pointerenter', onZoneEnter)
    z.removeEventListener('pointerleave', onZoneLeave)
  })
  rootEl.value?.removeEventListener('mousemove', onCalcMove)
  rootEl.value?.removeEventListener('mouseleave', onCalcLeave)
  cancelAnimationFrame(rafId)
  clearTimeout(hotTimer)
  clearInterval(litTimer)
})

// R13: the percent smoothly turns red while the sliders are ALIVE — hovered,
// dragged or actually changing value; it cools back down when idle
const sliderHover = ref(false)
const sliderPulse = ref(false)
let hotTimer = null
const pctHot = computed(() => sliderHover.value || sliderPulse.value)

function pulseHot() {
  sliderPulse.value = true
  clearTimeout(hotTimer)
  hotTimer = setTimeout(() => {
    sliderPulse.value = false
  }, 700)
}


const chips = computed(() => t('v2.calc_chips'))

// R27: the labels glow one after another in a shuffled order — a slow,
// pleasant loop (text → #791313, stroke → #3C0A09 per the mock); the queue
// reshuffles when exhausted so the order keeps changing
const litChip = ref(-1)
let litTimer = null
let litQueue = []

function nextLit() {
  const n = chips.value.length
  if (!n) return
  if (!litQueue.length) {
    litQueue = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5)
    if (litQueue[0] === litChip.value && n > 1) litQueue.push(litQueue.shift())
  }
  litChip.value = litQueue.shift()
}
const labels = computed(() => t('v2.calc_labels'))
const marginSteps = computed(() => t('v2.margin_steps'))
const volumeSteps = computed(() => t('v2.volume_steps5'))
const aovSteps = computed(() => t('v2.aov_steps'))

// R3.9.3 — FREE continuous sliders: margin/volume/aov are 0..100 positions,
// integrations is a free 1..10 float (shown rounded). The displayed money
// values interpolate a locale range (EN $, UA ₴) purely for display — the
// TODO(FAKE) formula itself works on the continuous positions.
const { lang } = useLang()
const { money, percent, integer } = useSliderFormat()

const margin = ref(50)
const volume = ref(50)
const aov = ref(50)
const integrations = ref(5)

// R10: display ranges end exactly where the end labels end (₴10 млн+ / $400k+)
const VOLUME_RANGE = computed(() => (lang.value === 'ua' ? [50e3, 10e6] : [5e3, 400e3]))
const AOV_RANGE = computed(() => (lang.value === 'ua' ? [500, 20e3] : [50, 2000]))

const lerp = ([a, b], pos) => a + ((b - a) * pos) / 100

const fmtMargin = (pos) => percent(5 + pos * 0.75)
const fmtVolume = (pos) => money(lerp(VOLUME_RANGE.value, pos))
const fmtAov = (pos) => money(lerp(AOV_RANGE.value, pos))

// TODO(FAKE): база 6, клэмп 2–12, спред ±1 — формула прошлой версии,
// теперь на непрерывных позициях
function estimateRange(marginPos, volumePos, aovPos, integrCount) {
  const marginAdd = (marginPos / 100) * 2
  const volumeAdd = -(volumePos / 100) * 2
  const aovAdd = -(aovPos / 100) * 1
  const integrAdd = 0.5 + ((integrCount - 1) / 9) * 1.0
  const x = Math.min(12, Math.max(2, 6 + marginAdd + volumeAdd + aovAdd + integrAdd))
  return [Math.round(x - 1), Math.round(x + 1)]
}

const range = computed(() =>
  estimateRange(margin.value, volume.value, aov.value, Math.round(integrations.value))
)

// R13: any slider movement (mouse, touch or keyboard) heats the percent up
watch([margin, volume, aov, integrations], pulseHot)

// P8: the result rolls to its new value (350ms, snapped to integers,
// tabular-nums keeps the width steady); reduced motion assigns directly
const displayed = reactive({ lo: range.value[0], hi: range.value[1] })
const counterObj = { lo: range.value[0], hi: range.value[1] }
const rangeEl = ref(null)

watch(range, ([lo, hi], old) => {
  if (reducedMotion.value) {
    counterObj.lo = lo
    counterObj.hi = hi
    displayed.lo = lo
    displayed.hi = hi
    return
  }
  gsap.to(counterObj, {
    lo,
    hi,
    duration: 0.35,
    ease: 'power2.out',
    snap: { lo: 1, hi: 1 },
    overwrite: 'auto',
    onUpdate() {
      displayed.lo = counterObj.lo
      displayed.hi = counterObj.hi
    }
  })
  // R5: the percent digits pop in with a small slide when they change
  if (rangeEl.value && old && (lo !== old[0] || hi !== old[1])) {
    gsap.fromTo(
      rangeEl.value,
      { yPercent: 30, autoAlpha: 0.25 },
      { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out', overwrite: true }
    )
  }
})
</script>

<template>
  <section id="calc" ref="rootEl" class="section-calc">
    <div class="container section-calc__inner">
      <div class="section-calc__left">
        <div class="section-calc__head">
          <SectionTitle class="section-calc__title v2-mask" :text="t('v2.calc_title')" />
          <p class="section-calc__lead v2-reveal">{{ t('v2.calc_lead') }}</p>
        </div>
        <div class="section-calc__chips v2-reveal">
          <span
            v-for="(chip, i) in chips"
            :key="chip"
            class="section-calc__chip"
            :class="{ 'is-lit': litChip === i }"
          >{{ chip }}</span>
        </div>
      </div>

      <!-- R27 (Figma 1107:5719): the estimate panel is gone — the customer's
           NEW percent stands in its place; tilt follows the cursor over the
           section (as before), the accent heat-up now fires on hovering the
           percent itself -->
      <div
        ref="markWrap"
        class="section-calc__mark-wrap"
        :class="{ 'is-hot': pctHot }"
        aria-hidden="true"
        @pointerenter="onZoneEnter"
        @pointerleave="onZoneLeave"
      >
        <div ref="markTilt" class="section-calc__mark-tilt">
          <div ref="markEl" class="section-calc__mark">
            <PercentArt />
          </div>
        </div>
      </div>

      <!-- R27: «A rough estimate» panel hidden per the customer (may return)
      <div class="calc-panel v2-reveal">
        <h3 class="calc-panel__title">{{ t('v2.calc_panel_title') }}</h3>
        <span class="calc-panel__divider" aria-hidden="true" />

        <div class="calc-panel__sliders">
          <PSlider
            v-model="margin"
            input-id="calc-margin"
            :label="labels[0]"
            approx
            :format="fmtMargin"
            :ends="[marginSteps[0], marginSteps[marginSteps.length - 1]]"
          />
          <PSlider
            v-model="volume"
            input-id="calc-volume"
            :label="labels[1]"
            approx
            :format="fmtVolume"
            :ends="[volumeSteps[0], volumeSteps[volumeSteps.length - 1]]"
          />
          <PSlider
            v-model="aov"
            input-id="calc-aov"
            :label="labels[2]"
            approx
            :format="fmtAov"
            :ends="[aovSteps[0], aovSteps[aovSteps.length - 1]]"
          />
          <PSlider
            v-model="integrations"
            input-id="calc-integrations"
            :label="labels[3]"
            :min="1"
            :max="10"
            :format="integer"
            :ends="[1, 10]"
          />
        </div>

        <span class="calc-panel__divider" aria-hidden="true" />

        <div class="calc-panel__result">
          <p class="calc-panel__value">
            <span ref="rangeEl" class="calc-panel__range">{{ displayed.lo }}–{{ displayed.hi }}%</span>
            <span class="calc-panel__suffix">{{ t('v2.result_suffix') }}</span>
          </p>
          <p class="calc-panel__disclaimer">{{ t('v2.calc_disclaimer') }}</p>
        </div>
      </div>
      -->
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-calc {
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm

  // R31.3 (фото 1): «отступ сделай тут больше» — extra air below the chips
  // before «We earn…»
  @media (min-width: 1025px) {
    padding-bottom: calc(var(--rhythm-half) + #{$spacing-8});
  }

  &__inner {
    display: flex;
    gap: $spacing-7;
    // R29.1: row centring — the percent's centre matches the left block's
    align-items: center;
    // R29: enough height for the full-size percent (left column is ~316)
    min-height: calc(440px * var(--k));

    @include respond(lg) {
      align-items: flex-start;
      min-height: 0;
    }
  }

  &__inner {
    position: relative; // anchors the % mark against the full section height
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: $spacing-9;
    flex: 1;
  }

  // R27/R29.1: the percent IS the right half — sized to the section height
  // EXPLICITLY (440 × the 427:336 ratio = 559): the stretch+aspect-ratio
  // pair resolved circularly and blew past the container's right edge
  &__mark-wrap {
    flex-shrink: 0;
    width: calc(559px * var(--k));
    display: flex;
    align-items: center;
    justify-content: center;
    // R17: perspective must sit on the DIRECT parent of the rotating layer —
    // on a distant ancestor the rotateX/rotateY rendered flat («не 3д»)
    perspective: 900px;

    @include respond(lg) {
      align-self: center;
      width: min(420px, 70vw);
    }
  }

  &__mark-tilt {
    width: 100%; // definite chain wrap(559) → tilt → mark → svg
    will-change: transform;
  }

  &__mark {
    width: 100%;
  }

  // R13/R27: currentColor drives the inlined svg — idle S5-tone, accent
  // while the percent itself is hovered, 600ms both ways
  &__mark {
    display: block;
    color: #1e1e1f; // S5 mark tone (заказчик)
    transition: color 600ms ease;

    :deep(svg) {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  &__mark-wrap.is-hot &__mark {
    color: #3c0a09; // R17: тон заказчика, не чистый акцент
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: $spacing-7;
  }

  &__title {
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
    white-space: pre-line;

    :deep(.section-title__accent) {
      white-space: inherit;
    }
  }

  &__lead {
    max-width: calc(640px * var(--k));
    font-size: $fs-body;
    letter-spacing: -0.03em;
    line-height: normal;
    color: var(--color-text-muted);
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-2;
    max-width: calc(640px * var(--k));
  }

  &__chip {
    padding: $spacing-2 $spacing-3;
    border: 1px solid var(--color-border-table);
    border-radius: $radius-pill;
    font-size: $fs-small;
    letter-spacing: -0.03em;
    color: var(--color-text-muted);
    // R27: the shuffled glow loop — long soft cross-fades
    transition: color 700ms ease, border-color 700ms ease;

    &.is-lit {
      color: #791313; // тон подписи из мока (заказчик)
      border-color: #3c0a09; // строук из мока
    }
  }
}

.calc-panel {
  display: flex;
  flex-direction: column;
  gap: $spacing-7;
  width: calc(640px * var(--k));
  padding: $spacing-7;
  border: 1px solid var(--color-border-table);
  border-radius: 12px; // mockup panel radius
  background: rgba(0, 0, 0, 0.25);
  flex-shrink: 0;

  &__title {
    font-size: calc(24px * var(--k));
    font-weight: 400;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  &__divider {
    opacity: 0.5; // R8: half-transparent separators
    height: 1px;
    background: var(--color-border-table);
  }

  &__sliders {
    display: flex;
    flex-direction: column;
    gap: $spacing-8;
  }

  &__result {
    display: flex;
    flex-direction: column;
    gap: $spacing-6;
  }

  &__value {
    display: flex;
    align-items: baseline;
    gap: $spacing-2;
  }

  &__range {
    font-size: $fs-h3;
    letter-spacing: $ls-h3;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  &__suffix {
    font-size: $fs-body;
    letter-spacing: -0.03em;
  }

  &__disclaimer {
    font-size: $fs-body;
    letter-spacing: -0.03em;
    line-height: normal;
    color: var(--color-text-muted);
  }
}

@include respond(lg) {
  .section-calc__inner {
    flex-direction: column;
    gap: $spacing-8;
  }

  .calc-panel {
    width: 100%;
  }
}

@include respond(md) {
  .calc-panel {
    padding: $spacing-5;
    gap: $spacing-6;

    &__sliders {
      gap: $spacing-7;
    }
  }
}


@include respond(md) {
  .section-calc__lead {
    font-size: $fs-body-lg-m; // R10: the 24px lead tier steps like elsewhere
  }
}

@include respond(md) {
  .section-calc__title {
    font-size: $fs-h2-m;
  }
}
</style>
