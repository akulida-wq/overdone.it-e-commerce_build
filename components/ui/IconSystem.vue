<script setup>
// Single-style icon set (stroke 1.5px, round caps — DESIGN.md §5).
// Usage: <IconSystem name="store" :size="24" />
const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 }
})

// path data per icon; drawn on a 24×24 grid
const ICONS = {
  store: [
    'M3.5 4.5h17l-1.2 5.5H4.7L3.5 4.5Z',
    'M5 10v9.5h14V10',
    'M9.5 19.5v-5h5v5'
  ],
  crm: [
    'M9 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5',
    'M15.5 4.9a3 3 0 0 1 0 5.2',
    'M17 14.7c2 .5 3.5 2.3 3.5 4.8'
  ],
  card: [
    'M3 6.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z',
    'M3 10h18',
    'M6.5 15h4'
  ],
  tag: [
    'M13 3.5h7.5V11L12 19.5 4.5 12 13 3.5Z',
    'M16.5 7.5h.01'
  ],
  warehouse: [
    'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z',
    'M4 7.5l8 4.5 8-4.5',
    'M12 12v9'
  ],
  order: [
    'M5.5 6a1.5 1.5 0 0 1 1.5-1.5h10A1.5 1.5 0 0 1 18.5 6v13a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6Z',
    'M9 4.5V3h6v1.5',
    'M9 10.5h6',
    'M9 14.5h6'
  ],
  truck: [
    'M2.5 7h11v9.5h-11V7Z',
    'M13.5 10h3.8l3.2 3.2v3.3h-7',
    'M7 19a1.9 1.9 0 1 0 0-3.8A1.9 1.9 0 0 0 7 19Z',
    'M17 19a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z'
  ],
  bell: [
    'M6 16v-5.5a6 6 0 0 1 12 0V16l1.5 2.5h-15L6 16Z',
    'M10.5 21a2 2 0 0 0 3 0'
  ],
  chart: [
    'M4 4v16h16',
    'M8 15l3.5-4.5 3 2.5L19 7.5'
  ],
  gear: [
    'M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z',
    'M12 2.75v2.5',
    'M12 18.75v2.5',
    'M2.75 12h2.5',
    'M18.75 12h2.5',
    'M5.4 5.4l1.8 1.8',
    'M16.8 16.8l1.8 1.8',
    'M18.6 5.4l-1.8 1.8',
    'M7.2 16.8l-1.8 1.8'
  ],
  link: [
    'M10.5 13.5a4 4 0 0 0 6 .5l2.5-2.5a4 4 0 1 0-5.7-5.7L11.9 7.2',
    'M13.5 10.5a4 4 0 0 0-6-.5L5 12.5a4 4 0 1 0 5.7 5.7l1.4-1.4'
  ]
}

const paths = computed(() => ICONS[props.name] || [])
</script>

<template>
  <svg
    class="icon-system"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      v-for="(d, i) in paths"
      :key="i"
      :d="d"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style lang="scss" scoped>
.icon-system {
  display: block;
  flex-shrink: 0;
}
</style>
