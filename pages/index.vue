<script setup>
// V2 rebuild in progress (BUILD_V2.md): the old sections live in
// components/_legacy/sections/ and are re-assembled one by one from the new
// Figma design. The shell (header, footer, lang modal, Lenis, tokens) stays.
const { scrollTo, ScrollTrigger } = useScrollMotion()
const { lang } = useLang()

// R31.5: a locale switch re-flows every section (UA runs longer) — remap
// the pins once the new texts have settled
watch(lang, () => {
  nextTick(() => {
    setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh(true)
    }, 100)
  })
})

onMounted(() => {
  if (import.meta.dev) window.__ST = ScrollTrigger // QA handle

  // R31: pins are created in mixed timing (S8 defers to nextTick), and with
  // SSR the window 'load' event often fires BEFORE hydration — ScrollTrigger
  // never gets its own post-load refresh, so early triggers keep starts
  // computed without the later pin-spacers/fonts (the moved S2 pinned
  // ~2600px early). Refresh once everything has truly settled: mount +
  // fonts + load (if still pending) + a settle frame.
  const settled = [nextTick()]
  if (document.fonts?.ready) settled.push(document.fonts.ready)
  if (document.readyState !== 'complete') {
    settled.push(new Promise((res) => window.addEventListener('load', res, { once: true })))
  }
  Promise.all(settled).then(() => {
    setTimeout(() => {
      // plain refresh() keeps the stale creation-order compensation — the
      // re-sort is the piece that actually fixes the pin map (verified)
      ScrollTrigger.sort()
      ScrollTrigger.refresh(true)
    }, 150)
  })

  // arriving from the case page with /#contact (kept for the future S12)
  const hash = window.location.hash
  if (hash && hash !== '#') {
    setTimeout(() => {
      ScrollTrigger.refresh()
      scrollTo(hash)
    }, 600)
  }
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <div>
    <PHeader />

    <main id="main">
      <!-- V2 sections S1–S12 are built stage by stage per PROMPTS_V2.md -->
      <SectionHero />
      <!-- R27: the model statement moved up to slot 2 (was 5th) -->
      <SectionModel />
      <!-- R27: hidden for now per the customer — may return later
      <SectionLayers />
      -->
      <SectionIncluded />
      <SectionCompare />
      <SectionScope />
      <SectionSteps />
      <SectionCalc />
      <SectionEarn />
      <!-- R29.2: «Businesses growing with us» moved down, right before FAQ -->
      <SectionProjects />
      <SectionFaq />
      <SectionContact />
    </main>

    <PFooter />
    <!-- R29: no first-visit language modal — the page opens in English, the
         switchers (header/footer) do the job
    <LangModal />
    -->
  </div>
</template>
