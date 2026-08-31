<script setup>
// R3.0.B — the button is a 1:1 port of the live overdone.it `.button`
// (measured; see docs/BIG_DESKTOP.md §4): pill h48, 20px/400 text, an arrow
// on the LEFT at rest; on hover the left arrow collapses away while an
// «arrow in a tilted rounded frame» icon unfolds on the RIGHT — total width
// never changes, background/colors never change, everything runs on one
// 0.4s transition. Variants: primary (red) / secondary (gray) / white.
// Sizes come from the _scale.scss tokens so ≥2560 grows like the main site.
const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | white | ghost
  href: { type: String, default: null },
  target: { type: String, default: null },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  // hide the arrows entirely (e.g. language-modal rows)
  noIcon: { type: Boolean, default: false }
})

const tag = computed(() => (props.href ? 'a' : 'button'))

const rel = computed(() =>
  props.href && props.target === '_blank' ? 'noopener noreferrer' : null
)
</script>

<template>
  <component
    :is="tag"
    class="p-button"
    :class="[
      `p-button--${variant}`,
      { 'p-button--block': block, 'p-button--no-icon': noIcon, 'is-loading': loading, 'is-disabled': disabled }
    ]"
    :href="href || null"
    :target="href ? target : null"
    :rel="rel"
    :type="href ? null : type"
    :disabled="!href && (disabled || loading) ? true : null"
    :aria-disabled="href && disabled ? 'true' : null"
    :aria-busy="loading ? 'true' : null"
  >
    <!-- rest-state arrow (main site: .button__svg_left) -->
    <svg
      v-if="!noIcon"
      class="p-button__svg-left"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.00238 12.0009H16.0002M16.0002 12.0009L11.2096 7.00195M16.0002 12.0009L11.0013 16.9998"
        stroke="currentColor"
        stroke-width="1"
      />
    </svg>
    <span class="p-button__label"><slot /></span>
    <!-- hover-state icon (main site: .button__svg_right — arrow in a tilted rounded frame) -->
    <svg
      v-if="!noIcon"
      class="p-button__svg-right"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.76133 16.2418L14.8309 9.17227M14.8309 9.17227L7.90861 9.02499M14.8309 9.17227V16.2418"
        stroke="currentColor"
        stroke-width="1"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.61059 17.9986C-1.70231 12.2605 0.263742 4.92325 6.0017 1.61016C11.7398 -1.70275 19.0777 0.262639 22.3908 6.00057C25.7038 11.7388 23.7373 19.0767 17.999 22.3897C12.2608 25.7025 4.92354 23.7368 1.61059 17.9986ZM5.83666 4.41166C4.88501 4.41166 4.1133 5.18363 4.11308 6.13523L4.11377 18.3377C4.11378 19.2894 4.88488 20.0605 5.83666 20.0605L18.0391 20.0612C18.9907 20.061 19.7627 19.2893 19.7627 18.3377L19.762 6.13523C19.7617 5.18376 18.9906 4.41256 18.0391 4.41234L5.83666 4.41166Z"
        fill="currentColor"
      />
    </svg>
    <span v-if="loading" class="p-button__spinner" aria-hidden="true" />
  </component>
</template>

<style lang="scss" scoped>
.p-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--btn-h);
  padding-inline: var(--btn-pad);
  border-radius: 52px; // main site exact
  font-family: $font-display;
  font-size: var(--btn-fs);
  letter-spacing: normal; // main site: buttons carry no tracking
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  transition: 0.4s; // main site: one blanket 0.4s transition
  @include focus-visible;

  &--block {
    width: 100%;
  }

  &.is-disabled,
  &:disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  &.is-loading {
    .p-button__label,
    .p-button__svg-left,
    .p-button__svg-right {
      opacity: 0;
    }
  }
}

// Icon swap — the left arrow collapses (width + trailing gap + fade) while
// the right icon unfolds; the flex row keeps the button width constant.
.p-button__svg-left {
  flex: 0 0 auto;
  width: var(--btn-icon);
  height: var(--btn-icon);
  margin-right: var(--btn-gap);
  transition: inherit;
}

.p-button__svg-right {
  flex: 0 0 auto;
  width: 0;
  height: var(--btn-icon);
  margin-left: 0;
  opacity: 0;
  transition: inherit;
}

.p-button:hover:not(.p-button--no-icon):not(.is-disabled):not(:disabled) {
  .p-button__svg-left {
    width: 0;
    margin-right: 0;
    opacity: 0;
  }

  .p-button__svg-right {
    width: var(--btn-icon);
    margin-left: var(--btn-gap);
    opacity: 1;
  }
}

// Variants — geometry identical, only fills differ; hover changes nothing
// but the icons (measured on the live site).
.p-button--primary {
  background: var(--color-accent);
  color: var(--color-text);
}

.p-button--secondary {
  background: var(--color-fill-soft); // main .gray: rgba(255,255,255,0.1)
  color: var(--color-text);
}

.p-button--white {
  background: var(--color-text);
  color: var(--color-bg);
}

.p-button--ghost {
  background: transparent;
  color: var(--color-text);
}

// Loading spinner -----------------------------------------------------------
.p-button__spinner {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-text);
  border-radius: 50%;
  animation: p-button-spin 700ms linear infinite;
}

@keyframes p-button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .p-button,
  .p-button__svg-left,
  .p-button__svg-right {
    transition: none !important;
  }
}
</style>
