<script setup>
// §3 Ticker: full-width endless marquee of ticker.items with ○ separators.
// Pure CSS animation (width-independent: the track holds two identical groups
// and translates by -50%), pauses on hover; reduced motion → static wrapped
// row, the duplicate group is hidden.
const { t } = useLang()

const items = computed(() => t('ticker.items'))
</script>

<template>
  <section id="ticker" class="section-ticker">
    <div class="section-ticker__track">
      <ul class="section-ticker__group">
        <li v-for="(item, i) in items" :key="i" class="section-ticker__item">
          <span class="section-ticker__text">{{ item }}</span>
          <span class="section-ticker__sep" aria-hidden="true">○</span>
        </li>
      </ul>
      <ul class="section-ticker__group section-ticker__group--copy" aria-hidden="true">
        <li v-for="(item, i) in items" :key="i" class="section-ticker__item">
          <span class="section-ticker__text">{{ item }}</span>
          <span class="section-ticker__sep" aria-hidden="true">○</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-ticker {
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);

  &__track {
    display: flex;
    width: max-content;
  }

  &__group {
    display: flex;
    flex-shrink: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding-block: $spacing-5;
  }

  &__text {
    font-size: $fs-body;
    color: var(--color-text-secondary);
  }

  &__sep {
    font-family: $font-mono;
    font-size: $fs-mono;
    color: var(--color-text-muted);
    margin-inline: $spacing-6;
  }

  @media (prefers-reduced-motion: no-preference) {
    &__track {
      animation: ticker-scroll 30s linear infinite;
    }

    &:hover &__track {
      animation-play-state: paused;
    }
  }

  // Static fallback: one group, wrapping lines
  @media (prefers-reduced-motion: reduce) {
    &__track {
      width: auto;
    }

    &__group {
      flex-wrap: wrap;
      row-gap: 0;
      // let the group shrink to the container so items can actually wrap
      flex-shrink: 1;
      min-width: 0;
      width: 100%;
      padding-inline: $container-pad-m;

      &--copy {
        display: none;
      }
    }

    &__item {
      white-space: normal;
    }

    &__item {
      padding-block: $spacing-2;

      &:first-child {
        padding-top: $spacing-5;
      }

      &:last-child {
        padding-bottom: $spacing-5;
      }
    }
  }
}

@keyframes ticker-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
