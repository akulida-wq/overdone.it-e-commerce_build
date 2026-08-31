<script setup>
// R2.10 «How the partnership begins» (daoism.systems “network of trust”
// reference, photo r2-s16). Desktop + motion: pinned section — LEFT a stack
// of glass step cards (number + title on the card), the top card flips away
// (up + slight rotate + fade) by scrub, revealing the next; RIGHT the current
// step's description cross-fades 250ms in sync; progress dots under the
// stack. Scrolling back reverses the flips (scrub timeline, no one-shots).
// Mobile / reduced motion: static vertical list of the same glass cards with
// the descriptions inside (v-if branches — no duplicated text for SR).
const { t } = useLang()
const { gsap } = useScrollMotion()

const items = computed(() => t('steps.items'))

const sectionEl = ref(null)
const stackEl = ref(null)

const motionMode = ref(false)
const active = ref(0)

let mm = null

function pad(n) {
  return String(n + 1).padStart(2, '0')
}

function initMotion() {
  mm = gsap.matchMedia()

  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
    motionMode.value = true
    active.value = 0
    const count = items.value.length

    let tl
    // the stack DOM appears only after the motionMode flip renders
    nextTick(() => {
      const cards = stackEl.value.querySelectorAll('.step-card')

      // initial stack: each card sits a bit lower, smaller and dimmer
      cards.forEach((el, i) => {
        gsap.set(el, {
          zIndex: count - i,
          y: i * 16,
          scale: 1 - i * 0.04,
          autoAlpha: Math.max(0.25, 1 - i * 0.18),
          transformOrigin: 'top center'
        })
      })

      tl = gsap.timeline({
        defaults: { duration: 0.8 },
        scrollTrigger: {
          trigger: sectionEl.value,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate(self) {
            active.value = Math.min(count - 1, Math.floor(self.progress * count))
          }
        }
      })

      // segment s: card s flips away, the rest advance one slot
      for (let s = 0; s < count - 1; s++) {
        tl.to(cards[s], { yPercent: -46, rotation: -7, autoAlpha: 0, ease: 'power2.in' }, s)
        for (let j = s + 1; j < count; j++) {
          const depth = j - s - 1
          tl.to(
            cards[j],
            {
              y: depth * 16,
              scale: 1 - depth * 0.04,
              autoAlpha: Math.max(0.25, 1 - depth * 0.18),
              ease: 'power2.out'
            },
            s
          )
        }
      }
      // hold tail: the last card stands alone for a beat before unpin
      tl.to({}, { duration: 0.6 })
    })

    return () => {
      tl?.scrollTrigger?.kill()
      tl?.kill()
      motionMode.value = false
      active.value = 0
    }
  })
}

onMounted(initMotion)

// locale switch re-renders the cards and wipes gsap's inline transforms —
// rebuild the whole motion context on the fresh DOM
watch(items, () => {
  mm?.revert()
  nextTick(initMotion)
})

onBeforeUnmount(() => {
  mm?.revert()
})
</script>

<template>
  <section id="steps" ref="sectionEl" class="section section-steps" :class="{ 'is-motion': motionMode }">
    <div class="container">
      <SectionTitle class="section-steps__title" :text="t('steps.title')" />

      <div class="section-steps__stage">
        <div class="section-steps__stack-col">
          <div ref="stackEl" class="section-steps__stack">
            <article v-for="(item, i) in items" :key="i" class="step-card">
              <span class="step-card__num">{{ pad(i) }} / {{ pad(items.length - 1) }}</span>
              <h3 class="step-card__title">{{ item.title }}</h3>
              <!-- static mode keeps the description with its card -->
              <template v-if="!motionMode">
                <p class="step-card__desc">{{ item.desc }}</p>
                <p v-if="item.desc_2" class="step-card__desc step-card__desc--extra">{{ item.desc_2 }}</p>
              </template>
            </article>
          </div>

          <div v-if="motionMode" class="section-steps__dots" aria-hidden="true">
            <span
              v-for="(item, i) in items"
              :key="i"
              class="section-steps__dot"
              :class="{ 'is-on': i <= active }"
            />
          </div>
        </div>

        <!-- pinned mode: the current step's text, cross-fading in sync -->
        <div v-if="motionMode" class="section-steps__texts">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="step-text"
            :class="{ 'is-active': active === i }"
          >
            <p class="step-text__desc">{{ item.desc }}</p>
            <p v-if="item.desc_2" class="step-text__desc step-text__desc--extra">{{ item.desc_2 }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-steps {
  // -------------------------------------------------------------------------
  // Default: static vertical list of glass cards (mobile / reduced motion)
  // -------------------------------------------------------------------------
  &__title {
    margin-top: $spacing-4;
  }

  &__stage {
    margin-top: $spacing-9;
  }

  &__stack {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
  }

  &__dots {
    display: none;
  }

  .step-card {
    padding: $spacing-6;
    @include glass;
    border-radius: $radius-lg;

    &__num {
      @include mono-caption;
      color: var(--color-accent);
    }

    &__title {
      margin-top: $spacing-4;
      font-size: $fs-h3-m;
      font-weight: 400;
      line-height: $lh-h3;
    }

    &__desc {
      margin-top: $spacing-3;
      color: var(--color-text-secondary);
      max-width: 560px;
    }

    &__desc--extra {
      margin-top: $spacing-2;
    }
  }

  // -------------------------------------------------------------------------
  // Pinned mode (≥1025px + motion): card stack left, synced text right
  // -------------------------------------------------------------------------
  &.is-motion &__stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    gap: $spacing-12;
    align-items: center;
    min-height: 62vh;
  }

  &.is-motion &__stack {
    position: relative;
    display: block;
    height: 400px;
  }

  &.is-motion .step-card {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: $spacing-8;
    will-change: transform;
    // stacked cards must not shine through each other — opaque surface
    // instead of the translucent glass tint (the border stays)
    background: var(--color-surface);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    .step-card__title {
      font-size: $fs-h3;
      max-width: 480px;
    }
  }

  // progress dots filling with the steps
  &.is-motion &__dots {
    display: flex;
    gap: $spacing-3;
    justify-content: center;
    margin-top: $spacing-7;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid var(--color-border-strong);
    transition: background-color 250ms ease, border-color 250ms ease;

    &.is-on {
      background: var(--color-accent);
      border-color: var(--color-accent);
    }
  }

  // right column: stacked texts, only the active one visible (250ms fade)
  &__texts {
    display: grid;
    align-content: center;
  }

  .step-text {
    grid-area: 1 / 1;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: opacity 250ms ease, transform 250ms ease, visibility 250ms;

    &.is-active {
      opacity: 1;
      visibility: visible;
      transform: none;
    }

    &__desc {
      font-size: $fs-body-lg;
      line-height: $lh-body-lg;
      letter-spacing: $ls-body-lg;
      color: var(--color-text);
      max-width: 480px;
    }

    &__desc--extra {
      margin-top: $spacing-4;
      color: var(--color-text-secondary);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__dot,
    .step-text {
      transition: none;
    }
  }
}
</style>
