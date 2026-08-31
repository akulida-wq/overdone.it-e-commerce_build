<script setup>
// V2 S1 Hero (Figma node 887:49936): the red 3D cart behind everything,
// a top/bottom black vignette over it, the 128px two-line headline (line 1
// left-aligned, line 2 right-aligned, double red accents) and the bottom row
// with the buttons on the left and the mono-toned note on the right.
// P5 motion: the cascade (title lines out of their masks → sub row fade+up,
// cart fade+scale) plays ONLY behind the session preloader — repeat visits
// paint statically (LCP-safe, v1 lesson). The cart always idles with a ±6px
// float and follows the mouse with a lerp parallax (touch: float only).
const { t } = useLang()
const { scrollTo, gsap, reducedMotion } = useScrollMotion()

const sectionEl = ref(null)
const cartEl = ref(null)

function goToContact() {
  scrollTo('#contact')
}

function goToHow() {
  // «How it works» leads to the S3 explainer section
  scrollTo('#layers')
}

const preloading = useState('od-preloader-active', () => false)

// --- mouse tilt (R3.1.4: rotation, not translation) -------------------------
// The cursor tilts the cart in 3D: rotateY ±6° / rotateX ±4°, perspective
// 1000px on the parent, lerp 0.07. When the mouse leaves the page the
// targets drop to 0 and the same lerp glides the cart back. The rotation
// lives on the WRAPPER while gsap floats the img's own `y` — no channel clash.
let rafId = 0
let targetRX = 0
let targetRY = 0
let curRX = 0
let curRY = 0

const cartWrap = ref(null)

function onMouseMove(e) {
  targetRY = (e.clientX / window.innerWidth - 0.5) * 2 * 6
  targetRX = (e.clientY / window.innerHeight - 0.5) * 2 * -4
}

function onMouseLeave() {
  targetRX = 0
  targetRY = 0
}

function tiltLoop() {
  curRX += (targetRX - curRX) * 0.07
  curRY += (targetRY - curRY) * 0.07
  if (cartWrap.value) {
    cartWrap.value.style.transform = `rotateX(${curRX.toFixed(3)}deg) rotateY(${curRY.toFixed(3)}deg)`
  }
  rafId = requestAnimationFrame(tiltLoop)
}

onMounted(() => {
  if (reducedMotion.value) return

  // idle float ±10px (R3.1.4) — gsap `y` on the img itself
  gsap.to(cartEl.value, { y: 10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    rafId = requestAnimationFrame(tiltLoop)
  }

  // entrance cascade — only while the preloader still covers the page
  if (!preloading.value) return

  const lines = sectionEl.value.querySelectorAll('.section-title__line')
  const subEls = sectionEl.value.querySelectorAll('.js-hero-sub')

  gsap.set(lines, { yPercent: 110 })
  gsap.set(subEls, { y: 24, autoAlpha: 0 })
  gsap.set(cartEl.value, { autoAlpha: 0, scale: 1.04 })

  const play = () => {
    const tl = gsap.timeline()
    tl.to(cartEl.value, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'expo.out' }, 0)
      .to(lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' }, 0.1)
      .to(subEls, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform' }, 0.55)
  }

  const stop = watch(preloading, (v) => {
    if (!v) {
      stop()
      play()
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.documentElement.removeEventListener('mouseleave', onMouseLeave)
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <section id="hero" ref="sectionEl" class="section-hero">
    <!-- 3D cart + vignette, behind the text -->
    <div class="section-hero__bg" aria-hidden="true">
      <div ref="cartWrap" class="section-hero__cart-wrap">
        <img
          ref="cartEl"
          class="section-hero__cart"
          src="/img/v2/hero-3d.webp"
          srcset="/img/v2/hero-3d.webp 1600w, /img/v2/hero-3d-2600.webp 2600w"
          sizes="(max-width: 768px) 130vw, (max-width: 1024px) 112vw, 77.66vw"
          alt=""
          width="1288"
          height="714"
          fetchpriority="high"
        />
      </div>
      <span class="section-hero__vignette" />
    </div>

    <div class="section-hero__inner container">
      <h1 class="section-hero__title">
        <SectionTitle tag="span" class="section-hero__line section-hero__line--1" :text="t('v2.hero_title_l1')" />
        <SectionTitle tag="span" class="section-hero__line section-hero__line--2" :text="t('v2.hero_title_l2')" />
      </h1>

      <div class="section-hero__bottom">
        <div class="section-hero__actions js-hero-sub">
          <PButton variant="primary" @click="goToContact">{{ t('cta.discuss') }}</PButton>
          <PButton variant="secondary" @click="goToHow">{{ t('cta.how') }}</PButton>
        </div>
        <p class="section-hero__note js-hero-sub">{{ t('v2.hero_note') }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // R8 (фото 22): the hero adapts to the open browser window — buttons and
  // the note must always sit inside the first viewport
  min-height: max(640px, 100svh);
  padding-top: $spacing-14;
  padding-bottom: var(--rhythm-half); // R3.0.C unified rhythm
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    perspective: 1000px; // R3.1.4: the cart tilts in 3D after the cursor
  }

  // R4/R21: the cart fills the zone between the header (~96) and the
  // buttons row (100svh − ~190) and CENTRES itself in it on both axes —
  // on tall windows it used to hang small in the upper half. Width = the
  // zone height × 1.804 (image aspect), capped at 90vw; at 1440×900 this
  // resolves to the original R4 geometry (cart ≈ 96..710). Margin centring —
  // the tilt loop owns transform.
  &__cart-wrap {
    position: absolute;
    left: 50%;
    top: calc((100svh - 94px - min(49.9vw, 100svh - 286px)) / 2);
    width: min(90vw, calc((100svh - 286px) * 1.804));
    margin-left: max(-45vw, calc((100svh - 286px) * -0.902));
    will-change: transform;
  }

  &__cart {
    display: block;
    width: 100%;
    height: auto;
  }

  // black fade top/bottom over the cart (per the mockup gradient frame)
  &__vignette {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      var(--color-bg) 0.3%,
      rgba(7, 7, 7, 0.35) 15%,
      rgba(7, 7, 7, 0.35) 85%,
      var(--color-bg) 99.5%
    );
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex: 1; // R3.1.2: stretch so the headline can centre in the free zone
  }

  // 128px, two lines: first left, second right, red accents inside both.
  // R3.1.1: mockup line pitch is 138px at fs 128 → lh 1.0 + 8px gap.
  // R3.1.2: margin-block auto centres the block between header and buttons.
  // R3.1.6: the mockup shadow is a DROP_SHADOW on the glyphs — filter on the
  // h1 applies AFTER the line masks clip, so no hard-edged «plate» appears
  // (text-shadow inside overflow:hidden was clipped into a visible box).
  &__title {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    margin-block: auto;
    font-size: $fs-hero;
    font-weight: $fw-heading;
    letter-spacing: $ls-h1;
    line-height: 1;
    filter: drop-shadow(2px 2px 64px rgba(10, 10, 11, 0.75));
  }

  &__line {
    display: block;
  }

  &__line--2 {
    text-align: right;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-6;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-6;
  }

  &__note {
    font-size: $fs-h4;
    letter-spacing: $ls-h3;
    color: var(--color-text-secondary);
  }
}

// R7/R9 tablet (фото 5): full-viewport hero, the headline blows up to the
// section edges (centre-aligned, free composition) and the cart goes near
// edge-to-edge, still capped by the viewport height
@include respond(lg) {
  .section-hero {
    min-height: 100svh;

    &__title {
      // R10/R16: measured so BOTH locales wrap into 4 balanced lines (the
      // Title-Case UA headline is a touch wider)
      font-size: 11.05vw;
      text-align: center;
    }

    // R19: the same mockup split as on phones — [Your Online][Sales System]
    // / [With No][Upfront Fee] (proportional caps, so the behaviour matches)
    &__line--1 {
      max-width: 66vw;
      margin-inline: auto;
    }

    &__line--2 {
      text-align: center;
      max-width: 70vw;
      margin-inline: auto;
    }

    &__line :deep(.section-title__accent) {
      white-space: normal;
    }

    &__cart-wrap {
      // margin centring (not transform) — the tilt loop owns transform; auto
      // margins would stick a >100vw box to the left edge (over-constrained)
      left: 50%;
      width: min(130vw, calc(66svh * 1.804)); // image aspect 1288/714
      margin-left: max(-65vw, calc(66svh * -0.902));
      top: clamp(110px, 20svh, 300px);
    }
  }
}

// R12/R19 (Figma 1028:61207): phone composition is CONTENT-DRIVEN — the
// headline right under the header, the cart right under the headline, the
// buttons right under the cart. No viewport-stretching: on tall screens the
// old svh anchors tore the stack apart with dead gaps.
// Flow maths (any ≤768 width): title = 4 lines × 11.25vw + 12px of gaps;
// cart = 112vw wide → 62vw tall; fixed 24/32px joints between the blocks.
@include respond(md) {
  .section-hero {
    min-height: 0;
    padding-top: 96px;
    padding-bottom: $spacing-8;

    &__title {
      margin-block: 0;
      // reserve the 4-line height — the cart/buttons flow maths depend on it
      min-height: calc(45vw + 12px);
    }

    // R19 (фото 2): the exact mockup split — [Your Online][Sales System] /
    // [With No][Upfront Fee] — narrowed line boxes force the breaks at the
    // same words in BOTH locales ([Система][Онлайн-Продажів] etc.)
    &__line--1 {
      max-width: 66vw;
      margin-inline: auto;
    }

    &__line--2 {
      max-width: 70vw;
      margin-inline: auto;
    }

    // the accent chunks must be allowed to wrap here — their default nowrap
    // blocked the mockup's [Your Online][Sales System] break
    &__line :deep(.section-title__accent) {
      white-space: normal;
    }

    &__bottom {
      // reserves the cart's flow space: 24px + 62vw cart + 32px
      margin-top: calc(62vw + 56px);
    }

    &__cart-wrap {
      // margin centring (not transform) — the tilt loop owns transform
      left: 50%;
      width: 112vw;
      margin-left: -56vw;
      // header 96 + title (45vw + 12) + 24 gap
      top: calc(132px + 45vw);
    }

    // R10/R11 (r6-s5/s12): proportional — the same 4 centred edge-to-edge
    // lines at EVERY ≤768 width in both locales (a px cap broke the wrap on
    // portrait tablets)
    &__title {
      font-size: 11.25vw; // R16: re-measured for the Title-Case UA lines
      gap: $spacing-1;
    }

    &__bottom {
      flex-direction: column;
      align-items: stretch;
      gap: $spacing-6;
    }

    // R9: full-width stacked buttons
    &__actions {
      flex-direction: column;
      align-items: stretch;
      gap: $spacing-3;

      > * {
        width: 100%;
        justify-content: center;
      }
    }

    &__note {
      font-size: $fs-body-lg-m;
      text-align: center;
    }
  }
}

</style>
