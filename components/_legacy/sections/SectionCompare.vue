<script setup>
// R2.9 «Two ways to build» as two pricing-style cards side by side
// (orionix reference, photo r2-s15). Each card: model title, then the five
// comparison points as «criterion: value» rows with an icon — neutral
// dots/minuses for the classic model, red checkmarks for ours. The
// partnership card is the accented one: red border/glow, «Our model» badge
// and a CTA to #contact (the classic card has no CTA). Cards slide in with a
// slight spread (stagger 120ms). Mobile: stacked, our card first.
const { t } = useLang()
const { gsap, scrollTo, reducedMotion } = useScrollMotion()

const rows = computed(() => t('compare.rows'))

const wrapEl = ref(null)

function goToContact() {
  scrollTo('#contact')
}

onMounted(() => {
  if (reducedMotion.value) return
  const cards = wrapEl.value.querySelectorAll('.compare-card')
  // no horizontal spread on mobile: the pre-trigger x-offset (immediateRender)
  // pushed the stacked full-width card past the viewport → page-wide h-scroll
  const spread = window.matchMedia('(max-width: 768px)').matches ? 0 : 32
  gsap.fromTo(
    cards[0],
    { y: 48, x: spread, autoAlpha: 0 },
    { y: 0, x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: wrapEl.value, start: 'top 78%', once: true } }
  )
  gsap.fromTo(
    cards[1],
    { y: 48, x: -spread, autoAlpha: 0 },
    { y: 0, x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out', delay: 0.12,
      scrollTrigger: { trigger: wrapEl.value, start: 'top 78%', once: true } }
  )
})
</script>

<template>
  <section id="compare" class="section section-compare">
    <div class="container">
      <SectionTitle class="section-compare__title" :text="t('compare.title')" />

      <div ref="wrapEl" class="section-compare__cards">
        <!-- classic development (neutral) -->
        <div class="compare-card">
          <h3 class="compare-card__heading">{{ t('compare.classic_title') }}</h3>
          <ul class="compare-card__list">
            <li v-for="(row, i) in rows" :key="`c-${i}`" class="compare-point">
              <span class="compare-point__icon compare-point__icon--neutral" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 8h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </span>
              <span class="compare-point__text">
                <span class="compare-point__crit">{{ row.label }}:</span>
                {{ row.classic }}
              </span>
            </li>
          </ul>
        </div>

        <!-- partnership model (accented) -->
        <div class="compare-card compare-card--partner">
          <span class="compare-card__badge">{{ t('compare.badge') }}</span>
          <h3 class="compare-card__heading">{{ t('compare.partner_title') }}</h3>
          <ul class="compare-card__list">
            <li v-for="(row, i) in rows" :key="`p-${i}`" class="compare-point">
              <span class="compare-point__icon compare-point__icon--check" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m3 8.5 3.2 3.2L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="compare-point__text">
                <span class="compare-point__crit">{{ row.label }}:</span>
                {{ row.partner }}
              </span>
            </li>
          </ul>
          <PButton class="compare-card__cta" variant="primary" block @click="goToContact">
            {{ t('cta.discuss') }}
          </PButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-compare {
  &__title {
    margin-top: $spacing-4;
  }

  // two pricing-style cards side by side
  &__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $spacing-6;
    max-width: 1080px;
    margin-top: $spacing-9;
    align-items: stretch;

    @include respond(md) {
      grid-template-columns: 1fr;
    }
  }
}

.compare-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: $spacing-8;
  @include glass;

  &--partner {
    border-color: rgba(241, 38, 37, 0.45);
    box-shadow: 0 0 64px -18px var(--color-glow);

    // mobile: our card first
    @include respond(md) {
      order: -1;
    }
  }

  &__badge {
    position: absolute;
    top: $spacing-5;
    right: $spacing-5;
    padding: $spacing-1 $spacing-3;
    border: 1px solid rgba(241, 38, 37, 0.5);
    border-radius: $radius-pill;
    font-family: $font-mono;
    font-size: $fs-mono-m;
    letter-spacing: $ls-mono;
    // accent-hover: 5.2:1 на surface против 4.4:1 у accent (WCAG AA для 12px)
    color: var(--color-accent-hover);
  }

  &__heading {
    font-size: $fs-h3-m;
    letter-spacing: $ls-h3;
    padding-right: $spacing-14; // clear of the badge
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-5;
    margin-top: $spacing-7;
    flex: 1;
  }

  &__cta {
    margin-top: $spacing-8;
  }

  @include respond(md) {
    padding: $spacing-5;
  }
}

.compare-point {
  display: flex;
  align-items: flex-start;
  gap: $spacing-3;

  &__icon {
    display: inline-flex;
    flex-shrink: 0;
    margin-top: 3px;

    &--neutral {
      color: var(--color-text-muted);
    }

    &--check {
      color: var(--color-accent);
    }
  }

  &__text {
    color: var(--color-text);
    line-height: 1.5;
  }

  &__crit {
    color: var(--color-text-secondary);
  }
}
</style>
