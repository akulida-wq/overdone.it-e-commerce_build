<script setup>
// V2 S12 form (Figma 903:54647 s1 / 903:53800 s2): left — title, intro and
// the Book a Call / Telegram block; right — the glass form panel with two
// tabs (the mockup's s1/s2 states), floating-label underline inputs, chips,
// the tick slider and the submit CTA. The validation/mock-submit/success
// logic is carried over from the previous version. The red 3D render sits
// behind the bottom of the section.
const { t } = useLang()
const rootEl = ref(null)
const { sectionReveal } = useScrollMotion()
onMounted(() => sectionReveal(rootEl.value))


const CALENDLY_URL = 'https://calendly.com/a-harhalyk-overdone'
const TELEGRAM_URL = 'https://t.me/overdoneit'

const activeTab = ref('has') // 'has' | 'no' — mockup s1 / s2

const fields = reactive({
  name: '',
  link: '',
  company: '',
  contact: '',
  sell: '',
  sellPlan: ''
})

const chipsHas = ref([]) // R5: nothing preselected by default
const chipsNo = ref([])
const volume = ref(45) // R3.9: free 0..100 position (mockup ~$40-60k)

const errors = reactive({})
const loading = ref(false)
const success = ref(false)

const volumeSteps = computed(() => t('v2.volume_steps'))

// R3.9 — free continuous volume position with locale money display
const { lang } = useLang()
const { money } = useSliderFormat()
// R10: the max display value matches the right end label ($100k+ / 10+ млн ₴)
const VOLUME_RANGE = computed(() => (lang.value === 'ua' ? [50e3, 10e6] : [5e3, 100e3]))
const fmtVolume = (pos) => money(VOLUME_RANGE.value[0] + ((VOLUME_RANGE.value[1] - VOLUME_RANGE.value[0]) * pos) / 100)

// error texts live as KEYS so they re-translate on locale switch
function errText(key) {
  return key ? t(`form.${key}`) : ''
}

const URL_RE = /^(https?:\/\/)?\S+\.\S{2,}/

function validateField(name) {
  const v = fields[name].trim()
  if (name === 'name' && !v) return 'err_required'
  if (name === 'contact' && !v) return 'err_required'
  if (activeTab.value === 'has') {
    if (name === 'link') {
      if (!v) return 'err_required'
      if (!URL_RE.test(v)) return 'err_url'
    }
    if (name === 'sell' && !v) return 'err_required'
  } else {
    if (name === 'sellPlan' && !v) return 'err_required'
  }
  return null
}

function onBlur(name) {
  errors[name] = validateField(name)
}

// template auto-unwraps the refs — `list` arrives as the plain array
function toggleChip(list, i) {
  const idx = list.indexOf(i)
  if (idx === -1) list.push(i)
  else list.splice(idx, 1)
}

function onSubmit() {
  const active = activeTab.value === 'has'
    ? ['name', 'link', 'contact', 'sell']
    : ['name', 'contact', 'sellPlan']
  let firstBad = null
  for (const f of active) {
    errors[f] = validateField(f)
    if (errors[f] && !firstBad) firstBad = f
  }
  if (firstBad) {
    document.getElementById(`contact-${firstBad}`)?.focus()
    return
  }
  loading.value = true
  // TODO(API): endpoint
  console.log('[contact form]', {
    tab: activeTab.value,
    ...fields,
    chips: activeTab.value === 'has' ? chipsHas.value : chipsNo.value,
    volume: fmtVolume(volume.value)
  })
  setTimeout(() => {
    loading.value = false
    success.value = true
  }, 800)
}

const inputs = computed(() => {
  const has = activeTab.value === 'has'
  return [
    { key: 'name', label: t('v2.f_name'), required: true, half: true },
    has
      ? { key: 'link', label: t('v2.f_link'), required: true, half: true }
      : { key: 'company', label: t('v2.f_company'), required: false, half: true },
    { key: 'contact', label: t('v2.f_contact'), required: true, half: false },
    has
      ? { key: 'sell', label: t('v2.f_sell'), required: true, half: false }
      : { key: 'sellPlan', label: t('v2.f_sell_plan'), required: true, half: false }
  ]
})
</script>

<template>
  <section id="contact" ref="rootEl" class="section-contact">
    <!-- R9: the customer's full logo render (not the cropped Figma slice) —
         sized in vw so it is NEVER cut by the viewport on any device -->
    <img
      class="section-contact__bg"
      src="/img/v2/footer-logo.webp"
      alt=""
      width="1400"
      height="1408"
      loading="lazy"
      aria-hidden="true"
    />

    <div class="container section-contact__inner">
      <div class="section-contact__left">
        <div class="section-contact__intro">
          <SectionTitle class="section-contact__title v2-mask" :text="t('v2.contact_title')" />
          <p class="section-contact__p v2-reveal">
            {{ t('v2.contact_p') }}
            <br />
            {{ t('v2.contact_p2') }}
          </p>
        </div>

        <div class="section-contact__channels v2-reveal">
          <a class="channel-row" :href="CALENDLY_URL" target="_blank" rel="noopener">
            <span class="channel-row__label">{{ t('v2.book_call') }}</span>
            <span class="channel-row__icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 -960 960 960" fill="currentColor"><path d="M212.31-100Q182-100 161-121q-21-21-21-51.31v-535.38Q140-738 161-759q21-21 51.31-21h55.38v-84.61h61.54V-780h303.08v-84.61h60V-780h55.38Q778-780 799-759q21 21 21 51.31v535.38Q820-142 799-121q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-375.38H200v375.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM200-607.69h560v-100q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v100Zm0 0V-720v112.31Z"/></svg>
            </span>
          </a>
          <a class="channel-row" :href="TELEGRAM_URL" target="_blank" rel="noopener">
            <span class="channel-row__label">{{ t('v2.telegram_short') }}</span>
            <span class="channel-row__icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 -960 960 960" fill="currentColor"><path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-227v148.77L403.85-480 180-401.77V-253Zm0 0v-454 454Z"/></svg>
            </span>
          </a>
        </div>
      </div>

      <!-- form panel -->
      <div class="contact-panel v2-reveal">
        <template v-if="!success">
          <div class="contact-panel__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              class="contact-tab"
              :class="{ 'is-active': activeTab === 'has' }"
              :aria-selected="activeTab === 'has' ? 'true' : 'false'"
              aria-controls="contact-form-panel"
              @click="activeTab = 'has'"
            >
              <IconMs name="add_shopping_cart" :size="20" />
              <span>{{ t('v2.tab_has') }}</span>
            </button>
            <button
              type="button"
              role="tab"
              class="contact-tab"
              :class="{ 'is-active': activeTab === 'no' }"
              :aria-selected="activeTab === 'no' ? 'true' : 'false'"
              aria-controls="contact-form-panel"
              @click="activeTab = 'no'"
            >
              <IconMs name="remove_shopping_cart" :size="20" />
              <span>{{ t('v2.tab_no') }}</span>
            </button>
          </div>

          <form id="contact-form-panel" role="tabpanel" class="contact-panel__form" novalidate @submit.prevent="onSubmit">
            <div class="contact-panel__fields">
              <div
                v-for="f in inputs"
                :key="f.key"
                class="contact-field"
                :class="{ 'contact-field--half': f.half, 'has-error': errors[f.key] }"
              >
                <input
                  :id="`contact-${f.key}`"
                  v-model="fields[f.key]"
                  class="contact-field__input"
                  type="text"
                  :aria-invalid="errors[f.key] ? 'true' : null"
                  :aria-describedby="errors[f.key] ? `contact-${f.key}-err` : null"
                  placeholder=" "
                  @blur="onBlur(f.key)"
                />
                <label class="contact-field__label" :for="`contact-${f.key}`">
                  {{ f.label }}<span v-if="f.required" class="contact-field__req"> *</span>
                </label>
                <p v-if="errors[f.key]" :id="`contact-${f.key}-err`" class="contact-field__error">
                  {{ errText(errors[f.key]) }}
                </p>
              </div>
            </div>

            <div class="contact-panel__chips">
              <p class="contact-panel__chips-label">
                {{ activeTab === 'has' ? t('v2.chips_has_label') : t('v2.chips_no_label') }}
              </p>
              <div class="contact-panel__chips-row" role="group">
                <button
                  v-for="(chip, i) in (activeTab === 'has' ? t('v2.chips_has') : t('v2.chips_no'))"
                  :key="chip"
                  type="button"
                  class="contact-chip"
                  :class="{ 'is-on': (activeTab === 'has' ? chipsHas : chipsNo).includes(i) }"
                  :aria-pressed="(activeTab === 'has' ? chipsHas : chipsNo).includes(i) ? 'true' : 'false'"
                  @click="toggleChip(activeTab === 'has' ? chipsHas : chipsNo, i)"
                >
                  {{ chip }}
                </button>
              </div>
            </div>

            <PSlider
              v-model="volume"
              input-id="contact-volume"
              :label="t('v2.volume_label')"
              approx
              :format="fmtVolume"
              :show-ends="false"
            />

            <PButton variant="primary" block type="submit" :loading="loading">
              {{ t('cta.discuss') }}
            </PButton>
          </form>
        </template>

        <div v-else class="contact-panel__success">
          <p class="contact-panel__success-title">{{ t('form.success_title') }}</p>
          <p class="contact-panel__success-text">{{ t('form.success_text') }}</p>
          <PButton variant="secondary" :href="TELEGRAM_URL" target="_blank">
            {{ t('cta.telegram') }}
          </PButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-contact {
  position: relative;
  // R5: the form + footer are ONE visual block — tighter bottom padding,
  // x-clip only so the render can run down behind the footer
  padding-block: var(--rhythm-half) $spacing-8;
  overflow-x: clip;

  // R10/R12 (r6-s0, «4/5 по высоте»): the mockup composition — the ring is
  // BIG, its top-left hides BEHIND the form panel, the visible loop emerges
  // below the form and sweeps behind the footer; it sits LOW enough that
  // only ~4/5 of its height stays above the page end (the .app clip crops
  // the rest)
  &__bg {
    position: absolute;
    left: 40vw;
    bottom: max(-620px, -43vw); // R14: ещё на ~140px ниже
    width: min(64vw, 1150px);
    max-width: none; // R16: the global img reset capped every >100vw size
    height: auto;
    pointer-events: none;
  }

  // R8: the text block stays left, the form docks to the container's right
  // edge — the gap between them grows with the viewport (фото 33 vs 34)
  &__inner {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: $spacing-7;
    align-items: stretch;
  }

  &__left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: $spacing-9;
    flex: 1;

    // R5/R8: the left column keeps the mockup width on desktop — all the
    // extra space becomes the gap in front of the right-docked form
    @media (min-width: 1025px) {
      max-width: calc(640px * var(--k));
    }
  }

  &__intro {
    display: flex;
    flex-direction: column;
    gap: $spacing-7;
  }

  &__title {
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
  }

  &__p {
    max-width: calc(620px * var(--k));
    font-size: calc(24px * var(--k)); // mockup lead size
    letter-spacing: -0.03em;
    line-height: normal;
    color: var(--color-text-muted);
  }

  // Book a Call / Telegram stacked rows — R9: the border lives on the
  // CONTAINER (rows only draw the inner divider), so the rounded corners
  // are never sliced by a row's own square border
  &__channels {
    border: 1px solid var(--color-border-table);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.5);
    -webkit-backdrop-filter: blur(64px);
    backdrop-filter: blur(64px);
    overflow: hidden;
  }
}

.channel-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-7;
  height: calc(168px * var(--k));
  padding: $spacing-7;
  color: var(--color-text-muted);
  transition: color 250ms ease, background-color 250ms ease;
  @include focus-visible;

  & + & {
    border-top: 1px solid var(--color-border-table);
  }

  &__label {
    font-size: $fs-h4;
    letter-spacing: $ls-h3;
    line-height: 1;
  }

  &__icon {
    display: inline-flex;
  }

  &:hover {
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.04);
  }
}

// form panel ------------------------------------------------------------------
.contact-panel {
  display: flex;
  flex-direction: column;
  gap: $spacing-7;
  width: calc(640px * var(--k));
  padding: $spacing-7;
  border: 1px solid var(--color-border-table);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: blur(64px);
  backdrop-filter: blur(64px);
  flex-shrink: 0;
}

// R9 (макет 1в1): ONE shared stroke around both tabs; the active tab draws
// its own red pill on top of the shared frame
.contact-panel__tabs {
  display: flex;
  border: 1px solid var(--color-border-table);
  border-radius: $radius-pill; // R27: max-rounded tabs (Figma 903:53800)
}

.contact-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-3;
  flex: 1;
  margin: -1px;
  padding: $spacing-4 $spacing-3;
  border: 1px solid transparent;
  border-radius: $radius-pill; // R27: max-rounded tabs
  font-size: $fs-body-lg;
  letter-spacing: $ls-body-lg;
  line-height: 1.1;
  color: var(--color-text-secondary);
  transition: color 200ms ease, border-color 200ms ease;
  @include focus-visible;

  &.is-active {
    position: relative;
    z-index: 1;
    color: var(--color-accent);
    border-color: var(--color-accent);
  }
}

.contact-panel__form {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
}

.contact-panel__fields {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-6;
}

.contact-field {
  position: relative;
  width: 100%;

  &--half {
    width: calc(50% - #{$spacing-6} / 2);
  }

  &__input {
    width: 100%;
    padding: $spacing-3 0 $spacing-2; // R5: label sits closer to the line
    border: none; // kill the UA default 2px inset on the other three sides
    border-bottom: 1px solid var(--color-border-table);
    font-size: $fs-body;
    letter-spacing: -0.03em;
    color: var(--color-text);
    background: transparent;
    transition: border-color 200ms ease;

    &:focus {
      outline: none;
      border-color: var(--color-text);
    }
  }

  // floating label: sits in the field like the mockup placeholder, shrinks up
  // on focus/входе — the label stays visible and accessible
  &__label {
    position: absolute;
    left: 0;
    top: $spacing-3;
    font-size: $fs-body;
    letter-spacing: -0.03em;
    color: var(--color-text-muted);
    pointer-events: none;
    transition: transform 200ms ease, font-size 200ms ease, top 200ms ease;
    transform-origin: left top;
  }

  &__input:focus ~ .contact-field__label,
  &__input:not(:placeholder-shown) ~ .contact-field__label {
    top: -6px;
    font-size: 11px;
  }

  &__req {
    color: var(--color-accent);
  }

  &__error {
    margin-top: $spacing-1;
    font-size: $fs-mono-m;
    color: var(--color-accent);
  }

  &.has-error &__input {
    border-color: var(--color-accent);
  }
}

.contact-panel__chips {
  display: flex;
  flex-direction: column;
  gap: $spacing-5;
}

.contact-panel__chips-label {
  font-size: $fs-body;
  letter-spacing: -0.03em;
  color: var(--color-text);
}

.contact-panel__chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
}

.contact-chip {
  padding: $spacing-2 $spacing-3;
  border: 1px solid var(--color-border-table);
  border-radius: $radius-pill;
  font-size: $fs-small;
  letter-spacing: -0.03em;
  color: var(--color-text-muted);
  transition: color 200ms ease, border-color 200ms ease;
  @include focus-visible;

  &.is-on {
    border-color: var(--color-text);
    color: var(--color-text);
  }
}

.contact-panel__success {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $spacing-6;
  padding: $spacing-6 0;

  &-title {
    font-size: $fs-h3-m;
    letter-spacing: $ls-h3;
  }

  &-text {
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    color: var(--color-text-secondary);
    max-width: 460px;
  }
}

@include respond(lg) {
  .section-contact {
    &__inner {
      flex-direction: column;
      gap: $spacing-8;
    }

    // R11 (r6-11/s16): the ring goes BIG on tablets and phones — cropping
    // at the left/bottom is fine, it reads as a brand backdrop
    &__bg {
      left: auto;
      right: -8vw; // the ring hugs the right side — the LEFT edge crops
      bottom: -34vw;
      width: 130vw;
    }

    // R16 (фото 2): phones get it another step bigger — the RIGHT side crops
    @include respond(md) {
      &__bg {
        left: -15vw;
        right: auto;
        width: 170vw;
      }
    }
  }

  .contact-panel {
    width: 100%;
  }
}

@include respond(md) {
  .section-contact__p {
    font-size: $fs-body-lg-m;
  }

  .channel-row {
    height: 120px;

    &__label {
      font-size: $fs-h3-m;
    }
  }

  .contact-panel {
    padding: $spacing-5;
  }

  .contact-field--half {
    width: 100%;
  }

  .contact-tab {
    font-size: $fs-body;
    min-height: 44px;
  }

  // comfortable touch targets for the chips
  .contact-chip {
    min-height: 44px;
    padding: $spacing-3 $spacing-4;
  }
}


// R16 (фото 1): on narrow phones the two tabs stack vertically — side by
// side each label wrapped into two cramped lines
@include respond(sm) {
  // R29 (фото 4): stacked pill tabs floated apart inside the r999 frame —
  // segmented-control look instead: small inset, own radius per tab, no
  // negative-margin overlap
  .contact-panel__tabs {
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    border-radius: 32px;
  }

  .contact-tab {
    margin: 0;
  }
}

@include respond(md) {
  .section-contact__title {
    font-size: $fs-h2-m;
  }
}
</style>
