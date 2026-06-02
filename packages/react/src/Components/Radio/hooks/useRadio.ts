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
import { colorProps, sizeProps } from "@bridge-ui/core/Components/Radio";

// ** Local Imports
import type {
  RadioClasses,
  RadioOwnProps,
  RadioProps,
} from "@/Components/Radio/radio.types";
import { useSwitcher } from "@/Components/Switcher";
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
  "partsProps",
] as const satisfies readonly (keyof RadioOwnProps)[];

type RadioLibDefaults = LibDefaultsShape<RadioOwnProps, "size" | "color">;

type RadioMerged = MergeLibDefaults<RadioOwnProps, RadioLibDefaults>;

export function useRadio(props: RadioProps, libDefaults: RadioLibDefaults) {
  const switcher = useSwitcher(props, {
    size: libDefaults.size ?? "sm",
    withValidationColors: true,
    errorless: false,
    withoutErrorMessage: false,
  });

  const { customProps, inheritedAttrs } = splitComponentProps<
    RadioProps,
    typeof radioBridgeKeys
  >({
    props,
    bridgeKeys: radioBridgeKeys,
  });

  const { entry: bridgeRadio, merged } = useBridgeUIComponent<
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
    return omit(inheritedAttrs, [
      "slots",
      "children",
      "className",
      "defaultChecked",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RadioClasses>({
    props: customProps,
    entry: bridgeRadio,
  });

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }

    inputInheritedAttrs.onChange?.(event);
  };

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...partsProps?.input,
        ...switcher.controlBind,
        type: "radio",
        checked,
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
        "inline-flex shrink-0 items-center justify-center rounded-full border shadow-sm transition ease-in-out duration-100": true,
        "pointer-events-none": true,
        [sizeClasses ?? ""]: true,
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
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 rounded-full": true,
        [colorClasses?.focus ?? ""]: true,
      }),
    );
  });

  return {
    switcher,
    checked,
    inputBind,
    dotBind,
    controlBind,
    fieldBind,
  };
}
