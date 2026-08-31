<script setup>
// V2 S0 preloader (Figma 892:53734): the logo mark slowly spinning in the
// centre (rotateZ ~14s — the only honest axis for a flat SVG — plus a subtle
// scale «breath»), a big percent counter bottom-left and a 2px progress bar
// along the bottom edge. The percentage tracks REAL loading (fonts + the
// hero render), clamped between 1.2s and 2.5s; then the overlay fades out
// and the hero cascade starts. Shown once per session (sessionStorage,
// html.od-preload is set pre-paint by the nuxt.config head script; reduced
// motion never gets the class). TODO(ASSET-3D):真 3D spin needs a GLB/frames.
const active = useState('od-preloader-active', () => false)

const pct = ref(0)
const leaving = ref(false)
const rootEl = ref(null)

const MIN_MS = 1200
const MAX_MS = 2500

let raf = 0

onMounted(() => {
  if (!document.documentElement.classList.contains('od-preload')) return
  active.value = true

  let assetsReady = false
  const heroImg = new Image()
  heroImg.src = '/img/v2/hero-3d.webp'
  Promise.allSettled([document.fonts.ready, heroImg.decode()]).then(() => {
    assetsReady = true
  })

  const start = performance.now()

  function tick(now) {
    const elapsed = now - start
    // while loading: crawl to 90% over MAX_MS; once ready: run to 100%,
    // but never finish before MIN_MS and never hang past MAX_MS
    const cap = assetsReady || elapsed >= MAX_MS ? 100 : 90
    const target = Math.min(cap, (elapsed / (cap === 100 ? MIN_MS : MAX_MS)) * 100)
    pct.value = Math.min(100, Math.floor(Math.max(pct.value, target)))

    if (pct.value >= 100 && elapsed >= MIN_MS) {
      finish()
      return
    }
    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
})

function finish() {
  leaving.value = true
  try {
    sessionStorage.setItem('od_intro', '1')
  } catch (e) {}
  // opening the gate starts the hero cascade while the overlay fades
  active.value = false
  setTimeout(() => {
    document.documentElement.classList.remove('od-preload')
    rootEl.value?.remove()
  }, 700)
}

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <div ref="rootEl" class="app-preloader" :class="{ 'is-leaving': leaving }" aria-hidden="true">
    <img
      class="app-preloader__figure"
      src="~/assets/icons/loader-figure.svg"
      alt=""
      width="640"
      height="640"
    />
    <p class="app-preloader__pct">{{ pct }}%</p>
    <span class="app-preloader__bar">
      <span class="app-preloader__bar-fill" :style="{ width: `${pct}%` }" />
    </span>
  </div>
</template>

<!-- unscoped on purpose: v1 lesson — :global() with nested :deep() miscompiles -->
<style lang="scss">
// the overlay exists only while html.od-preload is set (pre-paint script)
.app-preloader {
  display: none;
}

html.od-preload .app-preloader {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  opacity: 1;
  transition: opacity 650ms cubic-bezier(0.22, 1, 0.36, 1);

  &.is-leaving {
    opacity: 0;
    pointer-events: none;
  }

  &__figure {
    width: min(640px, 70vw);
    height: auto;
    animation:
      od-preloader-in 400ms cubic-bezier(0.22, 1, 0.36, 1) both,
      od-preloader-spin 14s linear infinite,
      od-preloader-breathe 6s ease-in-out infinite;
  }

  &__pct {
    position: absolute;
    left: 64px;
    bottom: 48px;
    font-size: 96px;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
    animation: od-preloader-in 400ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both;
  }

  &__bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.08);
    animation: od-preloader-in 400ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both;
  }

  &__bar-fill {
    display: block;
    height: 100%;
    background: var(--color-accent);
    transition: width 200ms linear;
  }
}

@keyframes od-preloader-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes od-preloader-spin {
  to {
    rotate: 360deg;
  }
}

@keyframes od-preloader-breathe {
  0%,
  100% {
    scale: 1;
  }
  50% {
    scale: 1.015;
  }
}
</style>
