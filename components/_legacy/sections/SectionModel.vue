<script setup>
// R2.13 «Development without the upfront cost» (trionn “about” reference,
// photo r2-s18): ONE big statement (model.statement), words surfacing from
// muted to white one by one as the section scrubs through the viewport; the
// key phrase (model.statement_key) turns red. The old paragraphs + SVG chart
// are gone (keys stay in the locales but are not rendered).
//
// No SplitText: the statement is split into word spans by our own function.
// A11y: the container carries aria-label with the original string, the spans
// are aria-hidden. Reduced motion: text is white (final state) immediately.
const { t } = useLang()
const { gsap, reducedMotion } = useScrollMotion()

const statement = computed(() => t('model.statement'))

// words + key-phrase flags: a word is "key" when its character range falls
// inside the first occurrence of model.statement_key
const words = computed(() => {
  const text = statement.value
  const key = t('model.statement_key')
  const start = text.indexOf(key)
  const end = start >= 0 ? start + key.length : -1
  const out = []
  const re = /\S+/g
  let m
  while ((m = re.exec(text)) !== null) {
    out.push({ text: m[0], key: m.index >= start && start >= 0 && m.index < end })
  }
  return out
})

const sectionEl = ref(null)
const textEl = ref(null)

const litCount = ref(0)

// gsap's onUpdate writes classes directly (no Vue state in the template's
// :class — a re-render would wipe them, see SESSION_CONTEXT R2-P4)
function applyLit() {
  const spans = textEl.value?.querySelectorAll('.section-model__word')
  if (!spans) return
  spans.forEach((el, i) => el.classList.toggle('is-on', i < litCount.value))
}

let st = null

onMounted(() => {
  if (reducedMotion.value) return

  sectionEl.value.classList.add('is-anim')

  st = gsap.timeline({
    scrollTrigger: {
      trigger: textEl.value,
      start: 'top 80%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate(self) {
        const n = Math.round(self.progress * words.value.length)
        if (n !== litCount.value) {
          litCount.value = n
          applyLit()
        }
      }
    }
  })
})

// locale switch rebuilds the spans without their lit classes — re-apply
watch(words, () => nextTick(applyLit))

onBeforeUnmount(() => {
  st?.scrollTrigger?.kill()
  st?.kill()
})
</script>

<template>
  <section id="model" ref="sectionEl" class="section section-model">
    <div class="container">
      <p ref="textEl" class="section-model__statement" :aria-label="statement">
        <template v-for="(w, i) in words" :key="i">
          <span
            class="section-model__word"
            :class="{ 'section-model__word--key': w.key }"
            aria-hidden="true"
          >{{ w.text }}</span>
          {{ ' ' }}
        </template>
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-model {
  &__statement {
    max-width: 1180px;
    font-size: $fs-h2;
    font-weight: $fw-heading;
    letter-spacing: $ls-h2;
    line-height: 1.16;

    @include respond(md) {
      font-size: $fs-h2-m;
    }
  }

  // default = final state (reduced motion / no JS): white, key phrase red
  &__word {
    color: var(--color-text);
    transition: color 200ms ease;

    &--key {
      color: var(--color-accent);
    }
  }

  // scrub mode: words start muted and light up via .is-on
  &.is-anim &__word {
    color: var(--color-text-muted);

    &.is-on {
      color: var(--color-text);
    }

    &--key.is-on {
      color: var(--color-accent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__word {
      transition: none;
    }
  }
}
</style>
