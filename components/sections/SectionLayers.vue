<script setup>
// V2 S3 «The website is only the visible part» — pin + scrub (P7).
// Default DOM/CSS = the OPENED mockup state (isometric stack + ladder
// labels): that's the mobile/reduced-motion fallback. Desktop motion mode
// (≥1025px, no-preference) pins the section and runs the neoconda unfold:
// phase A — the frontal storefront card tilts into the isometry; phase B —
// the stack spreads vertically with a stagger while each label fades in as
// its layer arrives. Fully reversible (scrub), pin releases on the final
// mockup state.
//
// R2-P3 lesson: compact-mode measurements need the .is-motion class applied
// SYNCHRONOUSLY before reading offsets (Vue bindings land on nextTick).
const { t } = useLang()
const { gsap, ScrollTrigger, sectionReveal, reducedMotion } = useScrollMotion()

// stack top→bottom (mockup z-order 7…1); site is the frontal card
const STACK = ['site', 'pay', 'delivery', 'analytics', 'crm', 'stock', 'notify']
// R3.3.2–R3.3.4: each label is anchored to ITS OWN layer's slot; sides
// alternate top-down (1st left, 2nd right, 3rd left…), which also gives the
// required top-down appearance order. The mockup's own ladder had the label
// columns detached from the layers (its CRM label sat next to the payment
// layer) — «поменять местами подписи» per R3.3.2.
const LABELS = STACK.map((key, slot) => ({
  key,
  slot,
  side: slot % 2 === 0 ? 'left' : 'right'
}))

const rootEl = ref(null)
const stackEl = ref(null)

let mm = null

function initMotion() {
  mm = gsap.matchMedia()

  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
    const sectionEl = rootEl.value
    // synchronous class BEFORE measuring (compact pin layout vars)
    sectionEl.classList.add('is-motion')

    const slots = stackEl.value.querySelectorAll('.section-layers__slot')
    const isos = stackEl.value.querySelectorAll('.section-layers__iso')
    const labels = sectionEl.querySelectorAll('.layer-label')

    // R3.3.1: the collapsed card must sit dead-centre of the zone below the
    // head (mockup 887:49901). Offsets are FUNCTION-based and measured via
    // the offsetTop chain (transform-independent), so invalidateOnRefresh
    // re-derives them after fonts/images settle — a one-shot measurement at
    // mount went stale when the head reflowed (fallback font → SF Pro).
    const headEl = sectionEl.querySelector('.section-layers__head')
    const offsetInSection = (el) => {
      let y = 0
      let n = el
      while (n && n !== sectionEl) {
        y += n.offsetTop
        n = n.offsetParent
      }
      return y
    }
    const targetY = () => {
      const headBottom = offsetInSection(headEl) + headEl.offsetHeight
      return headBottom + (window.innerHeight - headBottom) / 2
    }

    // R8 (фото 24): the OPENED stack centres itself in the zone between the
    // head and the viewport bottom — measured live (the CSS clamp guessed a
    // fixed head height and drifted on wide screens where the title is one
    // line). Runs before every refresh so the collapse maths see the final
    // margin.
    const stageEl = sectionEl.querySelector('.section-layers__stage')
    const placeStage = () => {
      const headBottom = offsetInSection(headEl) + headEl.offsetHeight
      const pb = parseFloat(getComputedStyle(stackEl.value).paddingBottom) || 0
      const visual = stackEl.value.offsetHeight - pb
      const m = (window.innerHeight - headBottom - visual) / 2
      stageEl.style.marginTop = `${Math.round(Math.max(40, Math.min(200, m)))}px`
    }
    placeStage()

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top top',
        end: '+=220%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: placeStage
      }
    })

    // R4: a dead-zone hold keeps the frontal card PERFECTLY still for the
    // first beat of the pin — without it a few px of scrub already blended
    // the isometry in and the card read as «ужата по высоте»
    tl.to({}, { duration: 0.35 }, 0)

    // phase A (0.35 → 1.55): frontal 640×360 card tilts into the isometry.
    // BOTH ends explicit (fromTo) — letting gsap decompose the CSS transform
    // produced a wrong, already-tilted start state (the R3.3.1 «разваливается»);
    // in motion mode the CSS transform on the iso is removed so gsap owns it.
    tl.fromTo(isos, {
      rotate: 0,
      skewX: 0,
      scaleX: 1.54, // 415px iso base → 640px frontal card
      scaleY: 1.54
    }, {
      rotate: 4,
      skewX: -44,
      scaleX: 1,
      scaleY: 0.72,
      duration: 1.2
    }, 0.35)

    // phase B (0.95 → …): the stack spreads top-down (R3.3.3 — the top layer
    // settles first, so the labels can follow in the same order)
    slots.forEach((slot, i) => {
      tl.from(slot, {
        y: () => targetY() - (offsetInSection(slot) + slot.offsetHeight / 2),
        duration: 1.6,
        ease: 'power1.inOut'
      }, 0.95 + i * 0.12)
    })

    // labels appear top-down, alternating left/right (DOM = slot order),
    // each as its own layer arrives (R3.3.3 + R3.3.4)
    labels.forEach((label) => {
      const slot = Number(label.dataset.slot)
      const at = 0.95 + slot * 0.12 + 1.1
      tl.from(label, { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out' }, at)
    })

    // hold tail: the opened state stands before the pin releases
    tl.to({}, { duration: 0.5 })

    return () => {
      sectionEl.classList.remove('is-motion')
      stageEl.style.marginTop = ''
    }
  })
}

let alive = true

onMounted(() => {
  sectionReveal(rootEl.value, { start: 'top 85%' })
  // The pin is created AT MOUNT so its spacer exists before the user scrolls
  // (a late init inserted +220% of height mid-scroll — a CLS 1.0 jump, found
  // in R3-P6). The collapse offsets are function-based + invalidateOnRefresh,
  // so the cheap refresh after the webfont settles re-derives them with the
  // final head height (the R3.3.1 fallback-font drift fix).
  initMotion()
  document.fonts.ready.then(() => {
    if (!alive) return
    ScrollTrigger.refresh()
  })
})

onBeforeUnmount(() => {
  alive = false
  mm?.revert()
})
</script>

<template>
  <section id="layers" ref="rootEl" class="section-layers">
    <div class="container">
      <div class="section-layers__head">
        <SectionTitle class="section-layers__title v2-mask" :text="t('layers.title')" />
        <div class="section-layers__lead v2-reveal">
          <p>{{ t('v2.layers_p1') }}</p>
          <p>{{ t('v2.layers_p2') }}</p>
        </div>
      </div>

      <div class="section-layers__stage">
        <div ref="stackEl" class="section-layers__stack">
          <div
            v-for="(key, i) in STACK"
            :key="key"
            class="section-layers__slot"
            :style="{ zIndex: STACK.length - i }"
          >
            <div class="section-layers__iso">
              <LayerCard :name="key" />
            </div>
          </div>
        </div>

        <!-- labels anchored to their own layers, sides alternating top-down -->
        <div class="section-layers__labels">
          <div
            v-for="l in LABELS"
            :key="l.key"
            class="layer-label"
            :class="`layer-label--${l.side}`"
            :data-slot="l.slot"
            :style="{ '--slot': l.slot }"
          >
            <div class="layer-label__box">
              <span class="layer-label__line" aria-hidden="true" />
              <div class="layer-label__text">
                <p class="layer-label__name">{{ t(`v2.layers.${l.key}.name`) }}</p>
                <p class="layer-label__desc">{{ t(`v2.layers.${l.key}.desc`) }}</p>
              </div>
            </div>
          </div>
          <!-- R9: the adaptive table's odd last cell — decorative filler -->
          <div class="layer-label layer-label--more" aria-hidden="true">
            <p class="layer-label__more">{{ t('v2.layers_more') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-layers {
  position: relative; // anchor for the offsetTop measuring chain
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm

  .container {
    position: relative;
  }

  &__head {
    display: flex;
    gap: $spacing-11;
    align-items: flex-start;
  }

  &__title {
    flex: 1;
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
  }

  &__lead {
    width: calc(681px * var(--k)); // R3.0.A: scales on >=2560
    font-size: calc(24px * var(--k)); // mockup lead size
    letter-spacing: -0.03em;
    color: var(--color-text-muted);
    line-height: normal;
  }

  // stage — default: the OPENED state (mobile / reduced-motion fallback).
  // --pitch = slot top-to-top distance; the labels anchor with it (R3.3.4)
  &__stage {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: $spacing-13;
    width: 100%;
    --pitch: calc(89px * var(--k)); // 185 slot − 96 overlap
  }

  &__stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(587px * var(--k));
    padding-bottom: $spacing-10;
  }

  &__slot {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(185px * var(--k));
    width: calc(587px * var(--k));
    margin-bottom: calc(-96px * var(--k));
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__iso {
    width: calc(415px * var(--k));
    transform: rotate(4deg) skewX(-44deg) scaleY(0.72);
  }

  // labels overlay — each label positions itself against its slot
  &__labels {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  // pin mode: slightly tighter spread so head + stack fit one viewport;
  // gsap owns the iso transform entirely (explicit fromTo — R3.3.1 fix)
  &.is-motion &__head {
    margin-top: 0;
  }

  &.is-motion &__stage {
    // R6: the stage centres itself in the zone below the head so the air
    // above and below the opened stack reads equal on ANY viewport height
    // (815px ≈ head bottom + the stack's visual height at k=1; a fixed token
    // balanced one screen height and broke the others)
    margin-top: clamp(#{$spacing-9}, calc((100svh - 815px * var(--k)) / 2), #{$spacing-15});
    --pitch: calc(73px * var(--k)); // 185 slot − 112 overlap
  }

  &.is-motion &__iso {
    transform: none;
  }

  &.is-motion &__slot {
    margin-bottom: calc(-112px * var(--k));

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.layer-label {
  // R3.3.4: anchored to its own layer — top = the slot's vertical centre;
  // the inner box recentres itself so gsap can own the outer transform
  position: absolute;
  top: calc((185px * var(--k)) / 2 + var(--slot) * var(--pitch));
  width: calc(348px * var(--k));
  pointer-events: auto;

  // the «& more» filler exists only in the ≤1024 table view (the later
  // lg block flips it to flex — same specificity, later wins)
  &--more {
    display: none;
  }

  &--left {
    left: 0;
  }

  &--right {
    right: 0;
  }

  &__box {
    display: flex;
    align-items: center;
    gap: $spacing-6;
    transform: translateY(-50%);
  }

  // left labels: text first, connector line pointing at the stack
  &--left &__box {
    flex-direction: row-reverse;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $spacing-3; // R4: tighter name-to-description
    width: calc(260px * var(--k));
  }

  &__name {
    font-size: calc(24px * var(--k));
    letter-spacing: -0.03em;
    line-height: normal;
  }

  &__desc {
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: normal;
    color: var(--color-text-muted);
  }

  &__line {
    width: 64px;
    height: 1px;
    background: var(--color-text-muted);
    opacity: 0.5;
    flex-shrink: 0;
  }
}

@include respond(lg) {
  .section-layers {
    &__head {
      flex-direction: column;
      gap: $spacing-6;
    }

    &__lead {
      width: 100%;
      max-width: 640px;
    }

    &__stage {
      flex-direction: column;
      align-items: center;
      margin-top: $spacing-9;
    }

    // R7/R9 (фото 4): ladder labels flow under the stack as a TABLE — the
    // 1px grid gap over the border color draws the strokes, cells paint the
    // page bg on top
    &__labels {
      position: static;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1px;
      width: 100%;
      margin-top: $spacing-8;
      border: 1px solid var(--color-border-table);
      background: var(--color-border-table);
    }
  }

  .layer-label {
    position: static;
    width: 100%;
    padding: $spacing-5;
    background: var(--color-bg);

    &__box,
    &--left &__box {
      flex-direction: row;
      transform: none;
    }

    &__text {
      width: auto;
      flex: 1;
      gap: $spacing-2;
    }

    &__line {
      display: none;
    }

    // R9/R11 (r6-s13): the odd filler cell shows only in the TABLET table —
    // styled exactly like a label name, just muted, so it doesn't stand out
    &--more {
      display: flex;
      align-items: center;
    }

    &__more {
      font-size: calc(24px * var(--k));
      letter-spacing: -0.03em;
      line-height: normal;
      color: var(--color-text-muted);
    }
  }
}

// R11 (r6-s13): no filler row in the single-column phone table
@include respond(640px) {
  .layer-label--more {
    display: none;
  }
}

// R7: single column on phones (portrait tablets at 768–834 keep two)
@include respond(640px) {
  .section-layers__labels {
    grid-template-columns: 1fr;
  }
}

@include respond(md) {
  .section-layers {
    &__stack {
      width: 100%;
      padding-bottom: $spacing-6;
    }

    &__slot {
      width: 100%;
      height: 120px;
      margin-bottom: -58px;
    }

    &__iso {
      width: 270px;
    }

    &__lead {
      font-size: $fs-body-lg-m;
    }
  }

  .layer-label {
    &__name {
      font-size: $fs-body-lg;
    }

    &__desc {
      font-size: $fs-small;
    }
  }
}


@include respond(md) {
  .section-layers__title {
    font-size: $fs-h2-m;
  }
}
</style>
