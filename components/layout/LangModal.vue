<script setup>
// First-visit language modal (PAGE_SPEC §0): appears 600ms after load when
// localStorage('od_lang') is empty. Any close without a choice keeps English
// and is remembered — the modal never shows again.
const { t, hasStoredChoice, setLang } = useLang()

const visible = ref(false)
const closing = ref(false)
const modalEl = ref(null)

let showTimer = null
let previouslyFocused = null

function choose(code) {
  setLang(code)
  close()
}

function dismiss() {
  // closed without choosing → stay on en, remember the dismissal
  setLang('en')
  close()
}

function close() {
  closing.value = true
  setTimeout(() => {
    visible.value = false
    closing.value = false
    previouslyFocused?.focus?.()
  }, 200)
}

function onKeydown(e) {
  if (!visible.value) return
  if (e.key === 'Escape') {
    dismiss()
    return
  }
  // focus trap
  if (e.key === 'Tab' && modalEl.value) {
    const focusables = modalEl.value.querySelectorAll('button')
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus({ preventScroll: true })
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus({ preventScroll: true })
    }
  }
}

// hasStoredChoice starts as true and is resolved by useLang().init() in
// app.vue after this component mounts — so react to it instead of checking
// once in onMounted.
watch(
  hasStoredChoice,
  (stored) => {
    if (stored || visible.value || showTimer) return
    showTimer = setTimeout(() => {
      visible.value = true
      previouslyFocused = document.activeElement
      nextTick(() => {
        // preventScroll: the modal is teleported to the end of <body>, and a
        // plain focus() makes Chrome scroll the document to that DOM position
        // (the page jumped to the bottom under the opened modal)
        modalEl.value?.querySelector('button')?.focus({ preventScroll: true })
      })
    }, 600)
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  clearTimeout(showTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="lang-modal" :class="{ 'is-closing': closing }">
      <div class="lang-modal__backdrop" @click="dismiss" />
      <div
        ref="modalEl"
        class="lang-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
      >
        <button
          type="button"
          class="lang-modal__close"
          :aria-label="t('a11y.close')"
          @click="dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>

        <p id="lang-modal-title" class="lang-modal__title">{{ t('lang_modal.title') }}</p>

        <div class="lang-modal__buttons">
          <PButton variant="secondary" block no-icon @click="choose('ua')">
            {{ t('lang_modal.ua') }}
          </PButton>
          <PButton variant="secondary" block no-icon @click="choose('en')">
            {{ t('lang_modal.en') }}
          </PButton>
        </div>

        <p class="lang-modal__note">{{ t('lang_modal.note') }}</p>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.lang-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $container-pad-m;
  animation: lang-modal-in 200ms ease both;

  &.is-closing {
    animation: lang-modal-out 200ms ease both;
  }

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  &__card {
    position: relative;
    width: 100%;
    max-width: 420px;
    padding: $spacing-8 $spacing-7 $spacing-6;
    @include card;
    animation: lang-modal-card-in 200ms ease both;
  }

  &.is-closing &__card {
    animation: lang-modal-card-out 200ms ease both;
  }

  &__close {
    position: absolute;
    top: $spacing-4;
    right: $spacing-4;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--color-text-muted);
    transition: color 200ms ease;
    @include focus-visible;

    &:hover {
      color: var(--color-text);
    }
  }

  &__title {
    margin-bottom: $spacing-6;
    padding-right: $spacing-7;
    font-size: $fs-body-lg;
    font-weight: 400;
    line-height: $lh-h3;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: $spacing-3;
  }

  &__note {
    margin-top: $spacing-5;
    font-size: $fs-small;
    color: var(--color-text-secondary); // muted падает ниже 4.5:1 на surface
  }
}

@keyframes lang-modal-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes lang-modal-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes lang-modal-card-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes lang-modal-card-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.96);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lang-modal,
  .lang-modal__card {
    animation-duration: 1ms !important;
  }
}
</style>
