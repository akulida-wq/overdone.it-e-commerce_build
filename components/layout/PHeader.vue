<script setup>
// V2 header (Figma node 887:49939): logo left (68×50) · centered nav plashka
// (507×72, radius 8, soft fill + blur) with the links row on top and a mono
// «simplifying complexity» ticker strip below a divider · «Book a call» CTA.
// The scroll behavior (hide down / fixed up) and the mobile fullscreen menu
// are kept from v1; the ticker is static in the P2 stage (motion in P5).
const { t } = useLang()
const { scrollTo } = useScrollMotion()

const CALENDLY_URL = 'https://calendly.com/a-harhalyk-overdone'
const MAIN_SITE = 'https://overdone.it'

const mainNav = [
  { key: 'nav.home', href: `${MAIN_SITE}/` },
  { key: 'nav.recruiting', href: `${MAIN_SITE}/recruiting/` },
  { key: 'nav.pricing', href: `${MAIN_SITE}/pricing/` }
]

const isFixed = ref(false)
const isHidden = ref(false)

let lastY = 0

function onScroll() {
  const y = window.scrollY
  const goingDown = y > lastY

  if (y <= 10) {
    isFixed.value = false
    isHidden.value = false
  } else if (goingDown && y > 120) {
    isHidden.value = true
    isFixed.value = true
  } else if (!goingDown) {
    isFixed.value = true
    isHidden.value = false
  }

  lastY = y
}

function goToContact() {
  // the form lives on the landing — from the case page navigate there first
  if (document.querySelector('#contact')) {
    scrollTo('#contact')
  } else {
    navigateTo({ path: '/', hash: '#contact' })
  }
}

onMounted(() => {
  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="p-header"
    :class="{ 'is-fixed': isFixed, 'is-hidden': isHidden }"
  >
    <div class="p-header__inner container">
      <a class="p-header__logo" :href="`${MAIN_SITE}/`" aria-label="Overdone">
        <LogoOverdone :height="50" />
      </a>

      <!-- centered nav plashka: links row + mono ticker strip -->
      <nav class="p-header__nav" aria-label="Overdone">
        <ul class="p-header__nav-list">
          <li v-for="item in mainNav" :key="item.key">
            <a class="p-header__nav-link" :href="item.href">{{ t(item.key) }}</a>
          </li>
          <li>
            <button type="button" class="p-header__nav-link" @click="goToContact">
              {{ t('nav.contact') }}
            </button>
          </li>
        </ul>
        <span class="p-header__nav-divider" aria-hidden="true" />
        <div class="p-header__ticker" aria-hidden="true">
          <!-- two identical halves → a seamless −50% marquee loop -->
          <span class="p-header__ticker-track">
            <span v-for="g in 2" :key="g" class="p-header__ticker-group">
              <template v-for="n in 4" :key="n">{{ t('v2.nav_ticker') }}&nbsp;&nbsp;</template>
            </span>
          </span>
        </div>
      </nav>

      <div class="p-header__actions">
        <PButton variant="primary" :href="CALENDLY_URL" target="_blank">
          {{ t('nav.book_call') }}
        </PButton>
      </div>

      <!-- R7 phone header: the CTA collapses into a round call button (the
           nav plashka drops to a second, full-width level — no burger) -->
      <a
        class="p-header__call"
        :href="CALENDLY_URL"
        target="_blank"
        :aria-label="t('nav.book_call')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M6.6 3h2.3c.5 0 .9.3 1 .8l.8 3.1c.1.4 0 .9-.4 1.1l-1.6 1.2a13.4 13.4 0 0 0 6.1 6.1l1.2-1.6c.2-.4.7-.5 1.1-.4l3.1.8c.5.1.8.5.8 1v2.3c0 .9-.7 1.6-1.6 1.6C10.9 21 3 13.1 3 4.6 3 3.7 3.7 3 4.6 3h2Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.p-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 300ms ease, background-color 300ms ease;

  // R8: gradient only (bottom 0% → top 100% into the bg color), no blur
  &.is-fixed {
    position: fixed;
    background: linear-gradient(to top, transparent 0%, var(--color-bg) 100%);
  }

  &.is-hidden {
    transform: translateY(-100%);
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-6;
    padding-block: $spacing-2;
    min-height: calc(88px * var(--k)); // R3.0.A
  }

  &__logo {
    display: inline-flex;
    flex-shrink: 0;
    @include focus-visible;
  }

  // Centered nav plashka (507×72, radius 8, soft fill + blur) ---------------
  &__nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    width: calc(507px * var(--k)); // R3.0.A
    height: calc(72px * var(--k));
    border-radius: $radius-sm;
    background: var(--color-fill-soft);
    -webkit-backdrop-filter: blur(28px);
    backdrop-filter: blur(28px);
    overflow: hidden;

    // R7 tablet: same plashka, but in-flow between logo and CTA so the three
    // zones can never overlap on 769–1024
    @include respond(lg) {
      position: static;
      transform: none;
      flex: 1 1 auto;
      max-width: 460px;
      margin-inline: auto;
      min-width: 0;
    }
  }

  // R11 (r6-s15): equal-width side zones — the plashka sits DEAD centre
  // (the CTA is wider than the logo, which skewed the flex centring)
  @include respond(lg) {
    &__logo {
      flex: 1 1 0;
    }

    &__actions {
      flex: 1 1 0;
      justify-content: flex-end;
    }
  }

  &__nav-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding-inline: $spacing-3;
  }

  &__nav-link {
    display: inline-block;
    padding: $spacing-2;
    font-size: $fs-nav;
    letter-spacing: -0.03em;
    color: var(--color-text);
    transition: opacity 200ms ease;
    @include focus-visible;

    &:hover {
      opacity: 0.7;
    }
  }

  &__nav-divider {
    height: 1px;
    background: var(--color-border-strong);
  }

  // mono strip under the links (static in P2, marquee in P5)
  &__ticker {
    position: relative;
    height: calc(35px * var(--k));
    display: flex;
    align-items: center;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 11%, black 88%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, black 11%, black 88%, transparent 100%);
  }

  &__ticker-track {
    display: inline-flex;
    font-family: $font-mono;
    font-size: calc(12px * var(--k)); // $fs-mono-m scaled on >=2560
    letter-spacing: $ls-mono;
    color: var(--color-text-secondary);
    white-space: nowrap;

    @media (prefers-reduced-motion: no-preference) {
      animation: od-header-marquee 20s linear infinite;
    }
  }

  &__ticker-group {
    display: inline-block;
    padding-left: $spacing-3;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-3;
  }

  // R7: round call CTA — phone header only
  &__call {
    display: none;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-text);
    flex-shrink: 0;
    @include focus-visible;
  }

  // R10 phone header (≤768, r6-s4): ONE row — a small logo, the plashka with
  // all four links in a SINGLE line (smaller type), the small round call
  @include respond(md) {
    &__inner {
      gap: $spacing-2;
      padding-block: $spacing-3;
      min-height: 0;
    }

    &__logo {
      flex: 0 0 auto; // the lg flex:1 balance is desktop-tablet only

      :deep(svg) {
        height: 34px;
        width: auto;
      }
    }

    &__actions {
      display: none;
    }

    &__call {
      display: inline-flex;
      width: 40px;
      height: 40px;
    }

    &__nav {
      position: static;
      transform: none;
      flex: 1 1 auto;
      max-width: none;
      min-width: 0;
      height: auto;
      margin-inline: 0;
    }

    &__nav-list {
      flex-wrap: nowrap;
      padding: $spacing-2 $spacing-2 6px;
    }

    &__nav-link {
      padding: $spacing-1 3px;
      font-size: 12px; // compact single-row phone nav
      white-space: nowrap;
    }

    &__ticker {
      height: 18px;
    }

    &__ticker-track {
      font-size: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    .p-header__nav-link {
      transition: none;
    }
  }
}

@keyframes od-header-marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
