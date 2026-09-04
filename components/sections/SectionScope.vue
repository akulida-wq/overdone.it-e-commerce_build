<script setup>
// V2 S7 «What we handle» — P8 hover model. The active row follows the cursor
// even when the page scrolls UNDER a motionless mouse: the last pointer
// position is stored and document.elementFromPoint() re-resolves the row on
// every mousemove AND every Lenis scroll tick (rAF-throttled) — CSS :hover
// can't do that. Touch keeps tap-to-toggle. Row visuals per the mockup hover
// state: soft fill, red index, white name/description, plus → cross.
const { t } = useLang()
const { sectionReveal, getLenis, reducedMotion } = useScrollMotion()

const titles = computed(() => t('v2.scope_titles'))
const items = computed(() => t('scope.items'))

const rootEl = ref(null)
const listEl = ref(null)
const canHover = ref(false)
const hoveredIdx = ref(null)
const pinnedIdx = ref(null)

function isActive(i) {
  return pinnedIdx.value === i || (canHover.value && hoveredIdx.value === i)
}

function toggle(i) {
  if (canHover.value) return
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
let mqWide = null

// R7: the hover model is DESKTOP-only — on ≤1024 (and any touch device) the
// list is a FAQ-style accordion with the first row open, so the user sees
// the rows expand (фото 20); opening another row closes the previous one
function applyMode() {
  canHover.value =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches && mqWide.matches
  if (!canHover.value && pinnedIdx.value === null) pinnedIdx.value = 0
}

onMounted(() => {
  sectionReveal(rootEl.value)

  mqWide = window.matchMedia('(min-width: 1025px)')
  applyMode()
  mqWide.addEventListener('change', applyMode)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onDocLeave)
  // re-resolve under the motionless cursor on every scroll tick
  lenisRef = getLenis()
  if (lenisRef) lenisRef.on('scroll', schedule)
  window.addEventListener('scroll', schedule, { passive: true })
})

onBeforeUnmount(() => {
  mqWide?.removeEventListener('change', applyMode)
  window.removeEventListener('mousemove', onMouseMove)
  document.documentElement.removeEventListener('mouseleave', onDocLeave)
  window.removeEventListener('scroll', schedule)
  if (lenisRef) lenisRef.off('scroll', schedule)
})
</script>

<template>
  <section id="scope" ref="rootEl" class="section-scope">
    <div class="container">
      <SectionTitle class="section-scope__title v2-mask" :text="t('scope.title')" />

      <ul ref="listEl" class="section-scope__list">
        <li
          v-for="(title, i) in titles"
          :key="i"
          class="scope-row v2-reveal"
          :class="{ 'is-active': isActive(i) }"
          :data-idx="i"
          :role="canHover ? undefined : 'button'"
          :tabindex="canHover ? undefined : 0"
          :aria-expanded="canHover ? undefined : (isActive(i) ? 'true' : 'false')"
          @click="toggle(i)"
          @keydown.enter.prevent="toggle(i)"
        >
          <span class="scope-row__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="scope-row__name">{{ title }}</p>
          <p class="scope-row__desc"><span class="scope-row__desc-in">{{ items[i]?.desc }}</span></p>
          <span class="scope-row__plus" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-scope {
  padding-block: var(--rhythm-half); // R3.0.C unified rhythm

  &__title {
    font-size: $fs-h2;
    letter-spacing: $ls-h2;
    line-height: 1;
  }

  &__list {
    margin-top: $spacing-11;
    border-bottom: 1px solid var(--color-border-table);
  }
}

.scope-row {
  display: flex;
  align-items: center;
  gap: $spacing-7;
  padding: $spacing-7;
  border-top: 1px solid var(--color-border-table);
  // R5: symmetric ease-in-out both ways
  transition: background-color 400ms cubic-bezier(0.45, 0, 0.55, 1);

  // red index — slides open on the active row (mockup hover state).
  // R8 (фото 28): width/opacity animate instead of display toggling, so the
  // row content glides right and back smoothly; the negative margin cancels
  // the flex gap while the index is collapsed
  &__num {
    display: block;
    width: 0;
    margin-right: -$spacing-7;
    opacity: 0;
    overflow: hidden;
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: 1;
    color: var(--color-accent);
    flex-shrink: 0;
    transition:
      width 400ms cubic-bezier(0.45, 0, 0.55, 1),
      margin-right 400ms cubic-bezier(0.45, 0, 0.55, 1),
      opacity 400ms cubic-bezier(0.45, 0, 0.55, 1);
  }

  &__name {
    width: calc(520px * var(--k));
    font-size: $fs-h3;
    letter-spacing: $ls-h3;
    line-height: 1;
    color: var(--color-text-muted);
    transition: color 400ms cubic-bezier(0.45, 0, 0.55, 1);
    flex-shrink: 0;
  }

  &__desc {
    width: calc(400px * var(--k));
    font-size: $fs-body-lg;
    letter-spacing: $ls-body-lg;
    line-height: normal;
    color: transparent;
    transition: color 400ms cubic-bezier(0.45, 0, 0.55, 1);
    flex-shrink: 0;
  }

  &__plus {
    display: inline-flex;
    margin-left: auto;
    color: var(--color-text);
    transition: transform 400ms cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.is-active {
    background: rgba(255, 255, 255, 0.07);

    .scope-row__num {
      width: 32px;
      margin-right: 0;
      opacity: 1;
    }

    .scope-row__name {
      color: var(--color-text);
    }

    .scope-row__desc {
      color: var(--color-text);
    }

    .scope-row__plus {
      transform: rotate(45deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    .scope-row__name,
    .scope-row__desc,
    .scope-row__plus {
      transition: none;
    }
  }
}

// R7 (фото 20): ≤1024 the rows are a FAQ-style accordion — the description
// collapses via the 0fr→1fr grid track (smooth height, no max-height hacks)
@include respond(lg) {
  .scope-row {
    flex-wrap: wrap;
    gap: $spacing-2 $spacing-5;
    padding: $spacing-6 $spacing-5;
    cursor: pointer;
    @include focus-visible;

    &__num {
      margin-right: -$spacing-5; // cancels this block's smaller flex gap
    }

    &__name {
      width: auto;
      flex: 1;
      min-width: 0;
      font-size: $fs-h3-m;
    }

    &__desc {
      order: 4;
      width: 100%;
      display: grid;
      grid-template-rows: 0fr;
      margin-top: 0;
      color: var(--color-text-muted);
      transition:
        grid-template-rows 400ms cubic-bezier(0.45, 0, 0.55, 1),
        margin-top 400ms cubic-bezier(0.45, 0, 0.55, 1),
        color 400ms cubic-bezier(0.45, 0, 0.55, 1);
    }

    &__desc-in {
      min-height: 0;
      overflow: hidden;
    }

    &.is-active .scope-row__desc {
      grid-template-rows: 1fr;
      margin-top: $spacing-2;
    }

    @media (prefers-reduced-motion: reduce) {
      &__desc {
        transition: none;
      }
    }
  }
}

@include respond(md) {
  // R29 (фото 6): the air under the accordion outweighed the rest — trim the
  // section's own bottom pad on phones (the next section's pad remains)
  .section-scope {
    padding-bottom: $spacing-2;
  }

  .scope-row {
    padding: $spacing-6 $spacing-4;

    // R16 (фото 4): width only on the OPEN row — a blanket width kept the
    // collapsed index 28px wide and pushed every closed title 28px right
    &.is-active .scope-row__num {
      width: 28px;
    }

    &__name {
      font-size: $fs-h3-m;
    }

    &__desc {
      font-size: $fs-body;
    }
  }
}


@include respond(md) {
  .section-scope__title {
    font-size: $fs-h2-m;
  }
}
</style>
