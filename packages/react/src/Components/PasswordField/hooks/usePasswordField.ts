// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useCallback, useMemo, useState } from "react";

// ** Local Imports
import { useFormField } from "@/Components/FormField/hooks/useFormField";
import type {
  PasswordFieldClasses,
  PasswordFieldProps,
} from "@/Components/PasswordField/passwordField.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

/**
 * Composes `PasswordField` form chrome, input bind, registry classes, and visibility logic.
 */
export function usePasswordField(props: PasswordFieldProps) {
  const { slots, visible, classes, onVisibilityChange, ...formFieldProps } =
    props;

  const { entry } = useBridgeUIComponent<
    Pick<PasswordFieldProps, "classes">,
    "PasswordField"
  >({
    props: { classes },
    componentName: "PasswordField",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<PasswordFieldClasses>({
    entry,
    props: { classes },
  });

  const [internalVisible, setInternalVisible] = useState(false);

  const isControlled = !isNil(visible);

  const isVisible = useMemo(() => {
    if (isControlled) {
      return Boolean(visible);
    }

    return internalVisible;
  }, [isControlled, internalVisible, visible]);

  const inputType = isVisible ? "text" : "password";

  const formField = useFormField(
    {
      ...formFieldProps,
      slots,
      withErrorIcon: false,
      classes: mergedClasses,
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

  const inputBind = derived(() => {
    return mergePartBind(
      formField.inputBind,
      {
        type: inputType,
      },
      "",
    );
  });

  const toggleVisibility = useCallback(() => {
    const next = !isVisible;

    if (!isControlled) {
      setInternalVisible(next);
    }

    onVisibilityChange?.(next);
  }, [isControlled, isVisible, onVisibilityChange]);

  return {
    formField,
    inputBind,
    isVisible,
    mergedClasses,
    toggleVisibility,
  };
}
