<script setup>
// V2 S2 «Businesses growing with us» (Figma nodes 887:49994 final /
// 887:52786 full): a bordered «table» 1312 wide clipping a horizontal track
// of three equal 654px cells — title cell, Paparazzi card, «next» card. The
// static stage shows the track at offset 0 (exactly the mockup's start
// state); the pin + horizontal scroll + stroke-stretch arrive in P6/P7.
const { t, lang } = useLang()
const rootEl = ref(null)
const frameEl = ref(null)
const trackEl = ref(null)
const { sectionReveal, scrollTo, gsap, reducedMotion } = useScrollMotion()

// R6 mechanic (V2 stretch returned by the customer): the frame enters at
// its natural height WITH its top/bottom strokes; while pinned it stretches
// to the full viewport height — the internal dividers grow with it — and
// then the track scrubs horizontally. Left/right borders never exist
// (R3.2.2). Desktop only; below 1025px the cells stack.
let mm = null

function initPin() {
  mm = gsap.matchMedia()

  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
    const sectionEl = rootEl.value
    sectionEl.classList.add('is-motion')
    const frame = frameEl.value
    const track = trackEl.value

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top top',
        end: '+=170%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })
    // phase 1: the frame (and its dividers) stretches to the viewport height
    tl.fromTo(frame,
      { height: () => frame.offsetHeight },
      { height: () => window.innerHeight, duration: 0.3, ease: 'power1.out' }, 0)
    // phase 2: horizontal scroll to the last cell
    tl.to(track, {
      x: () => -(track.scrollWidth - frame.offsetWidth),
      duration: 1,
      ease: 'power1.inOut'
    }, 0.25)

    return () => {
      sectionEl.classList.remove('is-motion')
      gsap.set([frame, track], { clearProps: 'all' })
    }
  })
}

// trionn entrance (P6): the covers open from under a bottom clip while the
// image inside settles from a slight zoom; the meta rows follow with a
// fade+up. The title cell still uses the shared mask reveal.
onMounted(() => {
  sectionReveal(rootEl.value)
  // R31: create our triggers a tick LATE (like S8) — created synchronously
  // they measured the page WITHOUT the pin-spacers of the sections that now
  // sit ABOVE us (S2 moved before FAQ), started ~2250px early and even
  // ScrollTrigger.refresh() never re-derived them
  nextTick(() => {
    initPin()

    if (reducedMotion.value) return
    const covers = rootEl.value.querySelectorAll('.project-cell__cover')
    const imgs = rootEl.value.querySelectorAll('.project-cell__cover img')
    const metas = rootEl.value.querySelectorAll('.project-cell__meta')

    const tl = gsap.timeline({
      scrollTrigger: { trigger: rootEl.value, start: 'top 70%', once: true }
    })
    tl.fromTo(
      covers,
      { clipPath: 'inset(100% 0 0 0)', y: 40 },
      { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.15, ease: 'expo.out', stagger: 0.15 },
      0
    )
      .fromTo(
        imgs,
        { scale: 1.15 },
        { scale: 1, duration: 1.15, ease: 'expo.out', stagger: 0.15, clearProps: 'transform' },
        0
      )
    .fromTo(
        metas,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
        0.35
      )
  })
})

onBeforeUnmount(() => {
  mm?.revert()
})

// R6: the whole card is clickable — Paparazzi opens the site, the «next»
// card leads to the form (nested buttons stop propagation per CLAUDE.md)
function openPartner(p) {
  window.open(p.url, '_blank', 'noopener')
}

// R30: paparazzi.shop is live — the card links straight to it; the case
// page is hidden for now (route redirects, see nuxt.config), covers are the
// customer's new locale-specific renders
const partners = [
  {
    id: 'paparazzi',
    name: 'Paparazzi',
    descKey: 'v2.paparazzi_desc',
    url: 'https://paparazzi.shop',
    caseUrl: '/projects/paparazzi',
    coverEn: '/img/partners/paparazzi-cover-en.webp',
    coverUa: '/img/partners/paparazzi-cover-ua.webp'
  }
]

function goToContact() {
  scrollTo('#contact')
}
</script>

<template>
  <section id="projects" ref="rootEl" class="section-projects">
    <div class="container">
      <!-- R9 (фото 6): on ≤1024 the title leaves the table and stands as a
           plain section heading above it (the title CELL hides there) -->
      <!-- display:none swaps keep exactly ONE of the two titles in the
           accessibility tree at any width -->
      <SectionTitle
        class="section-projects__title section-projects__title--static v2-mask"
        :text="t('v2.projects_title')"
      />

      <!-- frame clipping the horizontal 3-cell track: top/bottom strokes on
           the frame itself (they stretch with it during the pin, R6);
           left/right borders never exist (R3.2.2) -->
      <div ref="frameEl" class="section-projects__frame">
        <div ref="trackEl" class="section-projects__track">
          <!-- cell 1: section title -->
          <div class="section-projects__cell section-projects__cell--title">
            <SectionTitle class="section-projects__title v2-mask" :text="t('v2.projects_title')" />
          </div>

          <!-- cell 2..n: partner cards -->
          <div v-for="p in partners" :key="p.id" class="section-projects__cell">
            <div class="project-cell project-cell--work" role="link" tabindex="0" @click="openPartner(p)" @keydown.enter="openPartner(p)">
              <div class="project-cell__cover">
                <img :src="lang === 'ua' ? p.coverUa : p.coverEn" :alt="p.name" width="1400" height="780" loading="lazy" />
              </div>
              <div class="project-cell__meta">
                <div class="project-cell__info">
                  <p class="project-cell__name">{{ p.name }}</p>
                  <p class="project-cell__desc">{{ t(p.descKey) }}</p>
                </div>
                <div class="project-cell__buttons" @click.stop>
                  <PButton variant="primary" :href="p.url" target="_blank">{{ t('v2.website') }}</PButton>
                  <!-- R30: case page hidden for now — the Details button goes with it
                  <PButton variant="secondary" :href="p.caseUrl">{{ t('v2.details') }}</PButton>
                  -->
                </div>
              </div>
            </div>
          </div>

          <!-- last cell: «your product could be next» — coded 1:1 per the
               mockup (887:52811): red radial glow + soft dot grid + a thin
               red arc ring around a plus. Hover (R3.2.5): the ring spins
               like a loader while the plus turns red. -->
          <div class="section-projects__cell">
            <div class="project-cell project-cell--next" role="link" tabindex="0" @click="goToContact" @keydown.enter="goToContact">
              <div class="project-cell__cover next-cover">
                <span class="next-cover__dots" aria-hidden="true" />
                <span class="next-cover__ring" aria-hidden="true" />
                <span class="next-cover__plus" aria-hidden="true">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 5v34M5 22h34" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                </span>
              </div>
              <div class="project-cell__meta">
                <div class="project-cell__info">
                  <p class="project-cell__name">{{ t('v2.next_title') }}</p>
                  <p class="project-cell__desc">{{ t('v2.next_desc') }}</p>
                </div>
                <div class="project-cell__buttons" @click.stop>
                  <PButton variant="primary" @click="goToContact">{{ t('v2.discuss_short') }}</PButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-projects {
  // R31.6: +40 воздуха перед и после секции по заказчику
  padding-block: calc(var(--rhythm-half) + #{$spacing-8});

  // R6: in pin mode the section is one viewport, frame centred; the extra
  // margins keep a proper gap to the neighbours around the pin
  &.is-motion {
    height: 100svh;
    padding-block: 0;
    margin-top: $spacing-8; // R31.6
    margin-bottom: calc(var(--rhythm-half) + #{$spacing-8});
    display: flex;
    align-items: center;
  }

  &.is-motion .container {
    width: 100%;
  }

  // R6: the frame carries its own top/bottom strokes (they ride its edges
  // as it stretches); left/right stay borderless (R3.2.2). Container query
  // context lets the cells size to half the frame.
  &__frame {
    position: relative;
    overflow: hidden;
    border-top: 1px solid var(--color-border-table);
    border-bottom: 1px solid var(--color-border-table);
    container-type: inline-size;
  }

  // R8 (фото 23): on desktop the «table» goes FULL-BLEED — the strokes run
  // edge to edge of the screen, the cells fade into the bg color at the
  // sides instead of being cut, and the track starts/ends on the container
  @media (min-width: 1025px) {
    &__frame {
      // R11 (r6-s15): minus the real scrollbar width — with classic
      // scrollbars a plain 100vw sat half a scrollbar off-centre
      width: calc(100vw - var(--sbw, 0px));
      margin-left: calc(50% - (100vw - var(--sbw, 0px)) / 2);

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: clamp(48px, 9vw, 180px);
        z-index: 2;
        pointer-events: none;
      }

      &::before {
        left: 0;
        background: linear-gradient(90deg, var(--color-bg) 0%, transparent 100%);
      }

      &::after {
        right: 0;
        background: linear-gradient(270deg, var(--color-bg) 0%, transparent 100%);
      }
    }

    &__track {
      padding-inline: max(#{$container-pad}, calc((100vw - var(--sbw, 0px) - var(--container-max)) / 2));
    }
  }

  // horizontal track: equal cells split by table dividers; the frame clips
  // everything beyond the first two cells until the pin scrolls it
  &__track {
    display: flex;
    align-items: stretch;
    width: max-content;
  }

  // R6: while the frame stretches, the track (and so the cell dividers)
  // follows its full height
  &.is-motion &__track {
    height: 100%;
  }

  // two cells per frame on every width (mockup: 655/1312) — cqw follows the
  // fluid container from R3.0.A; cells fill the frame height so the
  // dividers stretch with it during the pin (R6)
  &__cell {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50cqw;
    padding: $spacing-7;

    & + & {
      border-left: 1px solid var(--color-border-table);
    }
  }

  &__cell--title {
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
    text-align: left;
    // line breaks come from the locale string («growing\nwith us»)
    white-space: pre-line;

    :deep(.section-title__accent) {
      white-space: inherit;
    }
  }

  // the standalone adaptive heading — desktop hides it (the cell shows)
  &__title--static {
    display: none;
  }
}

.project-cell {
  display: flex;
  flex-direction: column;
  gap: $spacing-7;
  cursor: pointer; // R6: the whole card is clickable
  @include focus-visible;

  &__cover {
    aspect-ratio: 590 / 414; // mockup cover proportions, fluid with the cell
    border-radius: 4px; // unique mockup geometry (cover corners)
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      // ≈ power2.out, trionn's slow cover zoom
      transition: transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }

  // R3.2.4 + R4: smaller zoom, the caption just turns red without moving —
  // on BOTH cards (the «next» card zooms its coded background too)
  &:hover &__cover img {
    transform: scale(1.03);
  }

  &:hover &__name {
    color: var(--color-accent);
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-7;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-3; // R4: tighter name-to-description
    min-width: 0;
  }

  &__name {
    font-size: $fs-h4;
    letter-spacing: $ls-h3;
    line-height: 1;
    transition: color 200ms ease;
  }

  &__desc {
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    color: var(--color-text-muted);
  }

  &__buttons {
    display: flex;
    align-items: center;
    gap: $spacing-4;
    flex-shrink: 0;
  }
}

// «Your product could be next» cover — mockup 887:52811: black base with a
// soft red radial glow, a 21px grid of soft grey dots, a thin red arc ring
// and a white plus in the centre
.next-cover {
  position: relative;
  background: #0a0505;

  // glow + dot grid live on one zoomable layer (R4: hover scales the bg)
  &__dots {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(66% 96% at 52% 45%, rgba(241, 38, 37, 0.18) 0%, rgba(241, 38, 37, 0.06) 42%, rgba(7, 7, 7, 0) 68%),
      radial-gradient(circle, rgba(122, 122, 122, 0.28) 1px, transparent 1.8px);
    background-size: 100% 100%, 21px 21px;
    background-position: 0 0, 10px 10px;
    background-repeat: no-repeat, repeat;
    // ≈ the cover-image zoom curve
    transition: transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &__ring {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 110px;
    height: 110px;
    margin: -55px 0 0 -55px;
    border-radius: 50%;
    // arc with a fade — reads as a paused loader (mockup), spins on hover
    background: conic-gradient(
      from 210deg,
      rgba(241, 38, 37, 0) 0deg,
      rgba(241, 38, 37, 0.85) 130deg,
      rgba(241, 38, 37, 0.25) 240deg,
      rgba(241, 38, 37, 0) 360deg
    );
    -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
    mask: radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
  }

  &__plus {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    display: inline-flex;
    color: var(--color-text);
    transition: color 200ms ease;
  }
}

// R3.2.5: while the cursor is on the card the ring rotates like a loader
// (linear, endless) and the plus turns red; R4: the background zooms too
.project-cell--next:hover .next-cover__ring {
  animation: od-ring-spin 1.1s linear infinite;
}

.project-cell--next:hover .next-cover__plus {
  color: var(--color-accent);
}

.project-cell--next:hover .next-cover__dots {
  transform: scale(1.04);
}

@keyframes od-ring-spin {
  to {
    rotate: 360deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-cell__cover img,
  .project-cell__name,
  .next-cover__plus,
  .next-cover__dots {
    transition: none;
  }

  .project-cell:hover .project-cell__cover img,
  .project-cell--next:hover .next-cover__dots {
    transform: none;
  }

  .project-cell--next:hover .next-cover__ring {
    animation: none;
  }
}

// reduce on desktop: no pin — the frame scrolls natively so the third cell
// stays reachable (CLAUDE.md: the page must be complete without motion)
@media (prefers-reduced-motion: reduce) {
  .section-projects__frame {
    overflow-x: auto;
  }
}

@include respond(lg) {
  .section-projects {
    // R9 (фото 6): the heading stands above the table, not inside it
    &__title--static {
      display: block;
      margin-bottom: $spacing-8;
    }

    // R7 (фото 16): the stacked «table» keeps its side strokes too
    &__frame {
      border-inline: 1px solid var(--color-border-table);
    }

    &__track {
      flex-direction: column;
      width: 100%;
    }

    &__cell {
      width: 100%;
      min-height: 0;
      padding: $spacing-6;

      & + & {
        border-left: 0;
        border-top: 1px solid var(--color-border-table);
      }
    }

    &__cell--title {
      display: none;
    }

    // the first visible card cell must not draw the extra top divider
    &__cell--title + &__cell {
      border-top: 0;
    }
  }

  .project-cell__cover {
    height: 340px;
  }
}

@include respond(md) {
  .project-cell {
    &__cover {
      height: 46vw;
    }

    &__meta {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-5;
    }

    // R15 (фото 3): the buttons stretch across the card
    &__buttons {
      width: 100%;

      > * {
        flex: 1;
        justify-content: center;
      }
    }
  }
}


@include respond(md) {
  .section-projects__title {
    font-size: $fs-h2-m;
  }
}
</style>
