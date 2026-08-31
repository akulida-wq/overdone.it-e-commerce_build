<script setup>
// R2.6 accordion plashka (sharplink FAQ reference, photo r2-s11): full-width
// GLASS card with a large radius, roomy paddings, the plus in a bordered
// circle on the right; the open card highlights with the strong border.
// Height animated via the grid-rows trick. Open state is controlled by the
// parent (FAQ keeps a single item open).
const props = defineProps({
  open: { type: Boolean, default: false },
  // id base for aria wiring; must be unique within the page
  itemId: { type: String, required: true }
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="p-accordion" :class="{ 'is-open': open }">
    <h3 class="p-accordion__heading">
      <button
        :id="`${itemId}-button`"
        class="p-accordion__trigger"
        type="button"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="`${itemId}-panel`"
        @click="emit('toggle')"
      >
        <span class="p-accordion__title"><slot name="title" /></span>
        <span class="p-accordion__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </span>
      </button>
    </h3>
    <div
      :id="`${itemId}-panel`"
      class="p-accordion__panel"
      role="region"
      :aria-labelledby="`${itemId}-button`"
      :hidden="!open ? '' : null"
    >
      <div class="p-accordion__panel-inner">
        <div class="p-accordion__content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p-accordion {
  @include glass;
  // closed cards keep the quiet border so the open one's strong border reads
  border-color: var(--color-border);
  border-radius: $radius-lg;
  transition: border-color 250ms ease;

  &.is-open {
    border-color: var(--color-border-strong);
  }

  &__heading {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-6;
    width: 100%;
    padding: $spacing-6 $spacing-7;
    text-align: left;
    color: var(--color-text);
    @include focus-visible;

    @include respond(md) {
      padding: $spacing-5;
    }
  }

  &__title {
    font-size: $fs-body-lg;
    font-weight: 400;
    line-height: $lh-h3;

    @include respond(md) {
      font-size: $fs-body-lg-m;
    }
  }

  // plus in a bordered circle
  &__icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--color-border-strong);
    border-radius: 50%;
    color: var(--color-text-muted);
    transition: transform 250ms ease, color 250ms ease, border-color 250ms ease;
  }

  &.is-open &__icon {
    transform: rotate(45deg);
    color: var(--color-accent);
    border-color: rgba(241, 38, 37, 0.45);
  }

  // grid-rows trick: 0fr → 1fr animates height without measuring
  &__panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 300ms ease;

    // [hidden] would remove it from the layout — visibility handles a11y here
    &[hidden] {
      display: grid;
      visibility: hidden;
    }
  }

  &.is-open &__panel {
    grid-template-rows: 1fr;
    visibility: visible;
  }

  &__panel-inner {
    overflow: hidden;
    min-height: 0;
  }

  &__content {
    padding: 0 $spacing-7 $spacing-6;
    color: var(--color-text-secondary);
    max-width: 90%;

    @include respond(md) {
      padding: 0 $spacing-5 $spacing-5;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__panel,
    &__icon {
      transition: none;
    }
  }
}
</style>
