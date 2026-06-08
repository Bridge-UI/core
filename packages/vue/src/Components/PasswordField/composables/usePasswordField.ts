import { isNil } from "es-toolkit/compat";
import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";

export type UsePasswordFieldOptions = {
  onVisibilityChange?: (visible: boolean) => void;
  visible?: MaybeRefOrGetter<boolean | null | undefined>;
};

export function usePasswordField(options: UsePasswordFieldOptions = {}) {
  const internalVisible = ref(false);

  const visibleProp = computed(() => toValue(options.visible));

  const isControlled = computed(() => {
    return !isNil(visibleProp.value);
  });

  const isVisible = computed(() => {
    if (isControlled.value) {
      return Boolean(visibleProp.value);
    }

    return internalVisible.value;
  });

  const toggleVisibility = () => {
    const next = !isVisible.value;

    if (!isControlled.value) {
      internalVisible.value = next;
    }

    options.onVisibilityChange?.(next);
  };

  return {
    isVisible,
    toggleVisibility,
  };
}
