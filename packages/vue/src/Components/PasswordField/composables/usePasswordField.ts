// ** External Imports
import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";

export type UsePasswordFieldOptions = {
  visible?: MaybeRefOrGetter<boolean | null | undefined>;
  onVisibilityChange?: (visible: boolean) => void;
};

export function usePasswordField(options: UsePasswordFieldOptions = {}) {
  const internalVisible = ref(false);

  const visibleProp = computed(() => toValue(options.visible));

  const isControlled = computed(() => {
    return visibleProp.value !== undefined && visibleProp.value !== null;
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
