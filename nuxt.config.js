export default defineNuxtConfig({
  nitro: { compressPublicAssets: true },
  compatibilityDate: '2026-08-25',
  ssr: true,

  // Keep the flat (v3-style) directory layout described in CLAUDE.md
  srcDir: '.',
  dir: { app: 'app' },

  components: [{ path: '~/components', pathPrefix: false, ignore: ['**/_legacy/**'] }],

  css: ['@/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/variables" as *; @use "@/assets/scss/mixins" as *;'
        }
      }
    }
  },

  app: {
    head: {
      title: 'E-commerce Partnership — Overdone',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      script: [
        // marks JS availability before first paint so .reveal elements can be pre-hidden without FOUC;
        // od-preload gates the session preloader (skipped on repeat visits and with reduced motion)
        {
          innerHTML:
            "document.documentElement.classList.add('js');try{if(!sessionStorage.getItem('od_intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.search.includes('nointro'))document.documentElement.classList.add('od-preload')}catch(e){}",
          tagPosition: 'head'
        }
      ]
    }
  }
})
