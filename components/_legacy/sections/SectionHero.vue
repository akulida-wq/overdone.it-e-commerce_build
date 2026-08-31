<script setup>
// R2.7 Hero (spur.us reference, photo r2-s12): centered composition —
// eyebrow → big 2-line H1 with the red accent → one short sub line →
// buttons row → mono timeline note. The background stays reserved: a faint
// grid, a low-opacity glow and thin arcs BEHIND the text (light parallax).
// The H1 keeps the LCP-safe cover-strip entrance from stage 7.
const { t } = useLang()
const { scrollTo, reducedMotion, gsap, ScrollTrigger } = useScrollMotion()

const TELEGRAM_URL = 'https://t.me/overdoneit'

const sectionEl = ref(null)
const titleWrap = ref(null)
const bgEl = ref(null)

// TODO(ASSET): когда 3D-фигура появится в public/img/hero-3d.webp —
// переключить на true (runtime-проба файла засоряла бы консоль 404-ми)
const HAS_HERO_ASSET = false

function goToContact() {
  scrollTo('#contact')
}

// --- H1 line-by-line entrance ----------------------------------------------
// LCP-safe reveal: the H1 text itself is never hidden, removed or rebuilt
// (any hide-then-show re-qualifies the headline as a late LCP candidate).
// Bg-colored cover strips are laid OVER each rendered line (measured via
// Range.getClientRects) and collapse one by one, while the H1 gets a small
// transform settle — painted content moved by transform keeps its original
// (early) LCP timestamp.
function coverLineReveal(h1) {
  const wrap = titleWrap.value
  const range = document.createRange()
  range.selectNodeContents(h1)
  const wrapRect = wrap.getBoundingClientRect()

  // merge inline fragments (accent spans) into per-line boxes
  const lines = []
  Array.from(range.getClientRects()).forEach((r) => {
    if (r.width < 1 || r.height < 1) return
    const line = lines.find((l) => Math.abs(l.top - r.top) < 3)
    if (line) {
      line.left = Math.min(line.left, r.left)
      line.right = Math.max(line.right, r.right)
      line.bottom = Math.max(line.bottom, r.bottom)
    } else {
      lines.push({ top: r.top, left: r.left, right: r.right, bottom: r.bottom })
    }
  })

  const covers = lines.map((l) => {
    const el = document.createElement('span')
    el.className = 'section-hero__line-cover'
    el.setAttribute('aria-hidden', 'true')
    Object.assign(el.style, {
      left: `${l.left - wrapRect.left - 6}px`,
      top: `${l.top - wrapRect.top - 2}px`,
      width: `${l.right - l.left + 12}px`,
      height: `${l.bottom - l.top + 4}px`
    })
    wrap.appendChild(el)
    return el
  })

  gsap.to(covers, {
    scaleY: 0,
    transformOrigin: 'top center',
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.09,
    onComplete: () => covers.forEach((c) => c.remove())
  })

  gsap.fromTo(h1, { y: 14 }, { y: 0, duration: 0.9, ease: 'power2.out', clearProps: 'transform' })
}

const preloading = useState('od-preloader-active', () => false)

onMounted(async () => {
  if (reducedMotion.value) return

  // light parallax of the background composition
  if (bgEl.value) {
    gsap.fromTo(
      bgEl.value,
      { y: -30 },
      {
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }
    )
  }

  // The title entrance plays only on loads where the session preloader runs:
  // the overlay masks the hide-then-split moment, and on repeat visits the
  // hero simply stands (nothing is pre-hidden in CSS, so the SSR paint — and
  // with it the LCP — happens immediately, not after hydration).
  if (!preloading.value) return

  // slow device/network: the overlay's CSS-only exit has already fired (or is
  // about to) before hydration got here — keep the static hero rather than
  // hiding visible content to replay the entrance
  if (performance.now() > 1000) return

  await document.fonts.ready

  // fonts came in after the overlay already left (edge case) → same choice
  if (!preloading.value) return

  // start together with the overlay fade-out (the gate opens at fade start);
  // the watcher fires pre-render, so the hide+split never paints un-animated
  await new Promise((resolve) => {
    const stop = watch(preloading, (v) => {
      if (!v) {
        stop()
        resolve()
      }
    })
  })

  const h1 = titleWrap.value?.querySelector('h1')
  const staggerEls = sectionEl.value.querySelectorAll('.js-intro')

  if (h1) coverLineReveal(h1)

  gsap.fromTo(
    staggerEls,
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.08,
      delay: 0.45,
      clearProps: 'transform'
    }
  )
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === sectionEl.value) st.kill()
  })
})
</script>

<template>
  <section id="hero" ref="sectionEl" class="section-hero">
    <!-- reserved background: faint grid + glow + thin arcs behind the text -->
    <div ref="bgEl" class="section-hero__bg" aria-hidden="true">
      <span class="section-hero__glow" />
      <!-- TODO(ASSET): 3D-фигура с прода — положить public/img/hero-3d.webp -->
      <img
        v-if="HAS_HERO_ASSET"
        class="section-hero__asset"
        :src="'/img/hero-3d.webp'"
        alt=""
        width="880"
        height="880"
      />
      <svg v-else class="section-hero__arcs" viewBox="0 0 900 620" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="450" cy="330" r="292" stroke="var(--color-border-strong)" stroke-width="1" stroke-dasharray="3 9" />
        <circle cx="450" cy="330" r="196" stroke="var(--color-border-strong)" stroke-width="1" opacity="0.6" />
        <path d="M188 470c-46-210 96-390 300-402" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.55" />
        <path d="M262 540c-70-160 30-360 216-408" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.25" />
        <circle cx="488" cy="68" r="4" fill="var(--color-accent)" opacity="0.8" />
        <circle cx="450" cy="38" r="3" fill="var(--color-text-muted)" />
        <circle cx="740" cy="360" r="3" fill="var(--color-accent)" opacity="0.5" />
        <circle cx="160" cy="250" r="2.5" fill="var(--color-text-muted)" opacity="0.7" />
      </svg>
    </div>

    <div class="container section-hero__inner">
      <SectionEyebrow class="js-intro section-hero__eyebrow" :label="t('hero.eyebrow')" />
      <div ref="titleWrap" class="section-hero__title-wrap">
        <SectionTitle tag="h1" :text="t('hero.title')" class="section-hero__title" />
      </div>
      <!-- R2.7: одна короткая строка-суб (старые абзацы остались в локалях) -->
      <p class="section-hero__sub text-secondary js-intro">{{ t('hero.lead') }}</p>
      <div class="section-hero__actions js-intro">
        <PButton variant="primary" @click="goToContact">{{ t('cta.discuss') }}</PButton>
        <PButton variant="secondary" :href="TELEGRAM_URL" target="_blank">
          {{ t('cta.telegram') }}
        </PButton>
      </div>
      <p class="section-hero__timeline js-intro">{{ t('hero.timeline') }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 92vh;
  padding-top: $spacing-14; // room for the absolute header
  overflow: hidden;

  // faint spur-like grid across the hero, fading out towards the edges
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, var(--color-border) 1px, transparent 1px),
      linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
    background-size: 88px 88px;
    -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%);
    mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%);
    pointer-events: none;
  }

  // background composition behind the text, deliberately quiet
  &__bg {
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(900px, 90vw);
    aspect-ratio: 900 / 620;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__glow {
    @include accent-glow(620px, 0.35);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &__asset {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.35;
  }

  &__arcs {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  // centered column ----------------------------------------------------------
  &__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__title-wrap {
    position: relative; // anchors the intro line covers
    margin-top: $spacing-6;
  }

  // hero-scale headline: big, still capped to ~2 lines in both locales
  // (UA is the longest — sized against it)
  &__title {
    max-width: 1280px;
    font-size: clamp(42px, 4.7vw, 68px);
    line-height: 1.02;
  }

  :deep(.section-hero__line-cover) {
    position: absolute;
    z-index: 2;
    background: var(--color-bg);
    pointer-events: none;
  }

  &__sub {
    max-width: 620px;
    margin-top: $spacing-6;
    font-size: $fs-body-lg;
    line-height: $lh-body-lg;
    letter-spacing: $ls-body-lg;

    @include respond(md) {
      font-size: $fs-body-lg-m;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $spacing-4;
    margin-top: $spacing-8;
  }

  &__timeline {
    @include mono-caption;
    margin-top: $spacing-6;
  }

  @include respond(md) {
    min-height: 640px;
    padding-top: $spacing-16;
    padding-bottom: $spacing-13;
  }
}
</style>
