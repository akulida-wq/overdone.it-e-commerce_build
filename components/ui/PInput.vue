<script setup>
// Text input styled like the main-site form (DESIGN §4): transparent bg,
// bottom border only, visible label above, white border on focus, error color
// + message under the field when invalid. Hint shows when there is no error.
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  inputId: { type: String, required: true },
  type: { type: String, default: 'text' },
  required: { type: Boolean, default: false },
  error: { type: String, default: null },
  hint: { type: String, default: null },
  autocomplete: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const describedBy = computed(() => {
  if (props.error) return `${props.inputId}-error`
  if (props.hint) return `${props.inputId}-hint`
  return null
})
</script>

<template>
  <div class="p-input" :class="{ 'has-error': !!error }">
    <label class="p-input__label" :for="inputId">
      {{ label }}<span v-if="required" class="p-input__req" aria-hidden="true"> *</span>
    </label>
    <input
      :id="inputId"
      class="p-input__field"
      :type="type"
      :value="modelValue"
      :required="required || null"
      :aria-invalid="error ? 'true' : null"
      :aria-describedby="describedBy"
      :autocomplete="autocomplete"
      @input="emit('update:modelValue', $event.target.value)"
      @blur="emit('blur')"
    />
    <p v-if="error" :id="`${inputId}-error`" class="p-input__error">{{ error }}</p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="p-input__hint">{{ hint }}</p>
  </div>
</template>

<style lang="scss" scoped>
.p-input {
  &__label {
    display: block;
    font-size: $fs-small;
    color: var(--color-text-muted);
    margin-bottom: $spacing-1;
  }

  &__req {
    color: var(--color-accent);
  }

  &__field {
    display: block;
    width: 100%;
    min-height: 44px;
    padding: $spacing-2 0;
    background: transparent;
    border: none;
    // dashed underline like the production Get in Touch form
    border-bottom: 1px dashed var(--color-border-strong);
    border-radius: 0;
    color: var(--color-text);
    transition: border-color 200ms ease;

    &:focus {
      outline: none;
      border-bottom-style: solid;
      border-bottom-color: var(--color-text);
    }

    // keep browser autofill from painting the field light
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px var(--color-surface) inset;
      -webkit-text-fill-color: var(--color-text);
      caret-color: var(--color-text);
      transition: background-color 99999s ease-in-out 0s;
    }
  }

  &.has-error &__field {
    border-bottom-color: var(--color-error);
  }

  &__error {
    margin-top: $spacing-1;
    font-size: 12px;
    color: var(--color-error);
  }

  &__hint {
    margin-top: $spacing-1;
    font-size: 12px;
    color: var(--color-text-muted);
  }

  @media (prefers-reduced-motion: reduce) {
    &__field {
      transition: none;
    }
  }
}
</style>
