<script setup>
// R2.2 «What we handle» (photos r2-s1/r2-s2, thewatch.60fps.fr reference).
// Row: number on the left (centered on the title's axis) + title; the
// description fades in AT THE CENTER of the row on hover; a “+” on the right
// turns into “×”; the number goes red.
//
// CRITICAL hover model: the active row follows the cursor even when the page
// scrolls UNDER a motionless mouse. CSS :hover can't do that, so the last
// mouse position is stored and document.elementFromPoint() re-resolves the
// row on every mousemove AND every Lenis scroll tick (rAF-throttled). The
// class only switches when the resolved row actually changes.
// Touch devices keep tap-to-toggle.
const { t } = useLang()
const { gsap, reveal, reducedMotion, getLenis } = useScrollMotion()

const items = computed(() => t('scope.items'))

const sectionEl = ref(null)
const listEl = ref(null)
const canHover = ref(false)
const hoveredIdx = ref(null)
const pinnedIdx = ref(null)

function isOpen(i) {
  return pinnedIdx.value === i || (canHover.value && hoveredIdx.value === i)
}

function toggle(i) {
  pinnedIdx.value = pinnedIdx.value === i ? null : i
}

// --- cursor-follows-scroll active row --------------------------------------
let mouseX = -1
let mouseY = -1
let rafPending = false

function resolveActiveRow() {
  rafPending = false
  if (!canHover.value || mouseX < 0) return
  const el = document.elementFromPoint(mouseX, mouseY)
  const row = el?.closest?.('.scope-row')
  const idx = row && listEl.value?.contains(row) ? Number(row.dataset.idx) : null
  if (idx !== hoveredIdx.value) hoveredIdx.value = idx
}

function schedule() {
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(resolveActiveRow)
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  schedule()
}

function onDocLeave() {
  mouseX = -1
  mouseY = -1
  hoveredIdx.value = null
}

let lenisRef = null

onMounted(() => {
  canHover.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!canHover.value) pinnedIdx.value = 0 // touch: first row open

  if (canHover.value) {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onDocLeave)
    // re-resolve under the motionless cursor on every scroll tick
    lenisRef = getLenis()
    if (lenisRef) lenisRef.on('scroll', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
  }

  reveal(sectionEl.value.querySelectorAll('.js-head'), { stagger: 0.08 })

  // thewatch-style entrance: rows surface one after another from under a
  // bottom mask (clip-path inset → 0), expensive-feeling and smooth
  if (!reducedMotion.value) {
    const rows = listEl.value.querySelectorAll('.scope-row')
    gsap.fromTo(
      rows,
      { clipPath: 'inset(100% 0 0 0)', y: 44 },
      {
        clipPath: 'inset(0% 0 0 0)',
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: listEl.value, start: 'top 82%', once: true },
        clearProps: 'clipPath,transform'
      }
    )
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.documentElement.removeEventListener('mouseleave', onDocLeave)
  window.removeEventListener('scroll', schedule)
  if (lenisRef) lenisRef.off('scroll', schedule)
})
</script>

<template>
  <section id="scope" ref="sectionEl" class="section section-scope">
    <div class="container">
      <SectionTitle class="section-scope__title js-head reveal" :text="t('scope.title')" />

      <ul ref="listEl" class="section-scope__list">
        <li
          v-for="(item, i) in items"
          :key="i"
          class="scope-row"
          :class="{ 'is-active': isOpen(i) }"
          :data-idx="i"
        >
          <button
            :id="`scope-${i}-button`"
            type="button"
            class="scope-row__trigger"
            :aria-expanded="isOpen(i) ? 'true' : 'false'"
            :aria-controls="`scope-${i}-desc`"
            @click="toggle(i)"
          >
            <span class="scope-row__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="scope-row__name">{{ item.title }}</span>
            <span :id="`scope-${i}-desc`" class="scope-row__desc">{{ item.desc }}</span>
            <span class="scope-row__plus" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-scope {
  &__title {
    margin-top: $spacing-4;
  }

  &__list {
    margin-top: $spacing-9;
    border-bottom: 1px solid var(--color-border);
  }
}

.scope-row {
  border-top: 1px solid var(--color-border);

  &__trigger {
    display: grid;
    grid-template-columns: 3ch minmax(0, 1fr) minmax(0, 1.15fr) auto;
    align-items: center;
    gap: $spacing-7;
    width: 100%;
    min-height: 104px;
    padding: $spacing-5 0;
    text-align: left;
    color: var(--color-text);
    @include focus-visible;
  }

  // number on the left, vertically centered on the title's axis
  &__num {
    @include mono-caption;
    transition: color 250ms ease;
  }

  &__name {
    font-size: $fs-h3;
    letter-spacing: $ls-h3;
    line-height: $lh-h3;

    @include respond(md) {
      font-size: $fs-h3-m;
    }
  }

  // the description lives in the CENTER of the row, hidden until active
  &__desc {
    font-size: $fs-small;
    line-height: 1.5;
    color: var(--color-text-secondary);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 250ms ease, transform 250ms ease;
  }

  // “+” on the right → “×” when active
  &__plus {
    display: inline-flex;
    color: var(--color-text-muted);
    transition: transform 250ms ease, color 250ms ease;
  }

  &.is-active {
    .scope-row__num {
      color: var(--color-accent);
    }

    .scope-row__desc {
      opacity: 1;
      transform: translateY(0);
    }

    .scope-row__plus {
      transform: rotate(45deg);
      color: var(--color-text);
    }
  }

  @include respond(md) {
    &__trigger {
      grid-template-columns: 3ch minmax(0, 1fr) auto;
      grid-template-areas:
        'num name plus'
        'num desc desc';
      min-height: 0;
      row-gap: 0;
    }

    &__num {
      grid-area: num;
      align-self: center;
    }

    &__name {
      grid-area: name;
    }

    // on touch the description expands under the title instead of the centre
    &__desc {
      grid-area: desc;
      display: none;
      padding-top: $spacing-3;
    }

    &.is-active &__desc {
      display: block;
    }

    &__plus {
      grid-area: plus;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__num,
    &__desc,
    &__plus {
      transition: none;
    }
  }
}
</style>
