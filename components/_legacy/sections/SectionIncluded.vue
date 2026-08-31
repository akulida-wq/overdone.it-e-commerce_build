<script setup>
// R2.5 «The entire technical side — on us» (produx “Trusted partners”
// reference, photos r2-s8/r2-s9/r2-s10): two-column section header, bigger
// square-ish GLASS cards (icon on top, name under it), and a produx-style
// auto-run — cards highlight one after another while a thin red progress bar
// under the grid fills across the cycle. Hovering a card captures the
// highlight; the run pauses on hover and while the section is off-screen.
// Старые intro_1..3/outro остались в локалях, но не выводятся.
const { t } = useLang()
const { reveal, reducedMotion } = useScrollMotion()

// icon per included.items index (order matches CONTENT_SOURCE list)
const ICON_ORDER = [
  'store', 'crm', 'card', 'tag', 'warehouse', 'order',
  'truck', 'bell', 'chart', 'gear', 'link'
]

const STEP_MS = 2200

const sectionEl = ref(null)
const items = computed(() => t('included.items'))

const activeIdx = ref(0)
const hoverIdx = ref(null)
const inView = ref(false)
// bar jumps (no transition) when captured by hover or on cycle reset
const barSnap = ref(false)

const shownIdx = computed(() => (hoverIdx.value !== null ? hoverIdx.value : activeIdx.value))
const barPct = computed(() => ((shownIdx.value + 1) / items.value.length) * 100)

let timer = null
let io = null

function tick() {
  if (hoverIdx.value !== null || !inView.value) return
  const next = (activeIdx.value + 1) % items.value.length
  // cycle restart: snap the bar back instead of animating right-to-left
  barSnap.value = next === 0
  activeIdx.value = next
  requestAnimationFrame(() => (barSnap.value = false))
}

function onEnter(i) {
  barSnap.value = true
  hoverIdx.value = i
  activeIdx.value = i
  requestAnimationFrame(() => (barSnap.value = false))
}

function onLeave() {
  hoverIdx.value = null
}

onMounted(() => {
  reveal(sectionEl.value.querySelectorAll('.js-head'), { stagger: 0.08 })
  // cards deliberately have NO .reveal class: the autorun's :class re-renders
  // wipe gsap's is-revealed, and the .reveal CSS shift (y:24) came back after
  // clearProps — inline from-values from the tween handle the pre-hide instead
  reveal(sectionEl.value.querySelectorAll('.included-card'), {
    stagger: 0.05,
    trigger: sectionEl.value.querySelector('.section-included__grid')
  })
  reveal(sectionEl.value.querySelector('.section-included__progress'))

  if (reducedMotion.value) return

  io = new IntersectionObserver((entries) => {
    inView.value = entries[0]?.isIntersecting ?? false
  }, { threshold: 0.25 })
  io.observe(sectionEl.value)

  timer = setInterval(tick, STEP_MS)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  io?.disconnect()
})
</script>

<template>
  <section id="included" ref="sectionEl" class="section section-included">
    <div class="container">
      <!-- two-column header: title left, lead right (R2.4/R2.5 pattern) -->
      <div class="section-included__head">
        <SectionTitle class="js-head reveal" :text="t('included.title')" />
        <p class="body-lg text-secondary js-head reveal">{{ t('included.lead') }}</p>
      </div>

      <ul class="section-included__grid">
        <li
          v-for="(item, i) in items"
          :key="i"
          class="included-card"
          :class="{ 'is-lit': shownIdx === i }"
          @mouseenter="onEnter(i)"
          @mouseleave="onLeave"
        >
          <IconSystem class="included-card__icon" :name="ICON_ORDER[i] || 'gear'" :size="32" />
          <span class="included-card__name">{{ item }}</span>
        </li>
      </ul>

      <!-- produx-style thin progress bar filling red across the cycle -->
      <div class="section-included__progress reveal" aria-hidden="true">
        <span
          class="section-included__progress-fill"
          :class="{ 'is-snap': barSnap }"
          :style="{ width: `${barPct}%` }"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-included {
  &__head {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: $spacing-11;
    align-items: start;

    p {
      max-width: 520px;
    }

    @include respond(lg) {
      grid-template-columns: 1fr;
      gap: $spacing-6;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: $spacing-4;
    margin-top: $spacing-10;

    @include respond(lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @include respond(md) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &__progress {
    position: relative;
    height: 2px;
    margin-top: $spacing-8;
    background: var(--color-border);
    border-radius: 1px;
    overflow: hidden;
  }

  &__progress-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--color-accent);
    transition: width 2200ms linear;

    &.is-snap {
      transition: none;
    }
  }
}

// bigger square-ish glass card: icon on top, name under it
.included-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: $spacing-6;
  min-height: 150px;
  padding: $spacing-6;
  @include glass;
  border-radius: $radius-md;
  transition: border-color 250ms ease, background-color 250ms ease;
  cursor: default;

  &__icon {
    color: var(--color-text-secondary);
    transition: color 250ms ease;
  }

  &__name {
    font-size: $fs-body;
    line-height: 1.35;
    color: var(--color-text-secondary);
    transition: color 250ms ease;
  }

  // the roaming highlight (auto-run or hover-captured)
  &.is-lit {
    border-color: rgba(241, 38, 37, 0.55);
    background: rgba(241, 38, 37, 0.05);

    .included-card__icon {
      color: var(--color-accent);
    }

    .included-card__name {
      color: var(--color-text);
    }
  }

  @include respond(md) {
    min-height: 120px;
    padding: $spacing-5;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &__icon,
    &__name {
      transition: none;
    }
  }
}
</style>
