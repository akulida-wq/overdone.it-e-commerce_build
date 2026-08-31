<script setup>
// Multi-select chip group: pill toggle buttons with aria-pressed.
// options: [{ value, label }], modelValue: array of selected values.
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  groupId: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])

function toggle(value) {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value]
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="p-chips">
    <p :id="`${groupId}-label`" class="p-chips__label">{{ label }}</p>
    <div class="p-chips__list" role="group" :aria-labelledby="`${groupId}-label`">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="p-chips__chip"
        :class="{ 'is-selected': modelValue.includes(opt.value) }"
        :aria-pressed="modelValue.includes(opt.value) ? 'true' : 'false'"
        @click="toggle(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p-chips {
  &__label {
    font-size: $fs-small;
    color: var(--color-text-muted);
    margin-bottom: $spacing-3;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-2;
  }

  &__chip {
    min-height: 44px; // touch target
    padding: $spacing-2 $spacing-4;
    border: 1px solid var(--color-border-strong);
    border-radius: $radius-pill;
    font-size: $fs-small;
    color: var(--color-text-secondary);
    transition: border-color 200ms ease, color 200ms ease, background-color 200ms ease;
    @include focus-visible;

    &:hover {
      color: var(--color-text);
    }

    &.is-selected {
      background: var(--color-surface);
      border-color: var(--color-text);
      color: var(--color-text);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__chip {
      transition: none;
    }
  }
}
</style>
