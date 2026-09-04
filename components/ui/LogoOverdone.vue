<script setup>
// R27: the grey mark from the live overdone.it (ring white/60% + solid white
// band, 69×50) — «оставляем серый лого как на основной». Inline so the ring
// stays animatable: hovering the parent link rotates it −90° and back (our
// R2.1 animation, kept per the customer).
defineProps({
  height: { type: Number, default: 41 }
})
</script>

<template>
  <svg
    class="logo-overdone"
    :height="height"
    :width="Math.round((height * 69) / 50)"
    viewBox="0 0 69 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g class="logo-overdone__circle">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M58.7606 24.683C58.7606 38.315 47.7096 49.3659 34.0776 49.3659C20.4456 49.3659 9.39465 38.315 9.39465 24.683C9.39465 11.0509 20.4456 0 34.0776 0C47.7096 0 58.7606 11.0509 58.7606 24.683ZM47.1222 9.71476L51.7332 33.6592C52.0929 35.5269 50.8704 37.3325 49.0027 37.6922L25.0582 42.3032C23.1905 42.6628 21.3849 41.4403 21.0252 39.5726L16.4142 15.6282C16.0546 13.7605 17.2771 11.9548 19.1448 11.5952L43.0892 6.98421C44.9569 6.62455 46.7626 7.84705 47.1222 9.71476Z"
        fill="white"
        fill-opacity="0.6"
      />
    </g>
    <path d="M68.1557 17.2524H0V32.1135H68.1557V17.2524Z" fill="white" />
  </svg>
</template>

<style lang="scss" scoped>
.logo-overdone {
  overflow: visible;

  // rotate around the ring's own centre (34.08, 24.68 in the 69×50 box)
  &__circle {
    transform-origin: 34.08px 24.68px;
    transform-box: view-box;
    transition: transform 450ms cubic-bezier(0.45, 0, 0.15, 1);
  }
}

a:hover .logo-overdone__circle,
a:focus-visible .logo-overdone__circle {
  transform: rotate(-90deg);
}

@media (prefers-reduced-motion: reduce) {
  .logo-overdone__circle {
    transition: none;
  }
}
</style>
