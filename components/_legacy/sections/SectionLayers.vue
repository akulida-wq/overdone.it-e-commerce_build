<script setup>
// R2.4 «The website is only the visible part» — neoconda-style rework
// (photos r2-s5 closed → r2-s6 unfolding → r2-s7 open with ladder labels).
//
// Composition: two-column section header (title left, description right),
// then a LARGE centered isometric scene. The top plane is a recognizable
// storefront mockup; each layer below carries its own mini-graphic matching
// its meaning (CRM kanban, payment card+receipt, warehouse cells, delivery
// route, message bubbles, analytics charts) — all stroke 1.5 + surface fills.
//
// CSS describes the FINAL exploded state (static fallback for mobile and
// reduced motion, labels as a legend list under the scene). On desktop with
// motion, a pinned scrub timeline of gsap.from() tweens starts CLOSED (the
// stack almost merged into one object) and unfolds layer by layer; each
// ladder label fades in (opacity only) as its layer arrives.
const { t } = useLang()
const { gsap } = useScrollMotion()

const LAYER_KEYS = ['layer_crm', 'layer_pay', 'layer_stock', 'layer_delivery', 'layer_notify', 'layer_analytics']

const sectionEl = ref(null)
const mockupRow = ref(null)
const rowEls = ref([])

const motionMode = ref(false)

let mm = null

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
    // apply the class SYNCHRONOUSLY before measuring: the compact .is-motion
    // scene variables change every offsetTop, and Vue's binding only lands on
    // nextTick — measuring first gave wrong collapse targets (layers flew
    // above the mockup)
    sectionEl.value.classList.add('is-motion')
    motionMode.value = true

    const rows = rowEls.value.filter(Boolean)
    const mockTop = mockupRow.value.offsetTop

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    })

    // closed state (photo s5): layers tucked under the mockup with a slight
    // 12px ledge each, so the stack reads as one solid object
    rows.forEach((row, i) => {
      // tucked 30px under the mockup's body + a 12px ledge per layer
      const collapseY = -(row.offsetTop - mockTop - 30 - (i + 1) * 12)
      const at = 0.4 + i * 0.9
      // the light rotate lives on the flat ROW wrapper — animating rotation
      // on the 3D-transformed plane itself made gsap rewrite the whole
      // transform and the isometry collapsed mid-flight
      tl.from(row, { y: collapseY, rotation: -3, duration: 2.2 }, at)
      // its ladder label fades in once the layer has ARRIVED (opacity only) —
      // earlier fade-in overlapped the neighbour label while the row was
      // still travelling
      const label = row.querySelector('.lscene__label')
      if (label) tl.from(label, { autoAlpha: 0, duration: 0.7 }, at + 2.0)
    })

    // the mockup's own label appears first
    const mockLabel = mockupRow.value.querySelector('.lscene__label')
    if (mockLabel) tl.from(mockLabel, { autoAlpha: 0, duration: 0.9 }, 0.2)

    // hold tail: the unfold completes at ~85% of the pin, the rest of the
    // scroll lets the finished scene rest (photo s7 state)
    tl.to({}, { duration: 1.3 })

    return () => {
      motionMode.value = false
    }
  })
})

onBeforeUnmount(() => {
  mm?.revert()
})
</script>

<template>
  <section
    id="layers"
    ref="sectionEl"
    class="section section-layers"
    :class="{ 'is-motion': motionMode }"
  >
    <div class="container section-layers__inner">
      <!-- two-column section header: title left, description right -->
      <div class="section-layers__head">
        <SectionTitle class="section-layers__title" :text="t('layers.title')" />
        <div class="section-layers__intro">
          <p class="body-lg text-secondary">{{ t('layers.p1') }}</p>
          <!-- R2.4: p3 не выводится (см. локали), вывод p4 оставлен как акцент -->
          <p class="body-lg section-layers__accent">{{ t('layers.p4') }}</p>
        </div>
      </div>

      <!-- large centered isometric scene -->
      <div class="lscene">
        <div class="lscene__stage">
          <!-- storefront mockup on top -->
          <div ref="mockupRow" class="lscene__row lscene__row--mockup" :style="{ '--i': 0 }">
            <div class="lscene__plane lscene__plane--mockup">
              <div class="shop-mock" aria-hidden="true">
                <div class="shop-mock__bar">
                  <span class="shop-mock__dot" />
                  <span class="shop-mock__nav" />
                  <span class="shop-mock__nav shop-mock__nav--short" />
                  <span class="shop-mock__cart" />
                </div>
                <div class="shop-mock__body">
                  <div class="shop-mock__img">
                    <IconSystem name="store" :size="24" />
                  </div>
                  <div class="shop-mock__info">
                    <span class="shop-mock__l shop-mock__l--title" />
                    <span class="shop-mock__l" />
                    <span class="shop-mock__l shop-mock__l--price" />
                    <span class="shop-mock__btn" />
                  </div>
                </div>
              </div>
            </div>
            <div class="lscene__label lscene__label--left">
              <span class="lscene__label-text">
                <span class="lscene__name">{{ t('layers.layer_store.name') }}</span>
                <span class="lscene__desc">{{ t('layers.layer_store.desc') }}</span>
              </span>
              <span class="lscene__leader" aria-hidden="true" />
            </div>
          </div>

          <!-- 6 process layers, each with its own mini-graphic -->
          <div
            v-for="(key, i) in LAYER_KEYS"
            :key="key"
            :ref="(el) => (rowEls[i] = el)"
            class="lscene__row"
            :style="{ '--i': i + 1 }"
          >
            <div class="lscene__plane">
              <!-- CRM: kanban -->
              <svg v-if="key === 'layer_crm'" class="lscene__art" viewBox="0 0 240 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="var(--color-text-muted)" stroke-width="1.5">
                  <rect x="14" y="10" width="60" height="10" rx="3" fill="var(--color-surface-2)" stroke="none" />
                  <rect x="14" y="26" width="60" height="16" rx="4" />
                  <rect x="14" y="48" width="60" height="16" rx="4" />
                  <rect x="90" y="10" width="60" height="10" rx="3" fill="var(--color-surface-2)" stroke="none" />
                  <rect x="90" y="26" width="60" height="16" rx="4" stroke="var(--color-accent)" />
                  <rect x="166" y="10" width="60" height="10" rx="3" fill="var(--color-surface-2)" stroke="none" />
                  <rect x="166" y="26" width="60" height="16" rx="4" />
                </g>
              </svg>
              <!-- Payments: card + receipt -->
              <svg v-else-if="key === 'layer_pay'" class="lscene__art" viewBox="0 0 240 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="var(--color-text-muted)" stroke-width="1.5">
                  <rect x="40" y="14" width="88" height="52" rx="6" fill="var(--color-surface-2)" />
                  <rect x="52" y="28" width="16" height="11" rx="2" />
                  <path d="M40 52h88" />
                  <rect x="152" y="8" width="46" height="60" rx="4" />
                  <path d="M160 22h30M160 32h30M160 42h18" />
                  <circle cx="186" cy="54" r="4" fill="var(--color-accent)" stroke="none" />
                </g>
              </svg>
              <!-- Warehouse: cells -->
              <svg v-else-if="key === 'layer_stock'" class="lscene__art" viewBox="0 0 240 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="var(--color-text-muted)" stroke-width="1.5">
                  <template v-for="r in 2" :key="r">
                    <rect v-for="c in 6" :key="c" :x="24 + (c - 1) * 34" :y="10 + (r - 1) * 30" width="26" height="24" rx="3" :fill="(r + c) % 3 === 0 ? 'var(--color-surface-2)' : 'none'" />
                  </template>
                  <rect x="126" y="40" width="26" height="24" rx="3" stroke="var(--color-accent)" />
                </g>
              </svg>
              <!-- Delivery: dashed route with pins -->
              <svg v-else-if="key === 'layer_delivery'" class="lscene__art" viewBox="0 0 240 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20 58C70 20 120 66 164 34c22-16 40-14 56-8" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="3 7" stroke-linecap="round" />
                <circle cx="20" cy="58" r="4" fill="var(--color-text-muted)" />
                <circle cx="120" cy="47" r="3" fill="var(--color-text-muted)" />
                <path d="M220 50c0-6-4.5-10-10-10s-10 4-10 10c0 7 10 16 10 16s10-9 10-16Z" stroke="var(--color-accent)" stroke-width="1.5" fill="none" />
              </svg>
              <!-- Notifications: message bubbles -->
              <svg v-else-if="key === 'layer_notify'" class="lscene__art" viewBox="0 0 240 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="var(--color-text-muted)" stroke-width="1.5">
                  <path d="M36 14h70a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H52l-12 10V22a8 8 0 0 1 8-8Z" fill="var(--color-surface-2)" />
                  <path d="M50 26h44M50 34h28" stroke="var(--color-text-muted)" />
                  <path d="M204 34h-64a8 8 0 0 0-8 8v12a8 8 0 0 0 8 8h52l12 10V42a8 8 0 0 0-8-8Z" transform="translate(0 -2)" />
                  <circle cx="206" cy="34" r="5" fill="var(--color-accent)" stroke="none" />
                </g>
              </svg>
              <!-- Analytics: bars + rising line -->
              <svg v-else class="lscene__art" viewBox="0 0 240 76" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g stroke="var(--color-text-muted)" stroke-width="1.5">
                  <path d="M24 64h192" />
                  <rect x="44" y="44" width="14" height="20" rx="2" fill="var(--color-surface-2)" />
                  <rect x="70" y="34" width="14" height="30" rx="2" fill="var(--color-surface-2)" />
                  <rect x="96" y="40" width="14" height="24" rx="2" fill="var(--color-surface-2)" />
                  <rect x="122" y="26" width="14" height="38" rx="2" fill="var(--color-surface-2)" />
                </g>
                <path d="M152 52c18-10 30-22 60-34" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" />
                <circle cx="212" cy="18" r="3.5" fill="var(--color-accent)" />
              </svg>
            </div>

            <!-- ladder label: sides alternate (store=left, crm=right, …) -->
            <div class="lscene__label" :class="i % 2 === 0 ? 'lscene__label--right' : 'lscene__label--left'">
              <span class="lscene__label-text">
                <span class="lscene__name">{{ t(`layers.${key}.name`) }}</span>
                <span class="lscene__desc">{{ t(`layers.${key}.desc`) }}</span>
              </span>
              <span class="lscene__leader" aria-hidden="true" />
            </div>
          </div>
        </div>

        <!-- static fallback (mobile / reduced motion): labels as a list -->
        <ul class="lscene__legend">
          <li v-for="key in ['layer_store', ...LAYER_KEYS]" :key="`legend-${key}`" class="lscene__legend-item">
            <p class="lscene__name">{{ t(`layers.${key}.name`) }}</p>
            <p class="lscene__desc">{{ t(`layers.${key}.desc`) }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-layers {
  // pinned mode: everything fits one viewport
  &.is-motion {
    padding-block: $spacing-5;
  }

  &.is-motion .section-layers__inner {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  // compact scene metrics while pinned so the full stack + labels fit 100vh
  &.is-motion .lscene {
    --plane-w: 400px;
    --plane-h: 78px;
    --mock-h: 184px;
    --stack-top: 148px;
    --layer-gap: 63px;
    margin-top: $spacing-6;
  }

  &__head {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: $spacing-11;
    align-items: start;

    @include respond(lg) {
      grid-template-columns: 1fr;
      gap: $spacing-6;
    }
  }

  &__intro {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    max-width: 520px;
  }

  &__accent {
    color: var(--color-text);
  }
}

// ---------------------------------------------------------------------------
// Scene (CSS = final exploded state)
// ---------------------------------------------------------------------------
.lscene {
  --plane-w: 420px;
  --plane-h: 96px;
  --mock-h: 230px;
  --stack-top: 190px;
  --layer-gap: 82px;
  --ledge: 12px;

  margin-top: $spacing-9;

  @include respond(md) {
    --plane-w: 250px;
    --plane-h: 66px;
    --mock-h: 160px;
    --stack-top: 136px;
    --layer-gap: 60px;
  }

  &__stage {
    position: relative;
    height: calc(var(--stack-top) + 5 * var(--layer-gap) + var(--plane-h) + 48px);
    perspective: 1500px;
    perspective-origin: 50% 0%;
  }

  &__row {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(var(--stack-top) + (var(--i) - 1) * var(--layer-gap));
    z-index: calc(10 - var(--i));

    &--mockup {
      top: 0;
      z-index: 12;
    }
  }

  .is-motion & &__row {
    will-change: transform, opacity;
  }

  &__plane {
    position: relative;
    width: var(--plane-w);
    height: var(--plane-h);
    margin-inline: auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: $radius-md;
    transform: rotateX(55deg) rotateZ(-42deg);
    backface-visibility: hidden;
    transform-style: preserve-3d;

    &--mockup {
      height: var(--mock-h);
    }
  }

  // layer content (mini-graphics lie on the plane)
  &__art {
    position: absolute;
    inset: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
  }

  // ladder labels with leader lines --------------------------------------
  &__label {
    position: absolute;
    top: 50%;
    display: none; // legend is the default; ladder shows in motion mode
    align-items: center;
    gap: $spacing-4;
    width: calc(50% - var(--plane-w) / 2 + 24px);
    transform: translateY(-50%);
  }

  .is-motion & &__label {
    display: flex;
  }

  &__label--left {
    left: 0;
    flex-direction: row;
    text-align: right;

    .lscene__label-text {
      order: 0;
    }

    .lscene__leader {
      order: 1;
    }
  }

  &__label--right {
    right: 0;
    flex-direction: row;
    text-align: left;

    .lscene__label-text {
      order: 1;
    }

    .lscene__leader {
      order: 0;
    }
  }

  &__label-text {
    display: flex;
    flex-direction: column;
    gap: $spacing-1;
    max-width: 240px;
  }

  &__label--left &__label-text {
    margin-left: auto;
  }

  &__leader {
    flex: 1 1 24px;
    height: 1px;
    background: var(--color-border-strong);
  }

  &__name {
    @include mono-caption;
    color: var(--color-text);
  }

  &__desc {
    font-size: $fs-small;
    color: var(--color-text-muted);
    line-height: 1.45;
  }

  // legend (mobile / reduced motion) --------------------------------------
  &__legend {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    margin-top: $spacing-7;
    padding-top: $spacing-6;
    border-top: 1px solid var(--color-border);
  }

  .is-motion & &__legend {
    display: none;
  }
}

// ---------------------------------------------------------------------------
// Storefront mockup content (abstract shapes)
// ---------------------------------------------------------------------------
.shop-mock {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: $spacing-4;
  gap: $spacing-4;

  &__bar {
    display: flex;
    align-items: center;
    gap: $spacing-3;
    padding-bottom: $spacing-3;
    border-bottom: 1px solid var(--color-border);
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-accent);
  }

  &__nav {
    width: 52px;
    height: 6px;
    border-radius: 3px;
    background: var(--color-surface-2);

    &--short {
      width: 30px;
    }
  }

  &__cart {
    width: 16px;
    height: 16px;
    margin-left: auto;
    border: 1.5px solid var(--color-text-muted);
    border-radius: 4px;
  }

  &__body {
    display: flex;
    gap: $spacing-4;
    flex: 1;
    min-height: 0;
  }

  &__img {
    flex: 0 0 42%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    color: var(--color-text-muted);
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: $spacing-2;
  }

  &__l {
    height: 6px;
    border-radius: 3px;
    background: var(--color-surface-2);
    width: 85%;

    &--title {
      width: 65%;
      height: 8px;
    }

    &--price {
      width: 40%;
      background: var(--color-text-muted);
    }
  }

  &__btn {
    margin-top: $spacing-2;
    width: 64px;
    height: 18px;
    border-radius: $radius-pill;
    background: var(--color-accent);
  }
}
</style>
