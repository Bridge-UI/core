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
} from "@bridge-ui/core/Components/Radio";

// ** Local Imports
import type {
  RadioClasses,
  RadioOwnProps,
  RadioProps,
} from "@/Components/Radio/radio.types";
import { useSwitcher } from "@/Components/Switcher/hooks/useSwitcher";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const radioBridgeKeys = [
  "size",
  "color",
  "value",
  "classes",
  "checked",
  "rounded",
  "partsProps",
  "defaultChecked",
] as const satisfies readonly (keyof RadioProps)[];

type RadioLibDefaults = LibDefaultsShape<
  RadioOwnProps,
  "size" | "color" | "rounded"
>;

type RadioMerged = MergeLibDefaults<RadioOwnProps, RadioLibDefaults>;

export function useRadio(props: RadioProps, libDefaults: RadioLibDefaults) {
  // Setup
  const switcher = useSwitcher(props, {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const { customProps } = splitComponentProps<
    RadioProps,
    typeof radioBridgeKeys
  >({
    props,
    bridgeKeys: radioBridgeKeys,
  });

  const { merged, entry: bridgeRadio } = useBridgeUIComponent<
    RadioMerged,
    "Radio"
  >({
    libDefaults,
    props: customProps,
    componentName: "Radio",
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(switcher.inputInheritedAttrs, [
      "color",
      "value",
      "checked",
      "rounded",
      "defaultChecked",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RadioClasses>({
    props: customProps,
    entry: bridgeRadio,
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
    if (switcher.invalidated) {
      return "error";
    }

    return merged.color;
  });

  // Classes
  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRadio?.customProps?.size,
    );

    return get(classes, merged.size ?? "sm");
  }, [merged.size, bridgeRadio?.customProps?.size]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeRadio?.customProps?.color,
    );

    return get(classes, colorKey);
  }, [colorKey, bridgeRadio?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeRadio?.customProps?.rounded,
    );

    return get(classes, merged.rounded ?? "full");
  }, [merged.rounded, bridgeRadio?.customProps?.rounded]);

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
        checked,
        type: "radio",
        value: merged.value,
        onChange: handleChange,
      },
      inputInheritedAttrs,
      cn({
        "sr-only": true,
        [mergedClasses.input ?? ""]: true,
      }),
    );
  });

  const controlBind = derived(() => {
    return mergePartBind(
      partsProps?.control,
      { "aria-hidden": true },
      cn({
        "inline-flex shrink-0 items-center justify-center border shadow-sm transition ease-in-out duration-100": true,
        "pointer-events-none": true,
        [sizeClasses ?? ""]: true,
        [roundedClasses ?? ""]: true,
        [colorClasses?.base ?? ""]: !checked,
        [colorClasses?.checked ?? ""]: checked,
        [mergedClasses.control ?? ""]: true,
      }),
    );
  });

  const dotBind = derived(() => {
    return mergePartBind(
      partsProps?.dot,
      {},
      cn({
        "rounded-full bg-white transition-transform duration-100": true,
        "scale-0": !checked,
        "scale-100": checked,
        "h-[42%] w-[42%]": true,
        [mergedClasses.dot ?? ""]: true,
      }),
    );
  });

  const fieldBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "relative inline-flex shrink-0 items-center": true,
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2": true,
        [roundedClasses ?? ""]: true,
        [colorClasses?.focus ?? ""]: true,
      }),
    );
  });

  return {
    checked,
    dotBind,
    switcher,
    fieldBind,
    inputBind,
    controlBind,
  };
}
