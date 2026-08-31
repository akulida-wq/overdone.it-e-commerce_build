<script setup>
// V2 S6 «Two ways to build» (Figma 887:50833): two 640px glass cards —
// classic (soft white) vs partner (soft red) — each with a circle-mark,
// title, subtitle, dotted dividers, five «label: value» rows with semantic
// Material Symbols icons (BUILD_V2 mapping, muted left / red right) and a
// block button. Entrance/hover motion arrives in P5.
const { t } = useLang()
const rootEl = ref(null)
const { sectionReveal, gsap, reducedMotion, ScrollTrigger } = useScrollMotion()

onMounted(() => {
  sectionReveal(rootEl.value)

  // R5: the cards get their OWN reveal that CLEARS its inline transform when
  // done — the shared v2-reveal end-state (inline translate) was overriding
  // the hover scale
  if (reducedMotion.value) return
  const cards = rootEl.value.querySelectorAll('.compare-card')
  gsap.set(cards, { autoAlpha: 0, y: 24 })
  gsap.to(cards, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: rootEl.value, start: 'top 78%', once: true },
    onComplete() {
      gsap.set(cards, { clearProps: 'all' })
    }
  })
})

const { scrollTo } = useScrollMotion()

const rows = computed(() => t('v2.compare_rows'))

// BUILD_V2 icon mapping per row: [classic, partner]
const ROW_ICONS = [
  ['receipt_long', 'payments'],
  ['warning', 'shield'],
  ['target', 'trending_up'],
  ['build', 'autorenew'],
  ['alt_route', 'done_all']
]

function goToHow() {
  scrollTo('#layers')
}

function goToContact() {
  scrollTo('#contact')
}
</script>

<template>
  <section id="compare" ref="rootEl" class="section-compare">
    <div class="container">
      <div class="section-compare__head">
        <SectionTitle class="section-compare__title v2-mask" :text="t('compare.title')" />
        <p class="section-compare__lead v2-reveal">{{ t('v2.compare_lead') }}</p>
      </div>

      <div class="section-compare__cards">
        <!-- classic -->
        <div class="compare-card">
          <div class="compare-card__header">
            <div class="compare-card__title-row">
              <span class="compare-card__mark" aria-hidden="true">
                <i /><i /><i /><i />
              </span>
              <h3 class="compare-card__title">{{ t('v2.classic_title') }}</h3>
            </div>
            <p class="compare-card__sub">{{ t('v2.classic_sub') }}</p>
          </div>

          <span class="compare-card__dots" aria-hidden="true" />

          <ul class="compare-card__rows">
            <li v-for="(row, i) in rows" :key="`c-${i}`" class="compare-card__row">
              <IconMs :name="ROW_ICONS[i][0]" :size="24" />
              <p class="compare-card__text">
                <span class="compare-card__label">{{ row.label }}: </span>{{ row.classic }}
              </p>
            </li>
          </ul>

          <span class="compare-card__dots" aria-hidden="true" />

          <!-- R11: the classic card leads to the MAIN site's form («узнать детали
               по старому формату») -->
          <PButton variant="secondary" block href="https://overdone.it/#contact" target="_blank">{{ t('v2.classic_cta') }}</PButton>
        </div>

        <!-- partner -->
        <div class="compare-card compare-card--partner">
          <div class="compare-card__header">
            <div class="compare-card__title-row">
              <span class="compare-card__mark compare-card__mark--red" aria-hidden="true">
                <i /><i /><i /><i />
              </span>
              <h3 class="compare-card__title">{{ t('v2.partner_title') }}</h3>
              <span class="compare-card__badge">{{ t('v2.compare_badge') }}</span>
            </div>
            <p class="compare-card__sub">{{ t('v2.partner_sub') }}</p>
          </div>

          <span class="compare-card__dots" aria-hidden="true" />

          <ul class="compare-card__rows">
            <li v-for="(row, i) in rows" :key="`p-${i}`" class="compare-card__row">
              <IconMs :name="ROW_ICONS[i][1]" :size="24" />
              <p class="compare-card__text">
                <span class="compare-card__label">{{ row.label }}: </span>{{ row.partner }}
              </p>
            </li>
          </ul>

          <span class="compare-card__dots" aria-hidden="true" />

          <PButton variant="primary" block @click="goToContact">{{ t('cta.discuss') }}</PButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-compare {
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm

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
  }

  &__lead {
    width: calc(569px * var(--k));
    font-size: 24px; // mockup lead size
    letter-spacing: -0.03em;
    line-height: normal;
    color: var(--color-text-muted);
  }

  // R3.6.3: one shared row grid — the right card can't drift by a pixel
  &__cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: $spacing-7;
    margin-top: $spacing-11;
  }
}

.compare-card {
  // zones: title-row / sub / dots / row x5 / dots / button = 10 shared tracks
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 10;
  align-content: start;
  padding: $spacing-7;
  // R5 hover: the card grows ~8px and lights up softly
  transition: transform 350ms cubic-bezier(0.45, 0, 0.55, 1),
    border-color 350ms cubic-bezier(0.45, 0, 0.55, 1),
    background-color 350ms cubic-bezier(0.45, 0, 0.55, 1);

  &:hover {
    transform: scale(1.0125);
    border-color: var(--color-border-strong);
    background: rgba(255, 255, 255, 0.07);
  }

  &--partner:hover {
    background: rgba(241, 38, 37, 0.08);
    border-color: rgba(241, 38, 37, 0.45);
  }
  border: 1px solid var(--color-border-table);
  border-radius: 12px; // mockup card radius
  background: rgba(255, 255, 255, 0.05);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);

  // rows icons inherit these colors
  color: var(--color-text-muted);

  &--partner {
    background: rgba(241, 38, 37, 0.05);
    border-color: rgba(241, 38, 37, 0.25);
    color: var(--color-accent);
  }

  // header/rows dissolve so their children join the card's shared tracks
  &__header,
  &__rows {
    display: contents;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: $spacing-3;
  }

  // 2×2 overlapping circles mark (mockup logo chip); R5: spins 90° left
  // while the card is hovered (ease-in-out both ways)
  &__mark {
    display: block;
    position: relative;
    width: 25px;
    height: 24px;
    flex-shrink: 0;
    transition: transform 450ms cubic-bezier(0.45, 0, 0.55, 1);

    i {
      position: absolute;
      width: 12px;
      height: 12px;
      border: 1px solid var(--color-text);
      border-radius: 50%;

      &:nth-child(1) { left: 0; top: 0; }
      &:nth-child(2) { right: 0; top: 0; }
      &:nth-child(3) { left: 0; bottom: 0; }
      &:nth-child(4) { right: 0; bottom: 0; }
    }

    &--red {
      transform: rotate(-45deg);

      i {
        border-color: var(--color-accent);
      }
    }
  }

  &:hover &__mark {
    transform: rotate(-90deg);

    &--red {
      transform: rotate(-135deg);
    }
  }

  &__title {
    font-size: $fs-h3-m;
    letter-spacing: $ls-h3;
    line-height: 1.1;
    font-weight: 400;
    color: var(--color-text);

    .compare-card--partner & {
      color: var(--color-accent);
    }
  }

  &__badge {
    margin-left: auto;
    padding: $spacing-2 $spacing-3;
    border: 1px solid rgba(241, 38, 37, 0.25);
    border-radius: $radius-pill;
    font-size: $fs-small;
    letter-spacing: -0.03em;
    color: var(--color-accent);
  }

  &__sub {
    margin-top: $spacing-3; // R3.6.2: tighter title-to-description gap
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    color: var(--color-text-muted);
  }

  // dotted separator (2px dots, 4px pitch)
  &__dots {
    margin-top: $spacing-6; // R15 (фото 5): 32 -> 24
    height: 2px;
    background-image: repeating-linear-gradient(
      90deg,
      currentColor 0 2px,
      transparent 2px 4px
    );
    opacity: 0.25;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: $spacing-3;
    margin-top: $spacing-4;

    &:first-child {
      margin-top: $spacing-7;
    }
  }

  // block button zone
  :deep(.p-button) {
    margin-top: $spacing-7;
  }

  &__text {
    font-size: 18px; // R5 (was 16)
    letter-spacing: -0.03em;
    line-height: 1.5;
    color: var(--color-text);
    font-weight: $fw-medium;
  }

  &__label {
    color: var(--color-text-secondary);
    font-weight: 400;
  }
}

@include respond(lg) {
  .section-compare__head {
    flex-direction: column;
    gap: $spacing-6;

    .section-compare__lead {
      width: 100%;
      max-width: 640px;
    }
  }
}

@include respond(md) {
  .section-compare {
    &__lead {
      font-size: $fs-body-lg-m;
    }

    &__cards {
      display: flex;
      flex-direction: column;
      gap: $spacing-5;
    }
  }

  .compare-card {
    grid-template-rows: auto;
    grid-row: auto;
    padding: $spacing-6;

    // R10 (r6-s7): the 18px row tier steps to 16 on phones, matching the
    // 20 -> 18 step of the descriptions
    &__text {
      font-size: 16px;
    }

    :deep(.icon-ms) {
      font-size: 20px;
    }
  }
}


@include respond(md) {
  .section-compare__title {
    font-size: $fs-h2-m;
  }
}
</style>
