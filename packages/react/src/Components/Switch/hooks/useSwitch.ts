// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
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
} from "@bridge-ui/core/Components/Switch";

// ** Local Imports
import { useFormControl } from "@/Components/FormControl/hooks/useFormControl";
import type {
  SwitchClasses,
  SwitchOwnProps,
  SwitchProps,
} from "@/Components/Switch/switch.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const switchBridgeKeys = [
  "size",
  "color",
  "classes",
  "checked",
  "rounded",
  "partsProps",
  "defaultChecked",
] as const satisfies readonly (keyof SwitchProps)[];

type SwitchLibDefaults = LibDefaultsShape<
  SwitchOwnProps,
  "size" | "color" | "rounded"
>;

type SwitchMerged = MergeLibDefaults<SwitchOwnProps, SwitchLibDefaults>;

export function useSwitch(props: SwitchProps, libDefaults: SwitchLibDefaults) {
  // Setup
  const formControl = useFormControl(props, {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const { customProps } = splitComponentProps<
    SwitchProps,
    typeof switchBridgeKeys
  >({
    props,
    bridgeKeys: switchBridgeKeys,
  });

  const { merged, entry: bridgeSwitch } = useBridgeUIComponent<
    SwitchMerged,
    "Switch"
  >({
    libDefaults,
    props: customProps,
    componentName: "Switch",
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(formControl.inputInheritedAttrs, [
      "color",
      "checked",
      "rounded",
      "defaultChecked",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SwitchClasses>({
    props: customProps,
    entry: bridgeSwitch,
  });

  // Elements
  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => {
    return Boolean(customProps.defaultChecked);
  });

  const isControlled = derived(() => {
    return !isNil(customProps.checked);
  });

  const checked = derived(() => {
    if (isControlled) {
      return Boolean(merged.checked);
    }

    return uncontrolledChecked;
  });

  const colorKey = derived(() => {
    if (formControl.invalidated) {
      return "error";
    }

    return merged.color;
  });

  // Classes
  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeSwitch?.customProps?.size,
    );

    return get(classes, merged.size ?? "sm");
  }, [merged.size, bridgeSwitch?.customProps?.size]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeSwitch?.customProps?.color,
    );

    return get(classes, colorKey);
  }, [colorKey, bridgeSwitch?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeSwitch?.customProps?.rounded,
    );

    return get(classes, merged.rounded ?? "full");
  }, [merged.rounded, bridgeSwitch?.customProps?.rounded]);

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
        ...formControl.controlBind,
        checked,
        role: "switch",
        type: "checkbox",
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
    checked,
    inputBind,
    thumbBind,
    trackBind,
    fieldBind,
    formControl,
  };
}
