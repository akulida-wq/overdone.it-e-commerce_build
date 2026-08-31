<script setup>
// R3.4.4 — S4 service icons rebuilt by hand as ONE unified set: a single
// square 86×86 viewBox (mockup icon block size), one stroke weight (1.5),
// one dash rhythm (2 5) for the dashed shapes, muted grey strokes and the
// mockup's signature red «plus» in the top-right corner of every icon
// (style: refs/SVG_icon_example.svg + the S4 mockup icon 887:50288).
// `name` follows the included.items order.
defineProps({
  name: { type: String, required: true },
  // R4: container is 120% of the mockup's 86 block; the tightened viewBox
  // below makes the drawing run edge-to-edge of it
  size: { type: Number, default: 104 }
})
</script>

<template>
  <svg
    class="icon-service"
    :width="size"
    :height="size"
    viewBox="5 4 79 79"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 1. Online store: awning + body + door -->
    <g v-if="name === 'store'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 31l6-12h34l6 12" stroke-dasharray="2 5" />
      <rect x="13" y="31" width="46" height="34" stroke-dasharray="2 5" />
      <rect x="30" y="45" width="12" height="20" />
    </g>

    <!-- 2. Product catalogue & filters: grid + funnel -->
    <g v-else-if="name === 'catalog'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="12" y="26" width="14" height="14" stroke-dasharray="2 5" />
      <rect x="32" y="26" width="14" height="14" stroke-dasharray="2 5" />
      <rect x="12" y="46" width="14" height="14" stroke-dasharray="2 5" />
      <rect x="32" y="46" width="14" height="14" stroke-dasharray="2 5" />
      <path d="M54 30h14l-5.5 8v12l-3-2.5V38L54 30Z" />
    </g>

    <!-- 3. CRM: kanban board (R4: cleaned up — no inner clutter) -->
    <g v-else-if="name === 'crm'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="12" y="22" width="50" height="15" rx="3" stroke-dasharray="2 5" />
      <rect x="12" y="45" width="32" height="15" rx="3" stroke-dasharray="2 5" />
      <rect x="50" y="45" width="12" height="15" rx="3" />
    </g>

    <!-- 4. Payment systems: card -->
    <g v-else-if="name === 'payment'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="12" y="28" width="48" height="30" rx="4" stroke-dasharray="2 5" />
      <path d="M12 38h48" />
      <rect x="19" y="46" width="11" height="6" rx="1.5" />
    </g>

    <!-- 5. Delivery services: the mockup's box on wheels -->
    <g v-else-if="name === 'delivery'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="11" y="30" width="42" height="24" stroke-dasharray="2 5" />
      <path d="M53 38h10l6 8v8h-6" />
      <circle cx="21" cy="60" r="4.5" />
      <circle cx="45" cy="60" r="4.5" />
      <circle cx="61" cy="60" r="4.5" />
    </g>

    <!-- 6. Inventory & stock sync: boxes + circular arrows -->
    <g v-else-if="name === 'stock'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="12" y="44" width="17" height="17" stroke-dasharray="2 5" />
      <rect x="35" y="44" width="17" height="17" stroke-dasharray="2 5" />
      <path d="M18 34a15 11 0 0128-1" />
      <path d="M46 27v6h-6" />
    </g>

    <!-- 7. Order processing: document + check -->
    <g v-else-if="name === 'order'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="16" y="14" width="32" height="46" rx="3" stroke-dasharray="2 5" />
      <path d="M24 26h16M24 34h16M24 42h8" />
      <circle cx="50" cy="52" r="9" />
      <path d="M46 52l3 3 5.5-6" />
    </g>

    <!-- 8. Notifications: bell -->
    <g v-else-if="name === 'notify'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 54c3-3 4-9 4-15 0-9 5-14 12-14s12 5 12 14c0 6 1 12 4 15H22Z" stroke-dasharray="2 5" />
      <path d="M34 60a4.5 4.5 0 009 0" />
    </g>

    <!-- 9. Analytics & dashboards (R4: no frame — axes, bars, clean trend) -->
    <g v-else-if="name === 'analytics'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 18v44h50" stroke-dasharray="2 5" />
      <path d="M24 62v-14M36 62v-24M48 62v-10M60 62v-20" />
      <path d="M24 40l12-12 10 7 14-16" />
      <path d="M54 19h7v7" />
    </g>

    <!-- 10. Admin panel: window + sliders -->
    <g v-else-if="name === 'admin'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="12" y="20" width="48" height="40" rx="3" stroke-dasharray="2 5" />
      <path d="M12 30h48" />
      <path d="M20 42h26M34 52h26" opacity="0.9" />
      <circle cx="50" cy="42" r="3.5" />
      <circle cx="28" cy="52" r="3.5" />
    </g>

    <!-- 11. Marketplace & social: connected nodes -->
    <g v-else-if="name === 'market'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="20" cy="32" r="6" />
      <circle cx="50" cy="22" r="6" />
      <circle cx="40" cy="54" r="6" />
      <path d="M26 30l18-6M24 37l12 13M48 28l-6 20" stroke-dasharray="2 5" />
    </g>

    <!-- 12. Post-launch development: steps + rising arrow -->
    <g v-else stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 60h12V48h12V36h12" stroke-dasharray="2 5" />
      <path d="M36 30L56 12" />
      <path d="M48 12h8v8" />
    </g>

    <!-- signature red plus, top-right (per the S4 mockup icon) -->
    <path d="M67 19h16M75 11v16" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" />
  </svg>
</template>
