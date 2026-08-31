<script setup>
// §13 FAQ: 7 questions on PAccordionItem, at most one open (opening another
// closes the previous), all closed initially.
const { t } = useLang()
const { reveal } = useScrollMotion()

const items = computed(() => t('faq.items'))

const sectionEl = ref(null)
const openIdx = ref(null)

function toggle(i) {
  openIdx.value = openIdx.value === i ? null : i
}

onMounted(() => {
  reveal(sectionEl.value.querySelectorAll('.js-head'), { stagger: 0.08 })
  reveal(sectionEl.value.querySelectorAll('.p-accordion'), {
    stagger: 0.06,
    trigger: sectionEl.value.querySelector('.section-faq__list')
  })
})
</script>

<template>
  <section id="faq" ref="sectionEl" class="section section-faq">
    <div class="container section-faq__inner">
      <SectionTitle class="section-faq__title js-head reveal" :text="t('faq.title')" />

      <div class="section-faq__list">
        <PAccordionItem
          v-for="(item, i) in items"
          :key="i"
          :item-id="`faq-${i}`"
          :open="openIdx === i"
          class="reveal"
          @toggle="toggle(i)"
        >
          <template #title>{{ item.q }}</template>
          <p v-for="(para, j) in item.a.split('\n\n')" :key="j" class="section-faq__para">
            {{ para }}
          </p>
        </PAccordionItem>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section-faq {
  &__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start; // R1: всё по левому краю
  }

  &__title {
    margin-top: $spacing-4;
  }

  // R2.6: full-width glass plashki with a 12–16px gap between them
  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    width: 100%;
    margin-top: $spacing-9;
    text-align: left;
  }

  &__para {
    & + & {
      margin-top: $spacing-3;
    }
  }
}
</style>
