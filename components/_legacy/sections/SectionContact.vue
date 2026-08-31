<script setup>
// §14 Final CTA + form. Left: heading, two paragraphs, Telegram button.
// Right: form with two tabs (already selling / not yet), shared fields on
// top, tab-specific fields switching with a 200ms fade and no height jump
// (container min-height = the taller panel, measured after fonts load).
// Submit is mocked: 800ms spinner → success state instead of the form.
const { t, lang } = useLang()
const { reveal } = useScrollMotion()

const TELEGRAM_URL = 'https://t.me/overdoneit'

const sectionEl = ref(null)
const formWrapEl = ref(null)
const panelHas = ref(null)
const panelNo = ref(null)

const activeTab = ref('has')
const panelsMinH = ref(0)
const formMinH = ref(0)

const submitting = ref(false)
const submitted = ref(false)

const fields = reactive({
  name: '',
  company: '',
  contact: '',
  site: '',
  selling: '',
  volume: 1,
  orders: [],
  sellingPlan: '',
  channels: [],
  volumeExpected: 1
})

// error keys ('required' | 'url') so messages follow the active locale
const errors = reactive({ name: null, contact: null, site: null, sellingPlan: null })

const volumeSteps = computed(() => t('calc.volume_steps'))

const orderOptions = computed(() => [
  { value: 'manual', label: t('form.orders_manual') },
  { value: 'crm', label: t('form.orders_crm') },
  { value: 'sheets', label: t('form.orders_sheets') },
  { value: 'other', label: t('form.orders_other') }
])

const channelOptions = computed(() => [
  { value: 'social', label: t('form.channels_social') },
  { value: 'marketplace', label: t('form.channels_marketplace') },
  { value: 'offline', label: t('form.channels_offline') },
  { value: 'none', label: t('form.channels_none') }
])

function errText(key) {
  return errors[key] ? t(`form.err_${errors[key]}`) : null
}

// soft URL check: enough to look like a link, no strict parsing
function looksLikeUrl(value) {
  return /^(https?:\/\/)?[^\s]+\.[^\s]{2,}/i.test(value.trim())
}

function validateField(key) {
  const v = String(fields[key] ?? '').trim()
  if (key === 'site') {
    if (!v) errors.site = 'required'
    else if (!looksLikeUrl(v)) errors.site = 'url'
    else errors.site = null
    return
  }
  errors[key] = v ? null : 'required'
}

function validateAll() {
  validateField('name')
  validateField('contact')
  if (activeTab.value === 'has') {
    validateField('site')
    errors.sellingPlan = null
  } else {
    validateField('sellingPlan')
    errors.site = null
  }
  return !errors.name && !errors.contact && !errors.site && !errors.sellingPlan
}

function switchTab(tab) {
  if (activeTab.value === tab) return
  activeTab.value = tab
  // a hidden tab's errors must not block or confuse
  errors.site = null
  errors.sellingPlan = null
}

function onTabKeydown(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    switchTab(activeTab.value === 'has' ? 'no' : 'has')
    sectionEl.value.querySelector('.contact-tabs__tab.is-active')?.focus()
  }
}

async function onSubmit() {
  if (submitting.value || submitted.value) return
  if (!validateAll()) {
    await nextTick()
    sectionEl.value.querySelector('.p-input.has-error input')?.focus()
    return
  }

  submitting.value = true
  // keep the column height so the success state doesn't collapse the page
  formMinH.value = formWrapEl.value?.offsetHeight || 0

  const payload = {
    tab: activeTab.value,
    name: fields.name,
    company: fields.company,
    contact: fields.contact,
    ...(activeTab.value === 'has'
      ? {
          site: fields.site,
          selling: fields.selling,
          volume: volumeSteps.value[fields.volume],
          orders: fields.orders
        }
      : {
          sellingPlan: fields.sellingPlan,
          channels: fields.channels,
          volumeExpected: volumeSteps.value[fields.volumeExpected]
        })
  }

  // TODO(API): endpoint — сейчас mock-отправка (console + локальный success)
  console.log('[contact form] payload:', payload)

  await new Promise((r) => setTimeout(r, 800))
  submitting.value = false
  submitted.value = true
}

// ---------------------------------------------------------------------------
// height bookkeeping: min-height of the panels area = the taller tab panel
// ---------------------------------------------------------------------------
function measurePanels() {
  const a = panelHas.value?.scrollHeight || 0
  const b = panelNo.value?.scrollHeight || 0
  panelsMinH.value = Math.max(a, b)
}

let resizeTimer = null

function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(measurePanels, 150)
}

watch(lang, () => nextTick(measurePanels))

onMounted(async () => {
  reveal(sectionEl.value.querySelectorAll('.js-reveal'), { stagger: 0.08 })
  window.addEventListener('resize', onResize)
  await document.fonts.ready
  measurePanels()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  clearTimeout(resizeTimer)
})
</script>

<template>
  <section id="contact" ref="sectionEl" class="section section-contact">
    <!-- TODO(ASSET): слот под 3D-фигуру у формы (как футер главной) — положить
         изображение в public/img/ и вывести его в .section-contact__glow -->
    <span class="section-contact__glow" aria-hidden="true" />

    <div class="container section-contact__inner">
      <div class="section-contact__text">
        <SectionEyebrow class="js-reveal reveal" :label="t('contact.eyebrow')" />
        <SectionTitle class="section-contact__title js-reveal reveal" :text="t('contact.title')" />
        <p class="body-lg text-secondary js-reveal reveal">{{ t('contact.p1') }}</p>
        <!-- R1: contact.p2 скрыт — перегруз перед формой -->
        <PButton class="section-contact__tg js-reveal reveal" variant="secondary" :href="TELEGRAM_URL" target="_blank">
          {{ t('cta.telegram') }}
        </PButton>

        <svg class="section-contact__decor" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 168C52 96 128 44 308 30" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.55" />
          <path d="M12 168C84 130 190 108 306 106" stroke="var(--color-border-strong)" stroke-width="1" stroke-dasharray="2 7" />
          <circle cx="12" cy="168" r="3.5" fill="var(--color-accent)" />
          <circle cx="308" cy="30" r="3" fill="var(--color-text-muted)" />
          <circle cx="306" cy="106" r="2.5" fill="var(--color-text-muted)" opacity="0.7" />
        </svg>
      </div>

      <div ref="formWrapEl" class="section-contact__form-wrap js-reveal reveal" :style="formMinH ? { minHeight: `${formMinH}px` } : null" aria-live="polite">
        <!-- success state replaces the form -->
        <div v-if="submitted" class="contact-success">
          <h3 class="contact-success__title">{{ t('form.success_title') }}</h3>
          <p class="contact-success__text text-secondary">{{ t('form.success_text') }}</p>
          <PButton variant="secondary" :href="TELEGRAM_URL" target="_blank">
            {{ t('cta.telegram') }}
          </PButton>
        </div>

        <form v-else class="contact-form" novalidate @submit.prevent="onSubmit">
          <!-- tabs -->
          <div class="contact-tabs" role="tablist" :aria-label="t('contact.eyebrow')" @keydown="onTabKeydown">
            <button
              id="contact-tab-has"
              type="button"
              role="tab"
              class="contact-tabs__tab"
              :class="{ 'is-active': activeTab === 'has' }"
              :aria-selected="activeTab === 'has' ? 'true' : 'false'"
              aria-controls="contact-panel-has"
              :tabindex="activeTab === 'has' ? 0 : -1"
              @click="switchTab('has')"
            >
              {{ t('form.tab_has') }}
            </button>
            <button
              id="contact-tab-no"
              type="button"
              role="tab"
              class="contact-tabs__tab"
              :class="{ 'is-active': activeTab === 'no' }"
              :aria-selected="activeTab === 'no' ? 'true' : 'false'"
              aria-controls="contact-panel-no"
              :tabindex="activeTab === 'no' ? 0 : -1"
              @click="switchTab('no')"
            >
              {{ t('form.tab_no') }}
            </button>
            <span
              class="contact-tabs__indicator"
              :class="{ 'is-right': activeTab === 'no' }"
              aria-hidden="true"
            />
          </div>

          <!-- shared fields -->
          <div class="contact-form__fields">
            <PInput
              v-model="fields.name"
              input-id="cf-name"
              :label="t('form.name')"
              required
              autocomplete="name"
              :error="errText('name')"
              @blur="validateField('name')"
            />
            <PInput
              v-model="fields.company"
              input-id="cf-company"
              :label="t('form.company')"
              autocomplete="organization"
            />
            <PInput
              v-model="fields.contact"
              input-id="cf-contact"
              :label="t('form.contact')"
              required
              :hint="t('form.contact_hint')"
              :error="errText('contact')"
              @blur="validateField('contact')"
            />
          </div>

          <!-- tab panels (both stay in DOM so the taller one sets min-height) -->
          <div class="contact-form__panels" :style="panelsMinH ? { minHeight: `${panelsMinH}px` } : null">
            <div
              id="contact-panel-has"
              ref="panelHas"
              role="tabpanel"
              aria-labelledby="contact-tab-has"
              class="contact-form__panel"
              :class="{ 'is-active': activeTab === 'has' }"
            >
              <PInput
                v-model="fields.site"
                input-id="cf-site"
                type="url"
                :label="t('form.site')"
                required
                autocomplete="url"
                :error="errText('site')"
                @blur="validateField('site')"
              />
              <PInput v-model="fields.selling" input-id="cf-selling" :label="t('form.selling')" />
              <PSlider
                v-model="fields.volume"
                input-id="cf-volume"
                :label="t('form.volume')"
                :options="volumeSteps"
              />
              <PChips
                v-model="fields.orders"
                group-id="cf-orders"
                :label="t('form.orders_label')"
                :options="orderOptions"
              />
            </div>

            <div
              id="contact-panel-no"
              ref="panelNo"
              role="tabpanel"
              aria-labelledby="contact-tab-no"
              class="contact-form__panel"
              :class="{ 'is-active': activeTab === 'no' }"
            >
              <PInput
                v-model="fields.sellingPlan"
                input-id="cf-selling-plan"
                :label="t('form.selling_plan')"
                required
                :error="errText('sellingPlan')"
                @blur="validateField('sellingPlan')"
              />
              <PChips
                v-model="fields.channels"
                group-id="cf-channels"
                :label="t('form.channels_label')"
                :options="channelOptions"
              />
              <PSlider
                v-model="fields.volumeExpected"
                input-id="cf-volume-expected"
                :label="t('form.volume_expected')"
                :options="volumeSteps"
              />
            </div>
          </div>

          <PButton class="contact-form__submit" variant="primary" type="submit" block :loading="submitting">
            {{ t('form.submit') }}
          </PButton>
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-contact {
  position: relative;
  overflow: hidden;

  // red glow from the bottom (main-site footer reference)
  &__glow {
    @include accent-glow(720px, 0.4);
    left: 50%;
    bottom: -360px;
    transform: translateX(-50%);
  }

  &__inner {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: $spacing-11;
    align-items: start;

    @include respond(lg) {
      grid-template-columns: 1fr;
      gap: $spacing-8;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-4;
    max-width: 520px;
  }

  &__title {
    margin-top: $spacing-2;
    margin-bottom: $spacing-3;
  }

  &__tg {
    margin-top: $spacing-4;
  }

  // decorative arc + nodes (R1)
  &__decor {
    width: 300px;
    margin-top: $spacing-10;
    opacity: 0.9;

    @include respond(lg) {
      display: none;
    }
  }

  // R1: форма — в surface-плашке, как «Get in Touch» на проде
  &__form-wrap {
    position: relative;
    padding: $spacing-8;
    @include glass;

    @include respond(md) {
      padding: $spacing-5;
    }
  }
}

// Tabs ----------------------------------------------------------------------
.contact-tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--color-border-strong);

  &__tab {
    min-height: 48px;
    padding: $spacing-3 $spacing-4;
    font-size: $fs-body;
    color: var(--color-text-muted);
    transition: color 200ms ease;
    @include focus-visible;

    &:hover,
    &.is-active {
      color: var(--color-text);
    }
  }

  // sliding underline
  &__indicator {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 50%;
    height: 2px;
    background: var(--color-accent);
    transition: transform 250ms ease;

    &.is-right {
      transform: translateX(100%);
    }
  }
}

// Form ----------------------------------------------------------------------
.contact-form {
  &__fields {
    display: flex;
    flex-direction: column;
    gap: $spacing-6;
    margin-top: $spacing-7;
  }

  &__panels {
    position: relative;
    margin-top: $spacing-6;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    gap: $spacing-6;
    transition: opacity 200ms ease;

    // inactive panel overlaps invisibly — no height jump, no tab stops
    &:not(.is-active) {
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
  }

  &__submit {
    margin-top: $spacing-8;
  }
}

// Success state --------------------------------------------------------------
.contact-success {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $spacing-4;
  padding-top: $spacing-7;

  &__title {
    font-size: $fs-h2-m;
    font-weight: 400;
    letter-spacing: $ls-h2;
  }

  &__text {
    max-width: 460px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-tabs__indicator,
  .contact-tabs__tab,
  .contact-form__panel {
    transition: none;
  }
}
</style>
