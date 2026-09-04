<script setup>
// V2 S4 «The entire technical side on us» — R3.4 mechanics change: NO hover
// effects, NO auto-run. The section pins (produx «Trusted partners» feel,
// refs/f2.png) and the card ribbon travels horizontally with the scrub while
// the tick strip fills by the same amount (a crescendo cursor rides the
// fill edge, per the mockup 887:50288). Scrolling back rewinds everything.
// Static fallback (<1025px / reduced motion): no pin, the ribbon scrolls
// natively so every card stays reachable.
const { t } = useLang()
const rootEl = ref(null)
const frameEl = ref(null)
const trackEl = ref(null)
const { sectionReveal, gsap, reducedMotion } = useScrollMotion()

const items = computed(() => t('included.items'))
// icon names follow the R3.4.3 service list order
const ICONS = [
  'store', 'catalog', 'crm', 'payment', 'delivery', 'stock',
  'order', 'notify', 'analytics', 'admin', 'market', 'growth'
]

// scrub progress (0..1) drives the ribbon, the wave strip and the card entry
const progress = ref(0)

// R4 — the progress strip is an «equalizer» wave: every tick grows/shrinks
// with the progress itself (no overlay riding on top). Client-only render
// (SSR paints a static stand-in strip, PSlider pattern).
const WAVE_N = 180
const hydrated = ref(false)

function waveShape(i) {
  const d = i / (WAVE_N - 1) - progress.value
  const passed = 1 / (1 + Math.exp(d * 400)) // smooth pass-edge (~±1%)
  const bump = Math.exp(-((d * 60) ** 2)) * 6 // swell right at the edge
  return { h: 8 + passed * 5 + bump, passed }
}

function waveH(i) {
  return waveShape(i).h
}

function waveColor(i) {
  const { passed } = waveShape(i)
  const c = Math.round(122 + (255 - 122) * passed)
  return `rgba(${c},${c},${c},${(0.25 + 0.75 * passed).toFixed(2)})`
}

let mm = null

function initPin() {
  mm = gsap.matchMedia()

  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
    const sectionEl = rootEl.value
    sectionEl.classList.add('is-motion')
    const track = trackEl.value
    const cards = [...track.querySelectorAll('.included-card')]

    // R4 — cards enter from the right SLIGHTLY LOWER and settle onto one
    // level as they travel in (replaces the static cascade offsets).
    // Geometry is derived from the track x (no per-frame DOM reads).
    let baseLeft = 0
    let cardOffsets = []
    const measure = () => {
      baseLeft = track.getBoundingClientRect().left - (Number(gsap.getProperty(track, 'x')) || 0)
      cardOffsets = cards.map((c) => c.offsetLeft)
    }
    measure()

    const DROP = 64
    const placeCards = () => {
      const tx = Number(gsap.getProperty(track, 'x')) || 0
      const endX = -Math.max(0, track.scrollWidth - window.innerWidth)
      const vw = window.innerWidth
      // R6: near the end of the scrub EVERY card levels out — the drop is
      // capped by the remaining track travel (last card included)
      const remain = Math.min(1, Math.max(0, (tx - endX) / 600))
      const remainE = remain * remain * (3 - 2 * remain)
      cards.forEach((c, i) => {
        const left = baseLeft + cardOffsets[i] + tx
        const t = Math.min(1, Math.max(0, (left - vw * 0.42) / (vw * 0.55)))
        const e = t * t * (3 - 2 * t) // smoothstep — плавный подъезд
        gsap.set(c, { y: Math.min(e, remainE) * DROP })
      })
    }

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: measure
      }
    })
    // the ribbon starts at the mockup offset (first card cut by the edge)
    // and traverses the whole list; the last card ends fully in view.
    // The wave strip and the card placement live on the SAME timeline (not
    // raw scroll progress) — one smoothed scrub, «той же величиной»
    // R6: a short dead-zone start so the aligned first card (flush with the
    // container edge) is actually visible when the pin catches — without it
    // the scrub moves the track from the very first pixel (S3's hold pattern)
    const proxy = { p: 0 }
    tl.to(track, {
      x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
      duration: 1,
      ease: 'none'
    }, 0.06)
    tl.to(proxy, {
      p: 1,
      duration: 1,
      ease: 'none',
      onUpdate() {
        progress.value = proxy.p
        placeCards()
      }
    }, 0.06)
    placeCards()

    return () => {
      sectionEl.classList.remove('is-motion')
      gsap.set(track, { clearProps: 'all' })
      cards.forEach((c) => gsap.set(c, { clearProps: 'transform' }))
      progress.value = 0
    }
  })
}

// R7 (фото 18): in the static modes the ribbon scrolls natively — the
// equalizer strip follows that scroll. In pin mode the ribbon is clipped
// (scrollLeft stays 0), so the listener never fights the timeline proxy.
function onRibbonScroll() {
  const el = frameEl.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  if (max > 0) progress.value = el.scrollLeft / max
}

onMounted(() => {
  hydrated.value = true
  sectionReveal(rootEl.value)
  initPin()
  frameEl.value?.addEventListener('scroll', onRibbonScroll, { passive: true })
})

onBeforeUnmount(() => {
  frameEl.value?.removeEventListener('scroll', onRibbonScroll)
  mm?.revert()
})
</script>

<template>
  <section id="included" ref="rootEl" class="section-included">
    <div class="section-included__body">
      <div class="container">
        <div class="section-included__head">
          <SectionTitle class="section-included__title v2-mask" :text="t('v2.included_title')" />
          <p class="section-included__lead v2-reveal">{{ t('included.lead') }}</p>
        </div>

        <!-- R4 equalizer strip: each tick grows/shrinks with the progress -->
        <div class="section-included__ticks v2-reveal" aria-hidden="true">
          <svg
            v-if="hydrated"
            class="section-included__wave"
            viewBox="0 0 1440 24"
            preserveAspectRatio="none"
          >
            <rect
              v-for="i in WAVE_N"
              :key="i"
              :x="(i - 1) * 8"
              :y="(24 - waveH(i - 1)) / 2"
              width="2"
              :height="waveH(i - 1)"
              :fill="waveColor(i - 1)"
            />
          </svg>
          <span v-else class="section-included__wave section-included__wave--static" />
        </div>
      </div>

      <!-- full-bleed cards ribbon. R15: the reveal lives on the RIBBON, not
           on the cards — cards beyond the right edge never intersect the
           shared batch, kept their pre-hide translateY and got their bottom
           clipped by the scroll container («обрезается секция») -->
      <div ref="frameEl" class="section-included__ribbon v2-reveal">
        <div ref="trackEl" class="section-included__track">
          <div v-for="(item, i) in items" :key="i" class="included-card">
            <IconService :name="ICONS[i] || 'growth'" />
            <p class="included-card__name">{{ item }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-included {
  // NB: no overflow on the section itself — clipping the PINNED element made
  // Chrome report a full-viewport layout shift on pin enter/leave (CLS ~1.9,
  // found in R3-P6); the ribbon wrapper clips instead (like S2's frame)
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm

  // R3.4.2: pinned = exactly one viewport, content centred
  &.is-motion {
    height: 100svh;
    padding-block: 0;
    display: flex;
    align-items: center;
  }

  &.is-motion &__body {
    width: 100%;
  }

  &__head {
    display: flex;
    gap: $spacing-8;
    align-items: flex-start;
  }

  &__title {
    flex: 1;
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
    white-space: pre-line;

    :deep(.section-title__accent) {
      white-space: inherit;
    }
  }

  &__lead {
    width: calc(569px * var(--k));
    font-size: 24px; // mockup lead size
    letter-spacing: -0.03em;
    line-height: normal;
    color: var(--color-text-muted);
  }

  // R4 equalizer strip: 24px lane of ticks whose heights follow the scrub
  &__ticks {
    position: relative;
    height: 24px;
    margin-top: 128px; // R6: head-to-strip gap (1440-class screens)
  }

  &__wave {
    display: block;
    width: 100%;
    height: 24px;

    // pre-hydration stand-in: the same 2/8 tick rhythm, centred 8px strip
    &--static {
      background-image: repeating-linear-gradient(
        90deg,
        rgba(122, 122, 122, 0.25) 0 2px,
        transparent 2px 8px
      );
      background-size: 100% 8px;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__ticks {
      display: none; // прогресс скрыт в reduce (BUILD_V2)
    }
  }

  // ribbon --------------------------------------------------------------------
  &__ribbon {
    position: relative;
    margin-top: $spacing-11; // R6: 64 between the strip and the cards
  }

  &__track {
    display: flex;
    gap: $spacing-7;
    align-items: stretch; // R8 (фото 25): every card takes the same height
    width: max-content;
  }

  // pin mode: the ribbon clips only horizontally (dropped-in cards must not
  // be cut off, R6); the track starts flush with the container's left edge
  // and ends on its right edge (R8, фото 26 — the last card lines up there)
  &.is-motion &__ribbon {
    overflow: visible;
    overflow-x: clip;
  }

  &.is-motion &__track {
    padding-inline: calc((100vw - var(--sbw, 0px) - min(100vw - var(--sbw, 0px) - #{$container-pad} * 2, var(--container-max))) / 2);
  }

  // static modes (no pin): the ribbon scrolls natively so all 12 cards are
  // reachable; the strip stays at 0 (start state)
  &:not(.is-motion) &__ribbon {
    overflow-x: auto;
    scrollbar-width: none;
    // R10 (r6-s6): scrolled cards dissolve at the edges instead of being
    // hard-cut by the viewport (S2's fade treatment)
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &:not(.is-motion) &__track {
    padding-inline: $container-pad;

    @include respond(md) {
      padding-inline: $container-pad-m;
    }
  }
}

// R8 (фото 25): on desktop a card grows to fit its name in ONE line
// (width: auto + nowrap), so every card is the same height.
// R10 (r6-s2): icons a touch lighter than muted; hovering the card tints
// them into the deep red 3C0A09 (тон заказчика)
.included-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: auto;
  min-width: calc(416px * var(--k));
  min-height: calc(225px * var(--k)); // mockup card 416×225
  padding: $spacing-7;
  border: 1px solid var(--color-border-table);
  border-radius: 12px; // mockup card radius
  flex-shrink: 0;
  // R12/R14: icons a step lighter; NO hover effects on these cards (the
  // brighten-and-redden hover belongs to the S8 step cards)
  color: color-mix(in srgb, var(--color-text-muted) 45%, var(--color-text-secondary));

  &__name {
    font-size: calc(24px * var(--k));
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin-top: $spacing-7;
    white-space: nowrap;
    color: var(--color-text); // the tintable `color` above is for icons only
  }
}

@include respond(lg) {
  .section-included__head {
    flex-direction: column;
    gap: $spacing-6;

    .section-included__lead {
      width: 100%;
      max-width: 640px;
    }
  }
}

// R7 (фото 18): narrower cards on tablets — the cut-off neighbour makes the
// horizontal scroll obvious; R8: names may wrap to two lines here, the
// stretched track keeps the heights equal
@include respond(lg) {
  .included-card {
    width: 348px;
    min-width: 0;
    min-height: 196px;

    // R9 (фото 1): every name box reserves TWO lines, so one-line cards keep
    // the same text-container height as the wrapped ones
    &__name {
      white-space: normal;
      min-height: 2.4em; // 2 lines × line-height 1.2
    }
  }
}

@include respond(md) {
  .section-included {
    &__lead {
      font-size: $fs-body-lg-m;
    }

    &__ticks {
      margin-top: $spacing-11; // R6: scaled-down 128
    }

    &__track {
      gap: $spacing-5;
    }
  }

  .included-card {
    width: 264px;
    min-height: 168px;
    padding: $spacing-6;

    &__name {
      font-size: $fs-body-lg;
    }
  }
}

@include respond(md) {
  // R28: card gaps cap at 16 on phones
  .section-included__track {
    gap: $spacing-4;
  }

  .section-included__title {
    font-size: $fs-h2-m;
  }
}
</style>
