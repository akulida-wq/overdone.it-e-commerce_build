<script setup>
// V2 S8 «How the partnership begins» — pin + scrub carousel (P7, daoism
// reference): the active card leaves with a blur+fade+scale-down shift while
// the next one rises from the stack behind it; the description on the right
// cross-fades 250ms in sync. Five equal progress segments, fully reversible.
// Hovering the active card lifts it slightly (CSS `translate` channel — it
// never clashes with gsap's transform y). Mobile / reduced-motion: a static
// vertical list of the cards with their texts (v-if branch — no duplicate
// text for screen readers). Locale switch rebuilds the whole context.
const { t } = useLang()
const { gsap, sectionReveal, reducedMotion } = useScrollMotion()

const tags = computed(() => t('v2.steps_tags'))
const titles = computed(() => t('v2.steps_titles'))
const items = computed(() => t('steps.items'))

const rootEl = ref(null)
const stackEl = ref(null)

const motionMode = ref(false)
const active = ref(0)

let mm = null

// R3.8.3 — daoism-style 3D tilt of the hovered card: ±5° after the cursor
// with a lerped return. The rotation lives on the inner .step-card__tilt
// wrapper — gsap owns the card's own transform (y/scale/blur).
let tiltEl = null
let tRX = 0
let tRY = 0
let cRX = 0
let cRY = 0
let tiltRaf = 0

function tiltLoop() {
  cRX += (tRX - cRX) * 0.12
  cRY += (tRY - cRY) * 0.12
  if (tiltEl) tiltEl.style.transform = `rotateX(${cRX.toFixed(2)}deg) rotateY(${cRY.toFixed(2)}deg)`
  tiltRaf = requestAnimationFrame(tiltLoop)
}

function onStackMove(e) {
  const card = e.target.closest('.step-card')
  if (!card) return
  const el = card.querySelector('.step-card__tilt')
  if (tiltEl && tiltEl !== el) {
    tiltEl.style.transform = ''
    cRX = 0
    cRY = 0
  }
  tiltEl = el
  const r = card.getBoundingClientRect()
  tRY = ((e.clientX - r.left) / r.width - 0.5) * 2 * 5
  tRX = ((e.clientY - r.top) / r.height - 0.5) * 2 * -5
}

function onStackLeave() {
  tRX = 0
  tRY = 0
}

function initMotion() {
  mm = gsap.matchMedia()

  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
    motionMode.value = true
    active.value = 0
    const count = titles.value.length

    let tl
    // the carousel DOM appears only after the motionMode flip renders
    nextTick(() => {
      // the page can unmount before this microtask lands (instant reload)
      if (!stackEl.value) return
      const cards = stackEl.value.querySelectorAll('.step-card')

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        stackEl.value.addEventListener('mousemove', onStackMove, { passive: true })
        stackEl.value.addEventListener('mouseleave', onStackLeave)
        tiltRaf = requestAnimationFrame(tiltLoop)
      }

      // R8 «по кругу» (фото 29–31, daoism): the cards ride the LEFT arc of a
      // wheel — the leaving one climbs up-left with a slight counter-tilt,
      // the next rises from bottom-left along the same arc into place
      cards.forEach((el, i) => {
        gsap.set(el, {
          zIndex: count - i,
          y: i === 0 ? 0 : 120,
          x: i === 0 ? 0 : -64,
          rotation: i === 0 ? 0 : 6,
          scale: i === 0 ? 1 : 0.92,
          autoAlpha: i === 0 ? 1 : 0,
          filter: i === 0 ? 'blur(0px)' : 'blur(12px)',
          transformOrigin: 'center center'
        })
      })

      tl = gsap.timeline({
        defaults: { duration: 0.8 },
        scrollTrigger: {
          trigger: rootEl.value,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          // R8: a soft assist-scroll to the nearest settled card so the user
          // never parks in a half-switched state
          snap: {
            snapTo(value) {
              const d = tl.duration()
              let best = 0
              for (let k = 0; k < count; k++) {
                const p = k === 0 ? 0 : Math.min(1, (k - 1 + 0.98) / d)
                if (Math.abs(p - value) < Math.abs(best - value)) best = p
              }
              return best
            },
            duration: { min: 0.15, max: 0.45 },
            delay: 0.1,
            ease: 'power2.out'
          },
          onUpdate(self) {
            active.value = Math.min(count - 1, Math.floor(self.progress * count))
          }
        }
      })

      for (let s = 0; s < count - 1; s++) {
        tl.to(cards[s], {
          y: -120,
          x: -64,
          rotation: -6,
          scale: 0.92,
          autoAlpha: 0,
          filter: 'blur(12px)',
          ease: 'power2.in'
        }, s)
        tl.fromTo(cards[s + 1], {
          y: 120,
          x: -64,
          rotation: 6,
          scale: 0.92,
          autoAlpha: 0,
          filter: 'blur(12px)'
        }, {
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          autoAlpha: 1,
          filter: 'blur(0px)',
          ease: 'power2.out'
        }, s + 0.18)
      }
      // hold tail: the last card stands for a beat before the pin releases
      tl.to({}, { duration: 0.6 })
    })

    return () => {
      tl?.scrollTrigger?.kill()
      tl?.kill()
      cancelAnimationFrame(tiltRaf)
      stackEl.value?.removeEventListener('mousemove', onStackMove)
      stackEl.value?.removeEventListener('mouseleave', onStackLeave)
      tiltEl = null
      motionMode.value = false
      active.value = 0
    }
  })
}

// R11 (r6-s8): IO-driven fade-up for the static cards (earn pattern) — runs
// whenever the static grid is (re)rendered
let stepsIo = null

function armStaticReveal() {
  stepsIo?.disconnect()
  stepsIo = null
  if (reducedMotion.value) return
  const cards = rootEl.value?.querySelectorAll('.js-step-static')
  if (!cards || !cards.length) return
  gsap.set(cards, { autoAlpha: 0, y: 24 })
  stepsIo = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      stepsIo.disconnect()
      stepsIo = null
      gsap.to(cards, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12 })
    },
    { rootMargin: '0px 0px -15% 0px' }
  )
  stepsIo.observe(cards[0])
}

onMounted(() => {
  sectionReveal(rootEl.value, { start: 'top 85%' })
  initMotion()
  nextTick(armStaticReveal)
})

watch(motionMode, (v) => {
  if (!v) nextTick(armStaticReveal)
})

// locale switch re-renders the cards and wipes gsap's inline transforms
watch(items, () => {
  mm?.revert()
  nextTick(initMotion)
})

onBeforeUnmount(() => {
  stepsIo?.disconnect()
  mm?.revert()
})
</script>

<template>
  <section id="steps" ref="rootEl" class="section-steps" :class="{ 'is-motion': motionMode }">
    <div class="container">
      <SectionTitle class="section-steps__title v2-mask" :text="t('steps.title')" />

      <!-- pinned mode: card stack left, synced text right -->
      <div v-if="motionMode" class="section-steps__stage">
        <div ref="stackEl" class="section-steps__stack">
          <article v-for="(title, i) in titles" :key="i" class="step-card">
            <div class="step-card__tilt">
              <div class="step-card__art" aria-hidden="true">
                <StepArt :step="i" />
              </div>
              <div class="step-card__top">
                <p class="step-card__num">
                  <span>{{ String(i + 1).padStart(2, '0') }}</span>
                  <span class="step-card__num-total"> / {{ String(titles.length).padStart(2, '0') }}</span>
                </p>
                <span class="step-card__tag">{{ tags[i] }}</span>
              </div>
              <h3 class="step-card__name">{{ title }}</h3>
            </div>
          </article>
        </div>

        <div class="section-steps__texts">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="step-text"
            :class="{ 'is-active': active === i }"
          >
            <span class="section-steps__line" aria-hidden="true" />
            <div class="section-steps__desc">
              <p>{{ item.desc }}</p>
              <p v-if="item.desc_2">{{ item.desc_2 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- static fallback (R7, фото 21): self-contained cards in a grid —
           2 per row on tablets, 1 per row on phones, desc INSIDE the card.
           R11 (r6-s8): the reveal is an own IntersectionObserver (NOT
           v2-reveal) — the shared batch could fire off-screen during load
           and leave the pre-hidden cards invisible forever -->
      <div v-else class="section-steps__grid">
        <article v-for="(title, i) in titles" :key="i" class="step-card step-card--static js-step-static">
          <div class="step-card__top">
            <p class="step-card__num">
              <span>{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="step-card__num-total"> / {{ String(titles.length).padStart(2, '0') }}</span>
            </p>
            <span class="step-card__tag">{{ tags[i] }}</span>
          </div>
          <div class="step-card__art" aria-hidden="true">
            <StepArt :step="i" />
          </div>
          <h3 class="step-card__name">{{ title }}</h3>
          <div class="section-steps__desc">
            <p>{{ items[i]?.desc }}</p>
            <p v-if="items[i]?.desc_2">{{ items[i].desc_2 }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-steps {
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm

  &__title {
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
  }

  // static fallback grid (R7) --------------------------------------------------
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $spacing-5;
    margin-top: $spacing-10;

    @include respond(640px) {
      grid-template-columns: 1fr;
    }
  }

  &__line {
    width: calc(80px * var(--k));
    height: 1px;
    background: var(--color-text-muted);
    opacity: 0.5;
    flex-shrink: 0;
  }

  &__desc {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    width: calc(414px * var(--k));
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: normal;
    color: var(--color-text-muted);
  }

  // pinned carousel -----------------------------------------------------------
  // R3.8.1: the pinned section is exactly one viewport; the stage is an
  // absolute overlay centred against the WINDOW, so the active card sits at
  // the vertical middle of the screen instead of hanging off the title
  &.is-motion {
    position: relative;
    height: 100svh;
  }

  &.is-motion &__stage {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    gap: $spacing-11;
    @include container;
  }

  &__stack {
    position: relative;
    width: calc(640px * var(--k));
    height: calc(432px * var(--k)); // 384 card + stack shadows below
    // R3.8.1: the box is 48 taller than the card — this margin makes the
    // ACTIVE CARD (not the box) sit at the exact viewport centre
    margin-top: calc(48px * var(--k));
    flex-shrink: 0;

    .step-card {
      position: absolute;
      inset: 0 0 auto 0;
      will-change: transform, filter;
      perspective: 1000px; // R3.8.3: the tilt layer rotates in 3D
      // hover lift on the dedicated `translate` channel (never fights gsap)
      transition: translate 300ms ease;

      &:hover {
        translate: 0 -6px;

        .step-card__tilt {
          border-color: var(--color-border-strong);
        }
      }
    }
  }

  // R8: the description column sits a touch further right of the card
  &.is-motion &__texts {
    margin-left: calc(48px * var(--k));
  }

  // right column: stacked texts, only the active one visible (250ms fade)
  &__texts {
    position: relative;
    display: grid;
    align-content: center;
    flex: 1;
  }

  .step-text {
    grid-area: 1 / 1;
    display: flex;
    align-items: center;
    gap: $spacing-7;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: opacity 250ms ease, transform 250ms ease, visibility 250ms;

    &.is-active {
      opacity: 1;
      visibility: visible;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .step-text {
      transition: none;
    }
  }
}

.step-card {
  position: relative;
  width: calc(640px * var(--k));
  height: calc(384px * var(--k));
  flex-shrink: 0;

  // R8 (фото 29): the VISIBLE card surface lives on the tilt layer — the
  // hover-tilt rotates the card itself, not just its content; gsap keeps
  // owning the outer element's transform (y/x/scale)
  &__tilt {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: $spacing-8;
    border: 1px solid transparent;
    border-radius: 12px; // mockup card radius
    background: var(--color-surface);
    overflow: hidden;
    will-change: transform;
    transition: border-color 300ms ease;
  }

  // R5: the art is 120% of the mockup block and rides 8px higher.
  // R14 (фото 1): the cube wireframes are a step brighter, and hovering the
  // CARD tints them into the deep red 3C0A09 (тон заказчика)
  &__art {
    position: absolute;
    left: 50%;
    top: calc(50% - 8px);
    transform: translate(-50%, -50%);
    width: calc(263px * var(--k));
    height: calc(264px * var(--k));
    pointer-events: none;
    color: color-mix(in srgb, var(--color-surface-2) 68%, var(--color-text-muted));
    transition: color 350ms ease;
  }

  &:hover &__art {
    color: #4c1919; // R17: тон заказчика (фото 2)
  }

  &__top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__num {
    font-size: calc(24px * var(--k));
    font-weight: $fw-medium;
    letter-spacing: -0.03em;
    color: var(--color-accent);
  }

  &__num-total {
    font-size: $fs-body;
    font-weight: 400;
    color: rgba(241, 38, 37, 0.5);
  }

  &__tag {
    padding: $spacing-2 $spacing-3;
    border: 1px solid var(--color-border-table);
    border-radius: $radius-pill;
    font-size: $fs-small;
    letter-spacing: -0.03em;
    // secondary: muted is below 4.5:1 at 14px on the surface card
    color: var(--color-text-secondary);
  }

  &__name {
    position: relative;
    font-size: $fs-h3;
    font-weight: 400;
    letter-spacing: $ls-h3;
    line-height: 1;
  }

  // R7 static card: normal flow — number/tag, art centred, name, description
  // (no tilt layer here, so the surface styles live on the card itself)
  &--static {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-5;
    padding: $spacing-6;
    border-radius: 12px;
    background: var(--color-surface);
    overflow: hidden;

    .step-card__art {
      position: static;
      transform: none;
      width: 176px;
      height: 176px;
      margin-inline: auto;
    }

    .step-card__name {
      font-size: $fs-h3-m;
      line-height: 1.1;
    }

    .section-steps__desc {
      width: 100%;
      font-size: $fs-body;
    }
  }
}

@include respond(xl) {
  // pin mode at 1280: the right column is narrower than the fixed 414px
  .section-steps__texts .section-steps__desc {
    width: auto;
    flex: 1;
    min-width: 0;
  }
}

@include respond(md) {
  // R28: card gaps cap at 16 on phones
  .section-steps__grid {
    gap: $spacing-4;
  }

  .section-steps__title {
    font-size: $fs-h2-m;
  }

  .step-card__num {
    font-size: $fs-body-lg; // R10: 24 -> 18 tier step on phones
  }
}
</style>
