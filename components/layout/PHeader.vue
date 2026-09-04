<script setup>
// V2 header (Figma node 887:49939): logo left (68×50) · centered nav plashka
// (507×72, radius 8, soft fill + blur) with the links row on top and a mono
// «simplifying complexity» ticker strip below a divider · «Book a call» CTA.
// The scroll behavior (hide down / fixed up) and the mobile fullscreen menu
// are kept from v1; the ticker is static in the P2 stage (motion in P5).
const { t, lang, setLang } = useLang()
const { scrollTo } = useScrollMotion()

// R27: header language switcher («UA ⌄», Figma 1093:4443) — desktop/tablet
const langOpen = ref(false)
const langEl = ref(null)

function pickLang(code) {
  setLang(code)
  langOpen.value = false
}

function onDocClick(e) {
  if (langOpen.value && langEl.value && !langEl.value.contains(e.target)) langOpen.value = false
}

function onDocKey(e) {
  if (e.key === 'Escape') langOpen.value = false
}

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
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onDocKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onDocKey)
})
</script>

<template>
  <header
    class="p-header"
    :class="{ 'is-fixed': isFixed, 'is-hidden': isHidden }"
  >
    <div class="p-header__inner container">
      <a class="p-header__logo" :href="`${MAIN_SITE}/`" aria-label="Overdone">
        <LogoOverdone :height="41" />
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
        <!-- R27: language switcher (Figma 1093:4443); phones use the footer one -->
        <div ref="langEl" class="p-header__lang">
          <button
            type="button"
            class="p-header__lang-btn"
            :aria-expanded="langOpen ? 'true' : 'false'"
            @click="langOpen = !langOpen"
          >
            {{ lang.toUpperCase() }}
            <svg class="p-header__lang-chev" :class="{ 'is-open': langOpen }" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div v-show="langOpen" class="p-header__lang-menu">
            <button
              v-for="code in ['en', 'ua']"
              :key="code"
              type="button"
              class="p-header__lang-item"
              :class="{ 'is-active': lang === code }"
              @click="pickLang(code)"
            >
              {{ code.toUpperCase() }}
            </button>
          </div>
        </div>

        <PButton variant="primary" :href="CALENDLY_URL" target="_blank">
          {{ t('nav.book_call') }}
        </PButton>
      </div>
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
    padding-block: 5px;
    min-height: calc(72px * var(--hk)); // R27/R31: live overdone.it (96 at ≥1920)
  }

  &__logo {
    display: inline-flex;
    flex-shrink: 0;
    @include focus-visible;

    :deep(svg) {
      height: min(calc(41px * var(--hk)), 50px); // R31: original tops out at 50
      width: auto;
    }
  }

  // Nav plashka — R27: live overdone.it geometry (440×62, radius 8), in flow
  // and centred BETWEEN the logo and the actions like the original (its pill
  // sits at the midpoint of the free space, not the page centre)
  &__nav {
    display: flex;
    flex-direction: column;
    width: calc(440px * var(--hk));
    height: calc(62px * var(--hk));
    margin-inline: auto;
    flex-shrink: 0;

    // R31.3 (фото 2): dead page centre on desktop — flex centring drifted
    // left once the lang+CTA block outgrew the logo (matches the original
    // at 2000: pill centre = page centre)
    @media (min-width: 1025px) {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-inline: 0;
    }
    border-radius: $radius-sm;
    background: var(--color-fill-soft);
    -webkit-backdrop-filter: blur(28px);
    backdrop-filter: blur(28px);
    overflow: hidden;

    @include respond(lg) {
      flex-shrink: 1;
      min-width: 0;
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
    padding: 6px $spacing-2;
    font-size: calc(14px * var(--hk)); // R27: original's link size
    letter-spacing: -0.03em;
    color: var(--color-text);
    transition: opacity 200ms ease;
    white-space: nowrap;
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
    height: calc(29px * var(--hk)); // R27: fits the 62px pill
    display: flex;
    align-items: center;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 11%, black 88%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, black 11%, black 88%, transparent 100%);
  }

  &__ticker-track {
    display: inline-flex;
    font-family: $font-mono;
    font-size: calc(12px * var(--hk));
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
    gap: $spacing-5;
    flex-shrink: 0;

    // R27: the original's CTA is compact (150×36, 15px) — override the
    // shared PButton size inside the header only
    .p-button {
      height: calc(36px * var(--hk)); // R31: 48 at ≥1920 like the original
      min-height: 0;
      padding-inline: calc(#{$spacing-4} * var(--hk));
      font-size: calc(15px * var(--hk));
    }
  }

  // R27: language switcher — grey «UA ⌄» with a small dark dropdown
  &__lang {
    position: relative;
  }

  &__lang-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: $spacing-2;
    font-size: 15px;
    letter-spacing: -0.03em;
    color: var(--color-text-secondary);
    transition: color 200ms ease;
    @include focus-visible;

    &:hover {
      color: var(--color-text);
    }
  }

  &__lang-chev {
    transition: rotate 250ms ease;

    &.is-open {
      rotate: 180deg;
    }
  }

  &__lang-menu {
    position: absolute;
    top: calc(100% + #{$spacing-1});
    right: 0;
    display: flex;
    flex-direction: column;
    min-width: 64px;
    padding: $spacing-1;
    border: 1px solid var(--color-border-strong);
    border-radius: $radius-sm;
    background: var(--color-bg);
  }

  &__lang-item {
    padding: 6px $spacing-3;
    border-radius: 4px;
    font-size: 15px;
    color: var(--color-text-secondary);
    text-align: left;
    transition: color 200ms ease, background-color 200ms ease;
    @include focus-visible;

    &:hover {
      color: var(--color-text);
      background: rgba(255, 255, 255, 0.07);
    }

    &.is-active {
      color: var(--color-accent);
    }
  }

  // R27 phone header (≤768): like the live overdone.it — ONLY the nav pill,
  // full-width with a small inset; no logo, no CTA, no call button
  @include respond(md) {
    &__inner {
      padding-block: 11px;
      padding-inline: 12px;
      min-height: 0;
    }

    &__logo,
    &__actions {
      display: none;
    }

    &__nav {
      width: 100%;
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
      font-size: 13px;
      white-space: nowrap;
    }

    &__ticker {
      height: 22px;
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
