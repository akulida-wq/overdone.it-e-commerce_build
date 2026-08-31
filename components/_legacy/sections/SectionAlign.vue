<script setup>
// R2.12 «We earn when the product earns» (sharplink “Pioneering Productivity”
// reference, photo r2-s17, in our colours): left column — section title +
// intro on top, closing paragraph at the bottom; right column — four rows
// with numbered mono chips, the commitment text and a thin dashed line-art
// vector per meaning (stability shield/pulse, error-free check-flow, less
// manual work gears, convenient purchases cart). The old auto-flipping deck
// is gone (the pattern moved to Steps, R2.10).
const { t } = useLang()
const { reveal } = useScrollMotion()

const cards = computed(() => t('align.cards'))
const ICONS = ['shield', 'flow', 'gears', 'cart']

const sectionEl = ref(null)

onMounted(() => {
  reveal(sectionEl.value.querySelectorAll('.js-head'), { stagger: 0.08 })
  reveal(sectionEl.value.querySelectorAll('.align-row'), {
    stagger: 0.1,
    trigger: sectionEl.value.querySelector('.section-align__rows')
  })
  reveal(sectionEl.value.querySelector('.section-align__outro'))
})
</script>

<template>
  <section id="align" ref="sectionEl" class="section section-align">
    <div class="container section-align__inner">
      <div class="section-align__left">
        <SectionTitle class="js-head reveal" :text="t('align.title')" />
        <p class="section-align__intro body-lg text-secondary js-head reveal">{{ t('align.p1') }}</p>
        <p class="section-align__outro text-secondary reveal">{{ t('align.outro') }}</p>
      </div>

      <ul class="section-align__rows">
        <li v-for="(card, i) in cards" :key="i" class="align-row reveal">
          <span class="align-row__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="align-row__text">{{ card }}</p>

          <!-- dashed line-art vectors, one per meaning -->
          <svg v-if="ICONS[i] === 'shield'" class="align-row__art" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M60 8 100 22v26c0 22-16 36-40 40-24-4-40-18-40-40V22L60 8Z" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="3 6" stroke-linejoin="round" />
            <path d="M34 50h14l6-12 8 22 6-10h18" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />
            <circle cx="60" cy="8" r="2.5" fill="var(--color-text-muted)" />
          </svg>

          <svg v-else-if="ICONS[i] === 'flow'" class="align-row__art" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 70c22 0 20-44 48-44h20" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="3 6" stroke-linecap="round" />
            <rect x="6" y="62" width="16" height="16" rx="4" stroke="var(--color-text-muted)" stroke-width="1.5" />
            <rect x="52" y="40" width="16" height="16" rx="4" stroke="var(--color-text-muted)" stroke-width="1.5" />
            <circle cx="94" cy="26" r="14" stroke="var(--color-accent)" stroke-width="1.5" opacity="0.85" />
            <path d="m88 26 4.5 4.5L102 21" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <svg v-else-if="ICONS[i] === 'gears'" class="align-row__art" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="46" cy="42" r="22" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="4 7" />
            <circle cx="46" cy="42" r="8" stroke="var(--color-text-muted)" stroke-width="1.5" />
            <circle cx="86" cy="66" r="15" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="3 6" />
            <circle cx="86" cy="66" r="5" stroke="var(--color-accent)" stroke-width="1.5" opacity="0.85" />
            <path d="M63 54l8 5" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-linecap="round" />
          </svg>

          <svg v-else class="align-row__art" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14 18h12l12 44h44l10-30H34" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="3 6" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="44" cy="76" r="5" stroke="var(--color-text-muted)" stroke-width="1.5" />
            <circle cx="74" cy="76" r="5" stroke="var(--color-text-muted)" stroke-width="1.5" />
            <path d="M88 14v16M80 22h16" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.85" />
          </svg>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-align {
  &__inner {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: $spacing-12;
    align-items: start;

    @include respond(lg) {
      grid-template-columns: 1fr;
      gap: $spacing-8;
    }
  }

  &__left {
    display: flex;
    flex-direction: column;
    align-self: stretch;
  }

  &__intro {
    max-width: 420px;
    margin-top: $spacing-6;
  }

  // closing line sits at the bottom of the left column (sharplink layout)
  &__outro {
    max-width: 420px;
    margin-top: auto;
    padding-top: $spacing-8;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    border-top: 1px dashed var(--color-border-strong);
  }
}

.align-row {
  display: grid;
  grid-template-columns: 4ch minmax(0, 1fr) auto;
  align-items: center;
  gap: $spacing-6;
  padding: $spacing-6 0;
  border-bottom: 1px dashed var(--color-border-strong);

  &__num {
    @include mono-caption;
    color: var(--color-text-secondary);
  }

  &__text {
    font-size: $fs-body-lg;
    line-height: $lh-body-lg;
    letter-spacing: $ls-body-lg;
    max-width: 340px;

    @include respond(md) {
      font-size: $fs-body-lg-m;
    }
  }

  &__art {
    width: 120px;
    height: 96px;
    flex-shrink: 0;
    opacity: 0.9;
  }

  @include respond(md) {
    grid-template-columns: 4ch minmax(0, 1fr);
    row-gap: $spacing-4;

    &__art {
      grid-column: 2;
      width: 96px;
      height: 77px;
    }
  }
}
</style>
