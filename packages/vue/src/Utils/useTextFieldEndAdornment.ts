// ** External Imports
import { computed, toValue, type MaybeRefOrGetter } from "vue";

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
 * Build the end adornment options.
 */
function buildEndAdornmentOptions(
  merged: EndAdornmentProps,
  libDefaults: EndAdornmentLibDefaults,
  invalidated: boolean,
  bridgeFormField: {
    value?: { customProps?: { color?: object; rounded?: object } };
  },
) {
  return {
    invalidated,
    color: merged.color ?? libDefaults.color ?? "primary",
    bridgeColor: bridgeFormField.value?.customProps?.color,
    rounded: merged.rounded ?? libDefaults.rounded ?? "md",
    bridgeRounded: bridgeFormField.value?.customProps?.rounded,
    variant: merged.variant ?? libDefaults.variant ?? "outline",
  };
}

/**
 * Hook to resolve the end adornment classes for a text field.
 */
export function useTextFieldEndAdornment(
  props: MaybeRefOrGetter<EndAdornmentProps>,
  libDefaults: EndAdornmentLibDefaults,
) {
  const { entry: bridgeFormField, merged } = useBridgeUIComponent<
    EndAdornmentProps,
    "FormField"
  >({
    libDefaults,
    componentName: "FormField",
    props: () => toValue(props),
  });

  const invalidated = computed(() => {
    return merged.value.error === true;
  });

  const adornmentOptions = computed(() => {
    return buildEndAdornmentOptions(
      merged.value,
      libDefaults,
      invalidated.value,
      bridgeFormField,
    );
  });

  const endAdornmentClass = computed(() => {
    return resolveEndAdornmentClasses(adornmentOptions.value);
  });

  const endAdornmentShellClass = computed(() => {
    return resolveEndAdornmentShellClasses(adornmentOptions.value);
  });

  const endAdornmentButtonClass = computed(() => {
    return resolveEndAdornmentButtonClasses();
  });

  return {
    invalidated,
    endAdornmentClass,
    endAdornmentShellClass,
    endAdornmentButtonClass,
  };
}
