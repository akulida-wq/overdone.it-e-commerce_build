<script setup>
// §11 Calculator: left — intro + 9 factors as mono chips (4 of them linked to
// sliders light up while "their" slider moves); right — glow-border card with
// 4 sliders and the resulting "X–Y%" range (counter animation, tabular nums).
const { t } = useLang()
const { gsap, reveal, reducedMotion } = useScrollMotion()

const sectionEl = ref(null)

// slider state: continuous 0–100 positions (R1 — smoother, more flexible
// sliders); integrations stays a natural 1–10 count
const margin = ref(35)
const volume = ref(30)
const aov = ref(35)
const integrations = ref(3)

// bucket the continuous position into the locale step labels for display
function bucketLabel(pos, steps) {
  const idx = Math.min(steps.length - 1, Math.floor((pos / 100) * steps.length))
  return String(steps[idx] ?? '')
}

const marginLabel = computed(() => bucketLabel(margin.value, t('calc.margin_steps')))
const volumeLabel = computed(() => bucketLabel(volume.value, t('calc.volume_steps')))
const aovLabel = computed(() => bucketLabel(aov.value, t('calc.aov_steps')))

// factor chip index linked to each slider (order of calc.factors)
const LINKED = { margin: 0, volume: 1, aov: 2, integrations: 4 }
const activeFactor = ref(null)
let factorTimer = null

function pulseFactor(key) {
  activeFactor.value = LINKED[key]
  clearTimeout(factorTimer)
  factorTimer = setTimeout(() => {
    activeFactor.value = null
  }, 900)
}

// TODO(FAKE): прозрачная эвристика для вовлечения, НЕ бизнес-логика.
// База 6%; маржа +0…2 п.п.; объём −0…2; чек −0…1; интеграции +0.5…1.5;
// clamp 2–12%; диапазон = [round(x−1), round(x+1)]. Входы непрерывные (0–100).
// Диапазоны согласовать с реальной экономикой перед продом.
function estimateRange(marginPos, volumePos, aovPos, integrCount) {
  const marginAdd = (marginPos / 100) * 2
  const volumeAdd = -(volumePos / 100) * 2
  const aovAdd = -(aovPos / 100) * 1
  const integrAdd = 0.5 + ((integrCount - 1) / 9) * 1.0
  const x = Math.min(12, Math.max(2, 6 + marginAdd + volumeAdd + aovAdd + integrAdd))
  return [Math.round(x - 1), Math.round(x + 1)]
}

const range = computed(() => estimateRange(margin.value, volume.value, aov.value, integrations.value))

// displayed numbers run through a 300ms gsap counter (snap to integers)
const displayed = reactive({ lo: range.value[0], hi: range.value[1] })
const counterObj = { lo: range.value[0], hi: range.value[1] }

watch(range, ([lo, hi]) => {
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
    duration: 0.3,
    ease: 'power2.out',
    snap: { lo: 1, hi: 1 },
    overwrite: true,
    onUpdate() {
      displayed.lo = counterObj.lo
      displayed.hi = counterObj.hi
    }
  })
})

const factors = computed(() => t('calc.factors'))

onMounted(() => {
  reveal(sectionEl.value.querySelectorAll('.js-head'), { stagger: 0.06 })
  reveal(sectionEl.value.querySelector('.calc-card'))
  reveal(sectionEl.value.querySelector('.js-outro'))
})

onBeforeUnmount(() => {
  clearTimeout(factorTimer)
})
</script>

<template>
  <section id="calc" ref="sectionEl" class="section section-calc">
    <div class="container section-calc__inner">
      <div class="section-calc__text">
        <SectionTitle class="section-calc__title js-head reveal" :text="t('calc.title')" />
        <p class="body-lg text-secondary js-head reveal">{{ t('calc.intro') }}</p>
        <p class="text-secondary js-head reveal">{{ t('calc.factors_intro') }}</p>

        <ul class="section-calc__factors js-head reveal">
          <li
            v-for="(factor, i) in factors"
            :key="i"
            class="calc-factor"
            :class="{ 'is-live': activeFactor === i }"
          >
            {{ factor }}
          </li>
        </ul>
      </div>

      <div class="calc-card reveal">
        <p class="calc-card__title">{{ t('calc.card_title') }}</p>

        <div class="calc-card__sliders">
          <PSlider
            v-model="margin"
            input-id="calc-margin"
            :label="t('calc.margin_label')"
            :min="0"
            :max="100"
            :key-step="25"
            :value-label="marginLabel"
            :ends="[t('calc.margin_steps')[0], t('calc.margin_steps')[3]]"
            @input="pulseFactor('margin')"
          />
          <PSlider
            v-model="volume"
            input-id="calc-volume"
            :label="t('calc.volume_label')"
            :min="0"
            :max="100"
            :key-step="20"
            :value-label="volumeLabel"
            :ends="[t('calc.volume_steps')[0], t('calc.volume_steps')[4]]"
            @input="pulseFactor('volume')"
          />
          <PSlider
            v-model="aov"
            input-id="calc-aov"
            :label="t('calc.aov_label')"
            :min="0"
            :max="100"
            :key-step="25"
            :value-label="aovLabel"
            :ends="[t('calc.aov_steps')[0], t('calc.aov_steps')[3]]"
            @input="pulseFactor('aov')"
          />
          <PSlider
            v-model="integrations"
            input-id="calc-integrations"
            :label="t('calc.integrations_label')"
            :min="1"
            :max="10"
            @input="pulseFactor('integrations')"
          />
        </div>

        <div class="calc-card__result">
          <p class="calc-card__result-label">{{ t('calc.result_label') }}</p>
          <p class="calc-card__result-value" aria-live="polite">
            <span class="calc-card__nums">{{ displayed.lo }}–{{ displayed.hi }}%</span>
            <span class="calc-card__suffix">{{ t('calc.result_suffix') }}</span>
          </p>
        </div>

        <p class="calc-card__disclaimer">{{ t('calc.disclaimer') }}</p>
      </div>
    </div>

    <div class="container">
      <p class="section-calc__outro body-lg text-secondary js-outro reveal">{{ t('calc.outro') }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-calc {
  &__inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: $spacing-11;
    align-items: start;

    @include respond(lg) {
      grid-template-columns: 1fr;
      gap: $spacing-8;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    max-width: 560px;
  }

  &__title {
    margin-top: $spacing-2;
    margin-bottom: $spacing-3;
  }

  &__factors {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-2;
    margin-top: $spacing-3;
  }

  &__outro {
    max-width: 720px;
    margin-top: $spacing-10;
  }
}

.calc-factor {
  padding: $spacing-2 $spacing-3;
  border: 1px solid var(--color-border);
  border-radius: $radius-pill;
  font-family: $font-mono;
  font-size: $fs-mono-m;
  letter-spacing: $ls-mono;
  color: var(--color-text-muted);
  transition: color 250ms ease, border-color 250ms ease;

  &.is-live {
    color: var(--color-accent);
    border-color: rgba(241, 38, 37, 0.5);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.calc-card {
  position: relative;
  padding: $spacing-8;
  @include glass;
  border-color: rgba(241, 38, 37, 0.35);
  box-shadow: 0 0 72px -20px var(--color-glow);

  &__title {
    @include mono-caption;
    color: var(--color-text-secondary); // muted падает ниже 4.5:1 на surface
  }

  &__sliders {
    display: flex;
    flex-direction: column;
    gap: $spacing-7;
    margin-top: $spacing-7;
  }

  &__result {
    margin-top: $spacing-8;
    padding-top: $spacing-6;
    border-top: 1px solid var(--color-border);
  }

  &__result-label {
    font-size: $fs-small;
    color: var(--color-text-secondary);
  }

  &__result-value {
    display: flex;
    align-items: baseline;
    gap: $spacing-3;
    margin-top: $spacing-2;
  }

  &__nums {
    font-size: $fs-h2;
    font-weight: 500;
    letter-spacing: $ls-h2;
    line-height: 1;
    font-variant-numeric: tabular-nums;

    @include respond(md) {
      font-size: $fs-h2-m;
    }
  }

  &__suffix {
    color: var(--color-text-secondary);
  }

  // обязательный дисклеймер: не скрывать, не меньше 12px
  &__disclaimer {
    margin-top: $spacing-5;
    font-size: 13px;
    line-height: 1.5;
    color: var(--color-text-secondary);
  }

  @include respond(md) {
    padding: $spacing-5;
  }
}
</style>
