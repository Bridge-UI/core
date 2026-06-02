// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  roundedProps,
  sizeProps,
} from "@bridge-ui/core/Components/Toggle";

// ** Local Imports
import { useSwitcher } from "@/Components/Switcher";
import type {
  ToggleClasses,
  ToggleOwnProps,
  ToggleProps,
} from "@/Components/Toggle/toggle.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const toggleBridgeKeys = [
  "size",
  "color",
  "classes",
  "checked",
  "rounded",
  "partsProps",
] as const satisfies readonly (keyof ToggleOwnProps)[];

type ToggleLibDefaults = LibDefaultsShape<
  ToggleOwnProps,
  "size" | "color" | "rounded"
>;

type ToggleMerged = MergeLibDefaults<ToggleOwnProps, ToggleLibDefaults>;

export function useToggle(props: ToggleProps, libDefaults: ToggleLibDefaults) {
  // Setup
  const switcher = useSwitcher(props, {
    error: false,
    withoutErrorMessage: false,
    withValidationColors: true,
    size: libDefaults.size ?? "sm",
  });

  const { customProps, inheritedAttrs } = splitComponentProps<
    ToggleProps,
    typeof toggleBridgeKeys
  >({
    props,
    bridgeKeys: toggleBridgeKeys,
  });

  const { entry: bridgeToggle, merged } = useBridgeUIComponent<
    ToggleMerged,
    "Toggle"
  >({
    libDefaults,
    props: customProps,
    componentName: "Toggle",
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "slots",
      "children",
      "className",
      "defaultChecked",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ToggleClasses>({
    props: customProps,
    entry: bridgeToggle,
  });

  // Elements
  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => {
    return Boolean(inheritedAttrs.defaultChecked);
  });

  const isControlled = derived(() => {
    return customProps.checked !== undefined;
  });

  const checked = derived(() => {
    if (isControlled) {
      return Boolean(merged.checked);
    }

    return uncontrolledChecked;
  });

  const invalidated = derived(() => {
    return switcher.invalidated;
  });

  const withValidationColors = derived(() => {
    return switcher.withValidationColors;
  });

  const colorKey = derived(() => {
    if (withValidationColors && invalidated) {
      return "error";
    }

    return merged.color;
  });

  // Classes
  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeToggle?.customProps?.size,
    );

    return get(classes, merged.size ?? "sm");
  }, [merged.size, bridgeToggle?.customProps?.size]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeToggle?.customProps?.color,
    );

    return get(classes, colorKey);
  }, [colorKey, bridgeToggle?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeToggle?.customProps?.rounded,
    );

    return get(classes, merged.rounded ?? "full");
  }, [merged.rounded, bridgeToggle?.customProps?.rounded]);

  // Handlers
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }

    inputInheritedAttrs.onChange?.(event);
  };

  // Binds
  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...partsProps?.input,
        ...switcher.controlBind,
        type: "checkbox",
        role: "switch",
        checked,
        onChange: handleChange,
      },
      inputInheritedAttrs,
      cn({
        "sr-only": true,
        [mergedClasses.input ?? ""]: true,
      }),
    );
  });

  const trackBind = derived(() => {
    return mergePartBind(
      partsProps?.track,
      { "aria-hidden": true },
      cn({
        "block cursor-pointer transition ease-in-out duration-100": true,
        [sizeClasses?.track ?? ""]: true,
        [roundedClasses ?? ""]: true,
        [colorClasses?.track ?? ""]: !checked,
        [colorClasses?.trackChecked ?? ""]: checked,
        [mergedClasses.track ?? ""]: true,
      }),
    );
  });

  const thumbBind = derived(() => {
    return mergePartBind(
      partsProps?.thumb,
      { "aria-hidden": true },
      cn({
        "pointer-events-none absolute start-0.5 top-1/2 -translate-y-1/2 rounded-full shadow-sm transition ease-in-out duration-200": true,
        [sizeClasses?.thumb ?? ""]: true,
        [sizeClasses?.thumbCheckedTranslate ?? ""]: checked,
        [colorClasses?.thumb ?? ""]: true,
        [mergedClasses.thumb ?? ""]: true,
      }),
    );
  });

  const fieldBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "relative inline-flex shrink-0 select-none": true,
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2": true,
        [roundedClasses ?? ""]: true,
        [colorClasses?.focus ?? ""]: true,
      }),
    );
  });

  return {
    switcher,
    checked,
    inputBind,
    thumbBind,
    trackBind,
    fieldBind,
  };
}
