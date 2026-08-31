<script setup>
// R2.8 Projects, trionn reference (photo r2-s13): large cover cards, the
// image scales inside its frame on hover (1 → 1.06, 600ms), name + arrow-link
// under the cover. Card 1 (Paparazzi, og-cover) leads to the case page,
// card 2 («Your product could be next», generated cover) leads to #contact.
// Entrance: rise with a slight rotate per card. Adding a partner = adding an
// object to the array below.
const { t } = useLang()
const { gsap, scrollTo, reveal, reducedMotion } = useScrollMotion()

const partners = [
  {
    id: 'paparazzi',
    name: 'Paparazzi',
    descKey: 'projects.paparazzi_desc',
    url: 'https://paparazzi.shop',
    caseUrl: '/projects/paparazzi',
    cover: '/img/partners/paparazzi-og.webp',
    coverAlt: 'Paparazzi'
  }
]

const sectionEl = ref(null)
const listEl = ref(null)

function openCase(partner) {
  navigateTo(partner.caseUrl)
}

function goToContact() {
  scrollTo('#contact')
}

onMounted(() => {
  reveal(sectionEl.value.querySelectorAll('.js-head'), { stagger: 0.08 })

  // rise with a slight rotate; cards have no .reveal class — the tween's
  // inline from-values (immediateRender) handle the pre-hide
  if (reducedMotion.value) return
  // no pre-trigger rotate on mobile: the tilted card's corners widen the
  // page's scroll area past the viewport (same trap as the compare spread)
  const tilt = window.matchMedia('(max-width: 768px)').matches ? 0 : 1.6
  listEl.value.querySelectorAll('.tri-card').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 64, rotation: i % 2 === 0 ? tilt : -tilt, autoAlpha: 0 },
      {
        y: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        clearProps: 'transform'
      }
    )
  })
})
</script>

<template>
  <section id="projects" ref="sectionEl" class="section section-projects">
    <div class="container">
      <SectionTitle class="section-projects__title js-head reveal" :text="t('projects.title')" />

      <div ref="listEl" class="section-projects__list">
        <!-- Partner cards -->
        <article
          v-for="partner in partners"
          :key="partner.id"
          class="tri-card"
          @click="openCase(partner)"
        >
          <div class="tri-card__frame">
            <img
              class="tri-card__cover"
              :src="partner.cover"
              :alt="partner.coverAlt"
              width="1200"
              height="630"
              loading="lazy"
            />
          </div>
          <div class="tri-card__meta">
            <div class="tri-card__info">
              <h3 class="tri-card__name">{{ partner.name }}</h3>
              <p class="tri-card__desc text-secondary">{{ t(partner.descKey) }}</p>
            </div>
            <div class="tri-card__links">
              <NuxtLink class="tri-card__link" :to="partner.caseUrl" @click.stop>
                <span>{{ t('projects.case') }}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </NuxtLink>
              <a
                class="tri-card__visit"
                :href="partner.url"
                target="_blank"
                rel="noopener"
                @click.stop
              >{{ t('projects.visit') }}</a>
            </div>
          </div>
        </article>

        <!-- «Your product could be next» -->
        <article class="tri-card tri-card--next" @click="goToContact">
          <div class="tri-card__frame">
            <img
              class="tri-card__cover"
              src="/img/partners/next-project.webp"
              alt=""
              width="1200"
              height="630"
              loading="lazy"
            />
          </div>
          <div class="tri-card__meta">
            <div class="tri-card__info">
              <h3 class="tri-card__name">{{ t('projects.next_title') }}</h3>
            </div>
            <div class="tri-card__links">
              <button type="button" class="tri-card__link" @click.stop="goToContact">
                <span>{{ t('cta.discuss') }}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-projects {
  &__title {
    margin-top: $spacing-4;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $spacing-8;
    margin-top: $spacing-10;

    @include respond(lg) {
      grid-template-columns: 1fr;
      gap: $spacing-9;
    }
  }
}

.tri-card {
  cursor: pointer;

  // cover scales INSIDE the rounded frame (trionn hover)
  &__frame {
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;
    aspect-ratio: 1200 / 630;
    background: var(--color-surface);
  }

  &__cover {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    // ≈ power2.out
    transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover &__cover,
  &:focus-within &__cover {
    transform: scale(1.06);
  }

  &__meta {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $spacing-6;
    margin-top: $spacing-5;
  }

  &__name {
    font-size: $fs-h3-m;
    letter-spacing: $ls-h3;
    transition: color 250ms ease;
  }

  &:hover &__name {
    color: var(--color-accent);
  }

  &__desc {
    margin-top: $spacing-1;
    font-size: $fs-small;
  }

  &__links {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-2;
    flex-shrink: 0;
    padding-top: $spacing-1;
  }

  // trionn-style mono link with the arrow sliding on hover
  &__link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    padding-bottom: 2px;
    border-bottom: 1px solid var(--color-border-strong);
    font-family: $font-mono;
    font-size: $fs-mono;
    letter-spacing: $ls-mono;
    color: var(--color-text);
    transition: border-color 250ms ease;
    @include focus-visible;

    svg {
      transition: transform 250ms ease;
    }

    &:hover {
      border-color: var(--color-accent);

      svg {
        transform: translateX(4px);
        color: var(--color-accent);
      }
    }
  }

  &__visit {
    font-family: $font-mono;
    font-size: $fs-mono;
    letter-spacing: $ls-mono;
    color: var(--color-text-secondary);
    transition: color 250ms ease;
    @include focus-visible;

    &:hover {
      color: var(--color-text);
    }
  }

  @include respond(md) {
    &__meta {
      flex-direction: column;
      gap: $spacing-4;
    }

    &__links {
      align-items: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__cover,
    &__name,
    &__link,
    &__link svg,
    &__visit {
      transition: none;
    }

    &:hover .tri-card__cover {
      transform: none;
    }
  }
}
</style>
