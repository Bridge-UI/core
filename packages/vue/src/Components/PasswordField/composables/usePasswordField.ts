// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed, ref, toRef, useAttrs } from "vue";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  PasswordFieldClasses,
  PasswordFieldOwnProps,
} from "@/Components/PasswordField/passwordField.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export type UsePasswordFieldOptions = {
  onVisibilityChange?: (visible: boolean) => void;
};

/**
 * Composes `PasswordField` form chrome, input bind, registry classes, and visibility logic.
 */
export function usePasswordField(
  props: PasswordFieldOwnProps,
  options: UsePasswordFieldOptions = {},
) {
  const attrs = useAttrs();
  const internalVisible = ref(false);
  const visible = toRef(props, "visible");

  const isControlled = computed(() => !isNil(visible.value));

  const isVisible = computed(() => {
    if (isControlled.value) {
      return Boolean(visible.value);
    }

    return internalVisible.value;
  });

  const inputType = computed(() => (isVisible.value ? "text" : "password"));

  const { entry } = useBridgeUIComponent<
    Pick<PasswordFieldOwnProps, "classes">,
    "PasswordField"
  >({
    componentName: "PasswordField",
    props: () => ({ classes: props.classes }),
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<PasswordFieldClasses>({
    entry,
    props: () => ({ classes: props.classes }),
  });

  const formField = useFormField(
    () => {
      const { visible: _visible, classes: _classes, ...rest } = props;

      return {
        ...attrs,
        ...rest,
        withErrorIcon: false,
        classes: mergedClasses.value,
      };
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: false,
    },
    {
      reservedSlots: () => ["end"],
    },
  );

  const inputBind = computed(() => {
    return mergePartBind(
      formField.inputBind.value,
      {
        type: inputType.value,
      },
      "",
    );
  });

  const toggleVisibility = () => {
    const next = !isVisible.value;

    if (!isControlled.value) {
      internalVisible.value = next;
    }

    options.onVisibilityChange?.(next);
  };

  return {
    formField,
    inputBind,
    isVisible,
    mergedClasses,
    toggleVisibility,
  };
}
