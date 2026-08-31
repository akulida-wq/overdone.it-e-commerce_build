import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register the plugin at module scope: component onMounted hooks run BEFORE
// app.vue's init(), and any tween created with a scrollTrigger config prior to
// registration would silently ignore it.
if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
  if (import.meta.dev) {
    // dev-only: manual ScrollTrigger access for QA in headless/hidden tabs
    window.__ST = ScrollTrigger
  }
}

// Module-level singletons — the page lives once per session
let lenis = null
let initialized = false

export function useScrollMotion() {
  // Global prefers-reduced-motion flag, readable from any component
  const reducedMotion = useState('od-reduced-motion', () => false)

  // Called once on the client (app.vue). Sets up Lenis + ScrollTrigger with a
  // single rAF loop; with reduced motion Lenis is not created at all.
  function init() {
    if (!import.meta.client || initialized) return
    initialized = true

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = mq.matches
    mq.addEventListener('change', (e) => {
      reducedMotion.value = e.matches
      if (e.matches) {
        destroyLenis()
      } else {
        createLenis()
      }
    })

    if (!reducedMotion.value) createLenis()
  }

  function createLenis() {
    if (lenis) return
    lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(rafLoop)
    gsap.ticker.lagSmoothing(0)
  }

  function rafLoop(time) {
    if (lenis) lenis.raf(time * 1000)
  }

  function destroyLenis() {
    if (!lenis) return
    gsap.ticker.remove(rafLoop)
    lenis.destroy()
    lenis = null
  }

  // Standard entrance: fade + translateY(24px), stagger, fires once at 80% of
  // the viewport (DESIGN.md §6). Works with the .reveal utility class (elements
  // pre-hidden in CSS to avoid a flash) but accepts any element(s).
  // With reduced motion elements are simply shown.
  function reveal(targets, opts = {}) {
    if (!import.meta.client) return
    const els = gsap.utils.toArray(targets)
    if (!els.length) return

    if (reducedMotion.value) {
      els.forEach((el) => el.classList.add('is-revealed'))
      gsap.set(els, { clearProps: 'all' })
      return
    }

    gsap.fromTo(
      els,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: opts.duration ?? 0.7,
        ease: opts.ease ?? 'power2.out',
        stagger: opts.stagger ?? 0.08,
        delay: opts.delay ?? 0,
        scrollTrigger: {
          trigger: opts.trigger ?? els[0],
          start: opts.start ?? 'top 80%',
          once: true
        },
        onStart: () => els.forEach((el) => el.classList.add('is-revealed')),
        // keep the final opacity INLINE: Vue re-renders wipe externally added
        // classes on elements with dynamic :class (scope/compare rows), and
        // clearing opacity let the .reveal pre-hide CSS kick back in — items
        // vanished on hover. Only the transform gets cleared (hover effects).
        clearProps: 'transform'
      }
    )
  }

  // V2 P5 section entrance (BUILD_V2 «Общие принципы моушена»): titles rise
  // out of their line masks (.v2-mask on a SectionTitle), then the section's
  // [.v2-reveal] content fades up 24px with a stagger. One timeline per
  // section, fires once at 78% of the viewport. CSS pre-hides both groups
  // (html.js + no-preference) so nothing flashes before hydration.
  function sectionReveal(rootEl, opts = {}) {
    if (!import.meta.client || !rootEl || reducedMotion.value) return

    const lines = rootEl.querySelectorAll('.v2-mask .section-title__line')
    const items = rootEl.querySelectorAll('.v2-reveal')
    if (!lines.length && !items.length) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: opts.trigger ?? rootEl,
        start: opts.start ?? 'top 78%',
        once: true
      }
    })

    if (lines.length) {
      // y:0 in the from-state: gsap parses the CSS pre-hide translateY(110%)
      // into its px `y` cache — without the explicit reset that offset would
      // survive the tween and the line would stay shifted
      tl.fromTo(
        lines,
        { yPercent: 110, y: 0 },
        { yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.1 },
        0
      )
    }

    if (items.length) {
      tl.fromTo(
        items,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
        lines.length ? 0.2 : 0
      )
    }

    return tl
  }

  // Smooth scroll to an element/selector (used by all CTA → #contact links)
  function scrollTo(target, opts = {}) {
    if (!import.meta.client) return
    if (lenis) {
      lenis.scrollTo(target, { offset: opts.offset ?? 0 })
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      el?.scrollIntoView({ behavior: reducedMotion.value ? 'auto' : 'smooth' })
    }
  }

  function getLenis() {
    return lenis
  }

  return { init, reveal, sectionReveal, scrollTo, reducedMotion, gsap, ScrollTrigger, getLenis }
}
