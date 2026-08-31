<script setup>
// V2 S10 «We earn when the product earns» (Figma 887:50770): head with the
// two-line lead, then a 4-cell bordered row — red number, card title, the
// earn texts (v2.earn_cards) and a line-art icon. R3.10.3: the cells get
// their OWN left-to-right entrance (opacity 0→1 + a light rise, stagger
// 0.15) — more pronounced than the shared sectionReveal cascade.
const { t } = useLang()
const rootEl = ref(null)
const { sectionReveal, gsap, reducedMotion } = useScrollMotion()

// R9 (фото 9): the left-to-right 0→100% fade rides an IntersectionObserver
// instead of ScrollTrigger — the old trigger computed its start position
// before the pinned sections above inserted their spacers, so with
// `once: true` it could fire off-screen during load and the user never saw
// the animation. IO fires exactly when the row really enters the viewport.
let io = null

onMounted(() => {
  sectionReveal(rootEl.value)

  if (reducedMotion.value) return
  const cells = rootEl.value.querySelectorAll('.earn-cell')
  gsap.set(cells, { autoAlpha: 0 })
  io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      io = null
      gsap.to(cells, { autoAlpha: 1, duration: 0.7, ease: 'power1.out', stagger: 0.15 })
    },
    // fire once the row's top clears the bottom ~18% of the viewport
    { rootMargin: '0px 0px -18% 0px' }
  )
  io.observe(rootEl.value.querySelector('.section-earn__row'))
})

onBeforeUnmount(() => {
  io?.disconnect()
})

const cards = computed(() => t('v2.earn_cards'))
const ICONS = ['percent', 'growth', 'renew', 'balance']
</script>

<template>
  <section id="earn" ref="rootEl" class="section-earn">
    <div class="container">
      <div class="section-earn__head">
        <SectionTitle class="section-earn__title v2-mask" :text="t('align.title')" />
        <div class="section-earn__lead v2-reveal">
          <p>{{ t('v2.earn_lead_1') }}</p>
          <p>{{ t('v2.earn_lead_2') }}</p>
        </div>
      </div>

      <div class="section-earn__row">
        <article v-for="(card, i) in cards" :key="i" class="earn-cell">
          <div class="earn-cell__text">
            <p class="earn-cell__num">{{ String(i + 1).padStart(2, '0') }}</p>
            <h3 class="earn-cell__name">{{ card.title }}</h3>
            <p class="earn-cell__desc">{{ card.desc }}</p>
          </div>
          <div class="earn-cell__icon">
            <IconLine :name="ICONS[i]" :size="130" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-earn {
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
    font-size: calc(24px * var(--k)); // mockup lead size
    letter-spacing: -0.03em;
    line-height: normal;
    color: var(--color-text-muted);
  }

  // 4 cells sharing table borders
  &__row {
    display: flex;
    align-items: stretch;
    margin-top: $spacing-11;
  }
}

.earn-cell {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: $spacing-7;
  flex: 1;
  min-height: calc(328px * var(--k));
  padding: $spacing-7;
  border: 1px solid var(--color-border-table);

  & + & {
    border-left: 0;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $spacing-3; // R3.10.1: tighter text rhythm
  }

  &__num {
    font-size: $fs-body-lg;
    font-weight: $fw-medium;
    letter-spacing: $ls-body-lg;
    color: var(--color-accent);
  }

  &__name {
    font-size: calc(24px * var(--k));
    font-weight: 400;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  &__desc {
    font-size: $fs-body;
    letter-spacing: -0.03em;
    line-height: 1.5;
    color: var(--color-text-muted);
  }

  &__icon {
    display: flex;
    justify-content: center;
  }
}

@include respond(lg) {
  .section-earn__head {
    flex-direction: column;
    gap: $spacing-6;

    .section-earn__lead {
      width: 100%;
      max-width: 640px;
    }
  }

  .section-earn__row {
    flex-wrap: wrap;
  }

  .earn-cell {
    flex: 1 1 calc(50% - 1px);
    min-height: 280px;

    // 2×2: restore the collapsed shared borders
    &:nth-child(2n + 1) {
      border-left: 1px solid var(--color-border-table);
    }

    &:nth-child(n + 3) {
      border-top: 0;
    }
  }
}

@include respond(sm) {
  .earn-cell {
    flex: 1 1 100%;

    &:nth-child(n + 2) {
      border-top: 0;
      border-left: 1px solid var(--color-border-table);
    }
  }
}

@include respond(md) {
  .section-earn__lead {
    font-size: $fs-body-lg-m;
  }

  // R10: card names follow the same 24 -> 18 step as the other card names
  .earn-cell__name {
    font-size: $fs-body-lg;
  }

  // R11 (r6-s9): the wireframe art steps down a touch on phones
  .earn-cell__icon :deep(svg) {
    width: 100px;
    height: 100px;
  }
}


@include respond(md) {
  .section-earn__title {
    font-size: $fs-h2-m;
  }
}
</style>
