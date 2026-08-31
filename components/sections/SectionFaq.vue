<script setup>
// V2 S11 FAQ (Figma 887:52451): full-width plashki with a 4px gap. Closed:
// soft fill, 32px muted question, plus. Open: brighter fill, red question,
// white answer, the plus rotated into a cross. Hover turns the question and
// the plus white (BUILD_V2). At most one open; smooth height comes in P8.
const { t } = useLang()
const rootEl = ref(null)
const { sectionReveal } = useScrollMotion()
onMounted(() => sectionReveal(rootEl.value))


const items = computed(() => t('faq.items'))
const openIdx = ref(null)

function toggle(i) {
  openIdx.value = openIdx.value === i ? null : i
}
</script>

<template>
  <section id="faq" ref="rootEl" class="section-faq">
    <div class="container">
      <SectionTitle class="section-faq__title v2-mask" :text="t('v2.faq_title')" />

      <div class="section-faq__list">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="faq-card v2-reveal"
          :class="{ 'is-open': openIdx === i }"
        >
          <button
            :id="`faq-${i}-button`"
            type="button"
            class="faq-card__trigger"
            :aria-expanded="openIdx === i ? 'true' : 'false'"
            :aria-controls="`faq-${i}-panel`"
            @click="toggle(i)"
          >
            <span class="faq-card__q">{{ item.q }}</span>
            <span class="faq-card__plus" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
          </button>
          <!-- grid-rows 0fr→1fr: smooth height without measuring (P8) -->
          <div
            :id="`faq-${i}-panel`"
            class="faq-card__panel"
            role="region"
            :aria-labelledby="`faq-${i}-button`"
            :aria-hidden="openIdx === i ? null : 'true'"
          >
            <div class="faq-card__panel-inner">
              <div class="faq-card__content">
                <p v-for="(para, j) in item.a.split('\n\n')" :key="j" class="faq-card__para">{{ para }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-faq {
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm

  &__title {
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 4px; // mockup plashki gap
    margin-top: $spacing-11;
  }
}

.faq-card {
  background: rgba(255, 255, 255, 0.03);
  transition: background-color 250ms ease;

  &__trigger {
    display: flex;
    align-items: center;
    gap: $spacing-7;
    width: 100%;
    padding: $spacing-7;
    text-align: left;
    @include focus-visible;
  }

  &__q {
    flex: 1;
    font-size: $fs-h4;
    letter-spacing: $ls-h3;
    line-height: 1;
    color: var(--color-text-muted);
    transition: color 250ms ease;
  }

  &__plus {
    display: inline-flex;
    color: var(--color-text-muted);
    transition: transform 250ms ease, color 250ms ease;
  }

  &:hover {
    .faq-card__q,
    .faq-card__plus {
      color: var(--color-text);
    }
  }

  &.is-open {
    background: rgba(255, 255, 255, 0.07);

    .faq-card__q {
      color: var(--color-accent);
    }

    .faq-card__plus {
      transform: rotate(45deg);
      color: var(--color-text);
    }
  }

  // grid-rows trick: 0fr → 1fr animates height without measuring
  &__panel {
    display: grid;
    grid-template-rows: 0fr;
    visibility: hidden;
    // R3.11.2: a touch slower, symmetric ease-in-out both ways
    transition: grid-template-rows 380ms cubic-bezier(0.4, 0, 0.2, 1), visibility 380ms;
  }

  &.is-open &__panel {
    grid-template-rows: 1fr;
    visibility: visible;
  }

  &__panel-inner {
    overflow: hidden;
    min-height: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-3;
    max-width: 800px;
    // R3.11.1: the negative top margin pulled the first line under the
    // overflow clip - the open answer's ascenders were shaved off
    padding: 0 $spacing-7 $spacing-7;
  }

  &__para {
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: normal;
    color: var(--color-text);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    .faq-card__q,
    .faq-card__plus,
    .faq-card__panel {
      transition: none;
    }
  }
}

@include respond(md) {
  .faq-card {
    &__trigger {
      padding: $spacing-5;
      gap: $spacing-5;
    }

    &__q {
      font-size: $fs-body-lg;
    }

    &__content {
      padding: 0 $spacing-5 $spacing-5;
    }
  }
}


@include respond(md) {
  .faq-card__para {
    font-size: $fs-body; // R15 (фото 6): answers 18 -> 16 on phones
  }
}

@include respond(md) {
  .section-faq__title {
    font-size: $fs-h2-m;
  }
}
</style>
