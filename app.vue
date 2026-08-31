<script setup>
// preload both SF Pro Display weights (the same files production overdone.it
// uses, subset to woff2 — ~40KB each); hashed URLs resolved by vite
import sf400 from '@/assets/fonts/SFProDisplay-400.woff2'
import sf500 from '@/assets/fonts/SFProDisplay-500.woff2'

const { lang, init: initLang, t } = useLang()
const { init: initMotion } = useScrollMotion()

const SITE_TITLE = 'E-commerce Partnership — Overdone'
const description = computed(() => t('hero.lead'))

useHead({
  htmlAttrs: { lang },
  title: SITE_TITLE,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: SITE_TITLE },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/og-image.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: 'Overdone' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: SITE_TITLE },
    { name: 'twitter:description', content: description }
  ],
  link: [
    ...[sf400, sf500].map((href) => ({
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
      href
    })),
    // the hero cart is the LCP candidate on repeat visits (R3: srcset-aware
    // so big desktops preload the 2600w variant)
    {
      rel: 'preload',
      as: 'image',
      href: '/img/v2/hero-3d.webp',
      imagesrcset: '/img/v2/hero-3d.webp 1600w, /img/v2/hero-3d-2600.webp 2600w',
      imagesizes: '(max-width: 768px) 130vw, (max-width: 1024px) 112vw, 77.66vw',
      fetchpriority: 'high'
    }
  ]
})

// R11 (r6-s15): with classic (non-overlay) scrollbars 100vw is wider than
// the client area — full-bleed elements would sit 0.5 scrollbar off-centre
// («справа отступ больше»). --sbw feeds the real scrollbar width to CSS.
function setScrollbarWidth() {
  const sbw = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.setProperty('--sbw', `${Math.max(0, sbw)}px`)
}

onMounted(() => {
  initLang()
  initMotion()
  setScrollbarWidth()
  window.addEventListener('resize', setScrollbarWidth, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setScrollbarWidth)
})
</script>

<template>
  <div class="app">
    <AppPreloader />
    <a class="skip-link" href="#main">{{ t('a11y.skip') }}</a>
    <NuxtPage />
  </div>
</template>

<style lang="scss" scoped>
.skip-link {
  position: absolute;
  top: $spacing-2;
  left: $spacing-2;
  z-index: 300;
  padding: $spacing-3 $spacing-5;
  border-radius: $radius-pill;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  transform: translateY(-200%);

  &:focus-visible {
    transform: none;
  }
}
</style>
