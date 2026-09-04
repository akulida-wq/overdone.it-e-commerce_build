<script setup>
// V2 rebuild in progress (BUILD_V2.md): the old sections live in
// components/_legacy/sections/ and are re-assembled one by one from the new
// Figma design. The shell (header, footer, lang modal, Lenis, tokens) stays.
const { scrollTo, ScrollTrigger } = useScrollMotion()

onMounted(() => {
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
      <SectionProjects />
      <!-- R27: hidden for now per the customer — may return later
      <SectionLayers />
      -->
      <SectionIncluded />
      <SectionCompare />
      <SectionScope />
      <SectionSteps />
      <SectionCalc />
      <SectionEarn />
      <SectionFaq />
      <SectionContact />
    </main>

    <PFooter />
    <LangModal />
  </div>
</template>
