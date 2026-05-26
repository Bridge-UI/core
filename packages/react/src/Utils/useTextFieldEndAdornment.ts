// ** External Imports
import { useMemo } from "react";

// ** Core Imports
import type { LibDefaultsShape } from "@bridge-ui/core";

// ** Local Imports
import type { TextFieldOwnProps } from "@/Components/TextField/textField.types";
import { useBridgeUIComponent } from "@/Utils";
import {
  resolveEndAdornmentButtonClasses,
  resolveEndAdornmentClasses,
  resolveEndAdornmentShellClasses,
} from "@/Utils/resolveEndAdornmentClasses";

type EndAdornmentProps = Pick<
  TextFieldOwnProps,
  "color" | "rounded" | "variant" | "error"
>;

type EndAdornmentLibDefaults = LibDefaultsShape<
  EndAdornmentProps,
  "color" | "rounded" | "variant"
>;

/**
 * Hook to resolve the end adornment classes for a text field.
 */
export function useTextFieldEndAdornment(
  props: EndAdornmentProps,
  libDefaults: EndAdornmentLibDefaults,
) {
  const { entry: bridgeTextField, merged } = useBridgeUIComponent<
    EndAdornmentProps,
    "TextField"
  >({
    props,
    libDefaults,
    componentName: "TextField",
  });

  const invalidated = merged.error === true;

  const adornmentOptions = useMemo(
    () => ({
      invalidated,
      bridgeColor: bridgeTextField?.customProps?.color,
      bridgeRounded: bridgeTextField?.customProps?.rounded,
      color: merged.color ?? libDefaults.color ?? "primary",
      rounded: merged.rounded ?? libDefaults.rounded ?? "md",
      variant: merged.variant ?? libDefaults.variant ?? "outline",
    }),
    [
      invalidated,
      merged.color,
      merged.rounded,
      merged.variant,
      libDefaults.color,
      libDefaults.rounded,
      libDefaults.variant,
      bridgeTextField?.customProps?.color,
      bridgeTextField?.customProps?.rounded,
    ],
  );

  const endAdornmentClass = useMemo(() => {
    return resolveEndAdornmentClasses(adornmentOptions);
  }, [adornmentOptions]);

  const endAdornmentShellClass = useMemo(() => {
    return resolveEndAdornmentShellClasses(adornmentOptions);
  }, [adornmentOptions]);

  const endAdornmentButtonClass = useMemo(() => {
    return resolveEndAdornmentButtonClasses();
  }, []);

  return {
    invalidated,
    endAdornmentClass,
    endAdornmentShellClass,
    endAdornmentButtonClass,
  };
}
