<script setup>
// V2 footer (Figma S12 frames): three link columns (Social networks / Pages /
// Services), the right block with Additional + Back to top + the EN/UA
// switcher, and the legal line (mono © left, company details right).
// R9 (фото 8): on phones (≤768) the link groups collapse into an accordion —
// the first group open, tapping another closes the previous (scope pattern);
// desktop keeps the flat columns (the toggles are inert there).
const { t, lang, setLang } = useLang()
const { scrollTo } = useScrollMotion()

const MAIN_SITE = 'https://overdone.it'

const compact = ref(false)
const open = ref('social')
let mq = null

function applyMq() {
  compact.value = mq.matches
}

function toggle(key) {
  if (!compact.value) return
  open.value = open.value === key ? null : key
}

function isOpen(key) {
  return !compact.value || open.value === key
}

onMounted(() => {
  mq = window.matchMedia('(max-width: 1024px)') // R11 (r6-s16): tablets collapse too
  applyMq()
  mq.addEventListener('change', applyMq)
})

onBeforeUnmount(() => {
  mq?.removeEventListener('change', applyMq)
})

function backToTop() {
  scrollTo(0)
}
</script>

<template>
  <footer class="p-footer">
    <div class="container">
      <div class="p-footer__cols">
        <div class="p-footer__col" :class="{ 'is-open': isOpen('social') }">
          <button
            type="button"
            class="p-footer__head"
            :aria-expanded="compact ? (isOpen('social') ? 'true' : 'false') : undefined"
            @click="toggle('social')"
          >
            {{ t('footer.social') }}
            <span class="p-footer__head-icon" aria-hidden="true" />
          </button>
          <div class="p-footer__items">
            <div class="p-footer__items-in">
              <a class="p-footer__link" href="https://www.instagram.com/overdone.it/" target="_blank" rel="noopener">{{ t('footer.instagram') }}</a>
              <a class="p-footer__link" href="https://www.linkedin.com/company/overdone-it/" target="_blank" rel="noopener">{{ t('footer.linkedin') }}</a>
            </div>
          </div>
        </div>
        <div class="p-footer__col" :class="{ 'is-open': isOpen('pages') }">
          <button
            type="button"
            class="p-footer__head"
            :aria-expanded="compact ? (isOpen('pages') ? 'true' : 'false') : undefined"
            @click="toggle('pages')"
          >
            {{ t('v2.footer_pages') }}
            <span class="p-footer__head-icon" aria-hidden="true" />
          </button>
          <div class="p-footer__items">
            <div class="p-footer__items-in">
              <a class="p-footer__link" :href="`${MAIN_SITE}/`">{{ t('footer.home') }}</a>
              <a class="p-footer__link" :href="`${MAIN_SITE}/pricing/`">{{ t('footer.pricing') }}</a>
            </div>
          </div>
        </div>
        <div class="p-footer__col" :class="{ 'is-open': isOpen('services') }">
          <button
            type="button"
            class="p-footer__head"
            :aria-expanded="compact ? (isOpen('services') ? 'true' : 'false') : undefined"
            @click="toggle('services')"
          >
            {{ t('footer.services') }}
            <span class="p-footer__head-icon" aria-hidden="true" />
          </button>
          <div class="p-footer__items">
            <div class="p-footer__items-in">
              <NuxtLink class="p-footer__link" to="/">{{ t('v2.footer_build') }}</NuxtLink>
              <a class="p-footer__link" :href="`${MAIN_SITE}/recruiting/`">{{ t('footer.recruiting') }}</a>
            </div>
          </div>
        </div>

        <div class="p-footer__right">
          <div class="p-footer__col" :class="{ 'is-open': isOpen('additional') }">
            <button
              type="button"
              class="p-footer__head"
              :aria-expanded="compact ? (isOpen('additional') ? 'true' : 'false') : undefined"
              @click="toggle('additional')"
            >
              {{ t('footer.additional') }}
              <span class="p-footer__head-icon" aria-hidden="true" />
            </button>
            <div class="p-footer__items">
              <div class="p-footer__items-in">
                <a class="p-footer__link" :href="`${MAIN_SITE}/privacy-policy/`" target="_blank" rel="noopener">{{ t('footer.privacy') }}</a>
              </div>
            </div>
          </div>
          <div class="p-footer__aside">
            <button type="button" class="p-footer__top" @click="backToTop">
            {{ t('footer.back_top') }}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            </button>
            <div class="p-footer__lang" role="group" :aria-label="t('a11y.lang_switch')">
            <button
              type="button"
              class="p-footer__lang-btn"
              :class="{ 'is-active': lang === 'en' }"
              :aria-pressed="lang === 'en' ? 'true' : 'false'"
              @click="setLang('en')"
            >
              EN
            </button>
            <button
              type="button"
              class="p-footer__lang-btn"
              :class="{ 'is-active': lang === 'ua' }"
              :aria-pressed="lang === 'ua' ? 'true' : 'false'"
              @click="setLang('ua')"
            >
                UA
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-footer__legal">
        <p class="p-footer__copy">{{ t('footer.copyright') }}</p>
        <p class="p-footer__company">
          {{ t('footer.company') }} · {{ t('footer.company_number') }}<br />{{ t('footer.address') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.p-footer {
  position: relative; // sits over the contact section's red render
  padding-block: $spacing-8; // R5: one visual block with the form section

  &__cols {
    display: flex;
    gap: $spacing-14;
    align-items: flex-start;
  }

  &__col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-5;
  }

  // mockup: Additional column + a far-right stack (back to top, language)
  &__right {
    margin-left: auto;
    display: flex;
    align-items: flex-start;
    gap: $spacing-14;
  }

  &__aside {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-5;
  }

  &__head {
    font-size: $fs-body;
    letter-spacing: -0.03em;
    color: var(--color-text-muted);
    text-align: left;
    @include focus-visible;
  }

  // the accordion plus — desktop hides it, the column list is always open
  &__head-icon {
    display: none;
    position: relative;
    width: 14px;
    height: 14px;
    flex-shrink: 0;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 14px;
      height: 1.5px;
      background: var(--color-text-muted);
      translate: -50% -50%;
      transition: rotate 300ms ease;
    }

    &::after {
      rotate: 90deg;
    }
  }

  // desktop: the collapse wrappers dissolve into the column flex
  &__items,
  &__items-in {
    display: contents;
  }

  &__link {
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: 1;
    color: var(--color-text);
    transition: opacity 200ms ease;
    @include focus-visible;

    &:hover {
      opacity: 0.7;
    }
  }

  &__top {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    font-size: $fs-body;
    letter-spacing: -0.03em;
    color: var(--color-text-muted);
    transition: color 200ms ease;
    @include focus-visible;

    &:hover {
      color: var(--color-text);
    }
  }

  &__lang {
    display: flex;
    padding: 2px;
    border: 1px solid var(--color-border-strong);
    border-radius: $radius-pill;
  }

  &__lang-btn {
    padding: $spacing-2 $spacing-4;
    border-radius: $radius-pill;
    font-family: $font-mono;
    font-size: $fs-mono-m;
    letter-spacing: $ls-mono;
    color: var(--color-text-muted);
    transition: color 200ms ease, background-color 200ms ease;
    @include focus-visible;

    &.is-active {
      background: var(--color-fill-soft);
      color: var(--color-text);
    }
  }

  &__legal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-6;
    margin-top: $spacing-11;
  }

  &__copy {
    font-family: $font-mono;
    font-size: $fs-body;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  &__company {
    font-size: $fs-body;
    letter-spacing: -0.03em;
    color: var(--color-text-muted);
    text-align: right;
  }
}

// R9/R11 (фото 8, r6-s16): phone AND tablet footer = accordion rows with
// table strokes — the flat five-column row overflowed on ≤1024
@include respond(lg) {
  .p-footer {
    &__cols {
      flex-direction: column;
      gap: 0;
      align-items: stretch;
      border-top: 1px solid var(--color-border-table);
    }

    &__col {
      width: 100%;
      gap: 0;
      border-bottom: 1px solid var(--color-border-table);
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-block: $spacing-5;
      font-size: $fs-body-lg-m;
      color: var(--color-text);
    }

    &__head-icon {
      display: block;
    }

    .is-open .p-footer__head-icon::after {
      rotate: 0deg;
    }

    &__items {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 350ms cubic-bezier(0.45, 0, 0.55, 1);
    }

    &__items-in {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-4;
      min-height: 0;
      overflow: hidden;
      // R32: the bottom padding JUMPED in discretely at open — the row height
      // animated smoothly but the content inside snapped 20px taller; easing
      // the padding along the same curve removes the jerk
      transition: padding-bottom 350ms cubic-bezier(0.45, 0, 0.55, 1);
    }

    .is-open .p-footer__items {
      grid-template-rows: 1fr;
    }

    .is-open .p-footer__items-in {
      padding-bottom: $spacing-5;
    }

    &__right {
      margin-left: 0;
      width: 100%;
      flex-direction: column;
      gap: 0;
      align-items: stretch;
    }

    &__aside {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-top: $spacing-6;
    }

    &__link {
      padding-block: $spacing-1; // touch comfort
      color: var(--color-text-secondary); // R16 (фото 2): grey accordion items
    }

    &__legal {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-3;
      margin-top: $spacing-8;
    }

    &__company {
      text-align: left;
    }

    @media (prefers-reduced-motion: reduce) {
      &__items,
      .p-footer__head-icon::before,
      .p-footer__head-icon::after {
        transition: none;
      }
    }
  }
}
</style>
