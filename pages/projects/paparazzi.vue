<script setup>
// R22 — Paparazzi case page redesigned per Figma 1039:61236 («разметка и
// размерности»): an article layout — left column (H1 40 / lead 24 / CTA,
// then H2 32 + 20px grey paragraphs with bordered 12px screenshots) and a
// sticky numbered «Page navigation» panel (188px) on the right with a
// scrollspy. The bottom is the landing's form + footer 1:1 (SectionContact
// + PFooter, shared components). Texts live in locales (case_pprz).
const { t } = useLang()
const { reveal, getLenis } = useScrollMotion()

useHead({ title: 'Paparazzi — Overdone' })

const SITE_URL = 'https://pprz-school.overdone.it/'

const sections = computed(() => t('case_pprz.sections'))

const IMG = {
  'home': { src: '/img/case-paparazzi/home.webp', w: 2000, h: 1114 },
  'catalog': { src: '/img/case-paparazzi/catalog.webp', w: 2000, h: 1139 },
  'product': { src: '/img/case-paparazzi/product.webp', w: 2000, h: 1136 },
  'admin-promos': { src: '/img/case-paparazzi/admin-promos.webp', w: 2000, h: 1140 },
  'admin-products': { src: '/img/case-paparazzi/admin-products.webp', w: 2000, h: 1138 }
}

const pageEl = ref(null)
const activeId = ref('overview')
// R24: the fixed mobile bar starts folded; desktop/tablet start open
const navOpen = ref(true)
// R23: the nav rides the header — when the header hides on scroll-down the
// panel glides up to the viewport top (same 120px threshold as PHeader)
const headerHidden = ref(false)
let lastY = 0
let io = null
let mobileMq = null

function onScroll() {
  const y = window.scrollY
  // mobile bar raises as soon as the absolute header has scrolled off (84px),
  // desktop keeps PHeader's own 120px hide threshold
  const th = mobileMq?.matches ? 84 : 120
  headerHidden.value = y > lastY && y > th ? true : (y < lastY || y <= 10 ? false : headerHidden.value)
  lastY = y
}

function goTo(id) {
  const el = document.getElementById(`case-${id}`)
  if (!el) return
  const mobile = mobileMq?.matches
  const scroll = () => {
    const lenis = getLenis()
    // both paths honor the blocks' scroll-margin-top (110 / 148 mobile) —
    // an extra offset here would double it (Lenis adds the margin itself)
    if (lenis) lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: 'smooth' })
  }
  if (mobile && navOpen.value) {
    // fold the bar FIRST: it sits above the article in flow, so its collapse
    // shifts every target upward — scrolling before it settles overshoots
    navOpen.value = false
    setTimeout(scroll, 380)
  } else {
    scroll()
  }
}

onMounted(() => {
  // arriving from the landing: land at the top of the case, not mid-page
  getLenis()?.scrollTo(0, { immediate: true })

  mobileMq = window.matchMedia('(max-width: 768px)')
  if (mobileMq.matches) navOpen.value = false

  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })

  reveal(pageEl.value.querySelectorAll('.js-case-hero'), { stagger: 0.08 })
  pageEl.value.querySelectorAll('.case-block').forEach((el) => reveal(el))

  // scrollspy: the section closest to the reading line owns the nav item
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeId.value = e.target.dataset.caseId
      }
    },
    { rootMargin: '-20% 0px -70% 0px' }
  )
  pageEl.value.querySelectorAll('.case-block[data-case-id]').forEach((el) => io.observe(el))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  io?.disconnect()
})
</script>

<template>
  <div ref="pageEl">
    <PHeader />

    <main id="main" class="case-page">
      <div class="container case-page__grid">
        <article class="case-page__article">
          <header class="case-page__head js-case-hero">
            <h1 class="case-page__title">
              <span class="case-page__title-accent">{{ t('case_pprz.title') }}</span>{{ t('case_pprz.title_rest') }}
            </h1>
            <p class="case-page__lead">{{ t('case_pprz.lead') }}</p>
            <PButton variant="primary" :href="SITE_URL" target="_blank">{{ t('case_pprz.visit') }}</PButton>
          </header>

          <section
            v-for="s in sections"
            :id="`case-${s.id}`"
            :key="s.id"
            class="case-block"
            :data-case-id="s.id"
          >
            <h2 class="case-block__title">{{ s.title }}</h2>
            <p v-for="(para, j) in s.p" :key="j" class="case-block__p">{{ para }}</p>
            <figure v-if="s.img && IMG[s.img]" class="case-block__shot">
              <img
                :src="IMG[s.img].src"
                :alt="s.alt || s.title"
                :width="IMG[s.img].w"
                :height="IMG[s.img].h"
                loading="lazy"
              />
            </figure>
          </section>
        </article>

        <!-- sticky numbered page navigation (Figma 1044:61315) — R23: rides
             the header (raises when it hides) and folds open/closed -->
        <nav class="case-nav" :class="{ 'is-raised': headerHidden }" :aria-label="t('case_pprz.nav_title')">
          <div class="case-nav__inner">
            <button
              type="button"
              class="case-nav__head"
              :aria-expanded="navOpen ? 'true' : 'false'"
              @click="navOpen = !navOpen"
            >
              <!-- customer's mark (Frame 2147226756.svg): the diamond-ring
                   logo doubles as the open/close arrow -->
              <svg class="case-nav__mark" :class="{ 'is-open': navOpen }" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10.0012 14.9979V6.66643M14.1669 10.8321L10.0012 6.66643L5.83545 10.6586" stroke="currentColor" stroke-width="0.833144" />
                <path d="M7.41291 19.6566C2.07982 18.2273 -1.08539 12.7457 0.343576 7.41249C1.77267 2.07905 7.25525 -1.08594 12.5887 0.343154C17.9219 1.77229 21.0869 7.25401 19.658 12.5873C18.2289 17.9207 12.7464 21.0857 7.41291 19.6566ZM1.89729 9.16151C1.33651 9.72236 1.33647 10.6319 1.89729 11.1928L9.08772 18.3822C9.64853 18.943 10.5572 18.943 11.118 18.3822L18.3084 11.1928C18.8693 10.6319 18.8693 9.72235 18.3084 9.16151L11.118 1.97108C10.5572 1.41071 9.64846 1.41068 9.08772 1.97108L1.89729 9.16151Z" fill="currentColor" />
              </svg>
              {{ t('case_pprz.nav_title') }}
            </button>
            <div class="case-nav__collapse" :class="{ 'is-open': navOpen }">
              <div class="case-nav__collapse-in">
                <ol class="case-nav__list">
                  <li v-for="(s, i) in sections" :key="s.id">
                    <button
                      type="button"
                      class="case-nav__item"
                      :class="{ 'is-active': activeId === s.id }"
                      @click="goTo(s.id)"
                    >
                      <span class="case-nav__num">{{ i + 1 }}.</span>
                      {{ s.nav }}
                    </button>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </main>

    <SectionContact />
    <PFooter />
  </div>
</template>

<style lang="scss" scoped>
.case-page {
  padding-top: calc(72px * var(--k) + #{$spacing-11});
  padding-bottom: $spacing-13;

  // R24 (Figma 1044:61364): article 864 / panel 304 at 1440 (≈ 2/3 : 1/3).
  // R25: 1440 widths are the MAXIMUM — on wider screens only the gap
  // between the two containers grows (no --k upscaling here)
  &__grid {
    display: flex;
    gap: $spacing-9;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__article {
    display: flex;
    flex-direction: column;
    gap: $spacing-9;
    flex: 1 1 auto;
    max-width: 864px;
    min-width: 0;
  }

  &__head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-5;
  }

  // R23.1: the mock's type scale = the landing's tokens one step down
  // (H1 = $fs-h3 40, block titles = $fs-h4 32)
  &__title {
    font-size: $fs-h3;
    font-weight: $fw-heading;
    letter-spacing: $ls-h3;
    line-height: 1.05;
  }

  &__title-accent {
    color: var(--color-accent);
  }

  &__lead {
    font-size: calc(24px * var(--k));
    letter-spacing: -0.03em;
    line-height: normal;
  }
}

.case-block {
  display: flex;
  flex-direction: column;
  gap: $spacing-5;
  scroll-margin-top: 110px;

  &__title {
    font-size: $fs-h4;
    font-weight: $fw-heading;
    letter-spacing: $ls-h3;
    line-height: 1;
  }

  &__p {
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: normal;
    color: var(--color-text-muted);
  }

  // Figma: bordered 12px screenshot card, 641 wide inside the 864 column
  &__shot {
    margin-top: $spacing-3;
    width: 641px;
    max-width: 100%;
    border: 1px solid var(--color-border-table);
    border-radius: 12px;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
}

// sticky numbered page navigation (Figma 1044:61315: 304px, r4) -------------
.case-nav {
  position: sticky;
  top: calc(72px * var(--k) + #{$spacing-5});
  width: 304px;
  flex-shrink: 0;
  transition: top 300ms ease; // rides the header's hide/show

  // R23: the header slid away — take its place at the top
  &.is-raised {
    top: $spacing-4;
  }
}

.case-nav__inner {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-table);
  border-radius: 4px;
  overflow: hidden;
}

// Figma: 8×12 padding, 20px icon, 18px/1.5 red title; the separator stroke
// lives on the collapse body (border-top), so the CLOSED state is just the
// head inside one clean rounded border — nothing doubles up
.case-nav__head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: $spacing-2 $spacing-3;
  background: rgba(255, 255, 255, 0.08);
  font-size: 18px;
  line-height: 1.5;
  letter-spacing: 0.005em;
  color: var(--color-accent);
  text-align: left;
  white-space: nowrap;
  @include focus-visible;

  svg {
    flex-shrink: 0;
  }
}

// the mark IS the toggle arrow: up when open, flipped down when folded
.case-nav__mark {
  flex-shrink: 0;
  transition: rotate 300ms ease;
  rotate: 180deg;

  &.is-open {
    rotate: 0deg;
  }
}

// R23: the list folds under the head (grid-rows collapse, no max-height)
.case-nav__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 350ms cubic-bezier(0.45, 0, 0.55, 1);

  &.is-open {
    grid-template-rows: 1fr;
  }
}

.case-nav__collapse-in {
  min-height: 0;
  overflow: hidden;
}

// the head/list separator lives HERE (inside the clipped wrapper): at 0fr a
// border on __collapse-in itself would survive as a stray 1px line
.case-nav__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-block: 2px;
  border-top: 1px solid var(--color-border-table);
}

// Figma: 36px rows, 12px inset, 16px/1.5, active fill full-bleed
.case-nav__item {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  width: 100%;
  height: 36px;
  padding-inline: $spacing-3;
  border-radius: 4px;
  font-size: $fs-body;
  line-height: 1.5;
  letter-spacing: 0.005em;
  color: rgba(255, 255, 255, 0.55);
  text-align: left;
  transition: color 250ms ease, background-color 250ms ease;
  @include focus-visible;

  &:hover {
    color: var(--color-text);
  }

  &.is-active {
    background: rgba(255, 255, 255, 0.07);
    color: var(--color-text);
  }
}

.case-nav__num {
  flex-shrink: 0;
}

// R24: the tablet KEEPS the sticky panel — narrower, next to a fluid article
@include respond(lg) {
  .case-page {
    padding-top: calc(72px * var(--k) + #{$spacing-8});

    &__grid {
      gap: $spacing-7;
    }
  }

  .case-nav {
    width: 240px;
  }

  .case-nav__head {
    font-size: $fs-body; // «Навігація сторінкою» fits 240px on one line
  }
}

// R25: on phones the nav moves ABOVE the article as an in-flow sticky card
// (container insets kept) — opening it pushes the content down instead of
// overlaying it; while pinned it rides the header like on desktop
@include respond(md) {
  .case-page {
    padding-top: 128px;

    &__grid {
      flex-direction: column;
      align-items: stretch; // flex-start would shrink-wrap the article wide
      gap: $spacing-7;
    }

    &__lead {
      font-size: $fs-body-lg-m;
    }
  }

  .case-block {
    scroll-margin-top: 148px;
  }

  .case-nav {
    order: -1;
    position: sticky;
    top: 92px; // mobile header (83) + breathing room
    width: 100%;
    z-index: 90; // under the header (100), above the article

    &.is-raised {
      top: $spacing-2;
    }
  }

  // opaque card: content scrolls under it while pinned
  .case-nav__inner {
    background: var(--color-bg);
  }
}
</style>
