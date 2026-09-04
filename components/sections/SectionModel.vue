<script setup>
// V2 S5 statement — P8 motion (trionn about, refs/f3): the two statement
// lines are split into word spans by our own splitter ([accents] stay red);
// words surface from muted to white as the section scrubs (classList writes,
// never Vue :class — a re-render would wipe them). The captions + divider
// fade up once the statement is half-scrubbed. The big mark behind rotates
// ~40s/turn (Z — the only honest axis for a flat SVG) and drifts ±8px after
// the mouse with a lerp. Reduced motion: final state immediately, no spin.
const { t } = useLang()
const { gsap, reducedMotion } = useScrollMotion()

// split a locale line with [accent] markers into words
function splitLine(text) {
  const out = []
  const re = /\[([^\]]+)\]/g
  let last = 0
  let m
  const push = (chunk, key) => {
    chunk.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, key }))
  }
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) push(text.slice(last, m.index), false)
    push(m[1], true)
    last = re.lastIndex
  }
  if (last < text.length) push(text.slice(last), false)
  return out
}

const line1 = computed(() => splitLine(t('v2.statement_l1')))
const line2 = computed(() => splitLine(t('v2.statement_l2')))
const plain = computed(() =>
  `${t('v2.statement_l1')} ${t('v2.statement_l2')}`.replace(/[[\]]/g, '')
)

const rootEl = ref(null)
const textEl = ref(null)
const bgEl = ref(null)

let litCount = 0

// R5: the divider under the statement fills red by the same progress
const fillPct = ref(0)

function applyLit() {
  const spans = textEl.value?.querySelectorAll('.section-model__word')
  if (!spans) return
  spans.forEach((el, i) => el.classList.toggle('is-on', i < litCount))
}

// R5: clicking anywhere in the section flashes the mark to the accent color
// and spins it up fast (accelerate → decelerate), then everything settles
const markEl = ref(null)
let clickSpin = 0

function onSectionClick() {
  if (reducedMotion.value || !markEl.value) return
  // R6: a touch slower and longer (~1.3x), color eases in/out smoothly
  clickSpin += 720
  gsap.to(markEl.value, {
    rotation: clickSpin,
    duration: 1.45,
    ease: 'power2.inOut',
    overwrite: 'auto'
  })
  // R8: a deep muted red (заказчик: 3C0A09), not the full accent
  gsap.timeline()
    .to(markEl.value, { backgroundColor: '#3C0A09', duration: 0.3, ease: 'power2.inOut' }, 0)
    .to(markEl.value, { backgroundColor: '#1D1E20', duration: 0.85, ease: 'power2.inOut' }, 0.6)
}

// --- mouse parallax (lerp ±8px) ---------------------------------------------
let rafId = 0
let tx = 0
let ty = 0
let cx = 0
let cy = 0

function onMouseMove(e) {
  // R3.5.2: a touch more presence (was +-8px)
  tx = (e.clientX / window.innerWidth - 0.5) * 2 * 14
  ty = (e.clientY / window.innerHeight - 0.5) * 2 * 14
}

function parallaxLoop() {
  cx += (tx - cx) * 0.06
  cy += (ty - cy) * 0.06
  if (bgEl.value) bgEl.value.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`
  rafId = requestAnimationFrame(parallaxLoop)
}

let st = null
let capTl = null

onMounted(() => {
  if (reducedMotion.value) return

  rootEl.value.classList.add('is-anim')

  const total = line1.value.length + line2.value.length
  // R5: the text must be fully lit by the time the section content sits at
  // the centre of the window — the scrub starts earlier and ends at centre
  st = gsap.timeline({
    scrollTrigger: {
      trigger: textEl.value,
      start: 'top 85%',
      end: 'center 50%',
      scrub: true,
      onUpdate(self) {
        fillPct.value = self.progress
        const n = Math.round(self.progress * total)
        if (n !== litCount) {
          litCount = n
          applyLit()
        }
      }
    }
  })

  // captions + divider fade up once the statement is half-scrubbed
  capTl = gsap.fromTo(
    rootEl.value.querySelectorAll('.section-model__divider, .section-model__cap'),
    { y: 24, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: textEl.value, start: 'center 55%', once: true }
    }
  )

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafId = requestAnimationFrame(parallaxLoop)
  }
})

// locale switch rebuilds the spans without their lit classes — re-apply
watch(plain, () => nextTick(applyLit))

onBeforeUnmount(() => {
  st?.scrollTrigger?.kill()
  st?.kill()
  capTl?.scrollTrigger?.kill()
  capTl?.kill()
  window.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <section id="model" ref="rootEl" class="section-model" @pointerdown="onSectionClick">
    <div ref="bgEl" class="section-model__bg" aria-hidden="true">
      <div class="section-model__spin">
        <div ref="markEl" class="section-model__mark" />
      </div>
    </div>

    <div class="container section-model__inner">
      <p ref="textEl" class="section-model__statement">
        <span class="visually-hidden">{{ plain }}</span>
        <span class="section-model__line section-model__line--1" aria-hidden="true">
          <template v-for="(w, i) in line1" :key="`a${i}`">
            <span class="section-model__word" :class="{ 'section-model__word--key': w.key }">{{ w.w }}</span>
            {{ ' ' }}
          </template>
        </span>
        <span class="section-model__line" aria-hidden="true">
          <template v-for="(w, i) in line2" :key="`b${i}`">
            <span class="section-model__word" :class="{ 'section-model__word--key': w.key }">{{ w.w }}</span>
            {{ ' ' }}
          </template>
        </span>
      </p>

      <span class="section-model__divider" aria-hidden="true">
        <i class="section-model__divider-fill" :style="{ width: `${fillPct * 100}%` }" />
      </span>

      <div class="section-model__captions">
        <p class="section-model__cap">{{ t('v2.statement_cap_left') }}</p>
        <p class="section-model__cap">{{ t('v2.statement_cap_right') }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-model {
  position: relative;
  display: flex;
  align-items: center;
  min-height: calc(768px * var(--k));
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm
  // R31: «отступ от первой секции чуть-чуть больше» — the hero's bottom row
  // sits closer than the next section below; even the air out
  padding-top: calc(var(--rhythm-half) + #{$spacing-9} + #{$spacing-8}); // R31.2: ещё +40

  @include respond(md) {
    padding-top: calc(var(--rhythm-half) + #{$spacing-6});
  }
  overflow: hidden;

  &__bg {
    position: absolute;
    left: 50%;
    top: calc(50% - 12px); // R3.5.1: the mark rides 12px higher
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  // R5: the figure is a CSS-mask fill — recolorable (base #1D1E20, flashes
  // to the accent on click); the slow ambient spin lives on the wrapper so
  // the click-spin (gsap rotation on the mark itself) composes cleanly
  &__spin {
    @media (prefers-reduced-motion: no-preference) {
      animation: od-mark-spin 40s linear infinite;
    }
  }

  &__mark {
    display: block;
    width: calc(640px * var(--k)); // R3.0.A: grows on ≥2560
    aspect-ratio: 1;
    background-color: #1d1e20; // R5: mark tone (заказчик)
    mask: url('~/assets/icons/logo-mark-big.svg') center / contain no-repeat;
    -webkit-mask: url('~/assets/icons/logo-mark-big.svg') center / contain no-repeat;
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-7;
    max-width: calc(864px * var(--k) + #{$container-pad} * 2);
  }

  // R18: ONE line pitch everywhere — the old flex gap (15px) sat on top of
  // line-height 1, so the span-to-span distance differed from the wrapped
  // lines inside a span
  &__statement {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: $fs-h3;
    letter-spacing: $ls-h3;
    line-height: 1.15;
  }

  &__line {
    display: block;

    &--1 {
      text-align: right;
    }
  }

  // default = final state (reduced motion / no JS): white, accents red
  &__word {
    color: var(--color-text);
    transition: color 200ms ease;

    &--key {
      color: var(--color-accent);
    }
  }

  // scrub mode: words start muted and light up via .is-on
  &.is-anim &__word {
    color: var(--color-text-muted);

    &.is-on {
      color: var(--color-text);
    }

    &--key.is-on {
      color: var(--color-accent);
    }
  }

  &__divider {
    position: relative;
    width: 100%;
    height: 1px;
    background: var(--color-border-table);
  }

  // R5: fills red in step with the statement highlight
  &__divider-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--color-accent);
  }

  &__captions {
    display: flex;
    gap: $spacing-11;
    width: 100%;
  }

  &__cap {
    flex: 1;
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: normal;
    color: var(--color-text-muted);
  }

  // R3.5.3: the left caption is regular case (uppercase removed)

  @media (prefers-reduced-motion: reduce) {
    &__word {
      transition: none;
    }
  }
}

@keyframes od-mark-spin {
  to {
    rotate: 360deg;
  }
}

// R7 (фото 19): on tablets the two staggered lines collapse into ONE flowing
// left-aligned paragraph (free composition, like the hero) and the bg mark
// steps down
@include respond(lg) {
  .section-model {
    &__mark {
      width: 480px;
      height: 480px;
    }

    &__statement {
      display: block;
      line-height: 1.15;
    }

    &__line {
      display: inline;

      &--1 {
        text-align: left;
      }
    }
  }
}

@include respond(md) {
  .section-model {
    min-height: 560px;

    &__mark {
      width: 320px;
      height: 320px;
    }

    &__statement {
      font-size: $fs-h3-m;
    }

    &__captions {
      flex-direction: column;
      gap: $spacing-5;
    }

    &__cap {
      font-size: $fs-small;
    }
  }
}

</style>
