// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { Check } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

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
} from "@bridge-ui/core/Components/Checkbox";

// ** Local Imports
import type {
  CheckboxClasses,
  CheckboxOwnProps,
  CheckboxProps,
} from "@/Components/Checkbox/checkbox.types";
import { useSwitcher } from "@/Components/Switcher";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const checkboxBridgeKeys = [
  "size",
  "color",
  "classes",
  "checked",
  "rounded",
  "partsProps",
  "indeterminate",
] as const satisfies readonly (keyof CheckboxOwnProps)[];

type CheckboxLibDefaults = LibDefaultsShape<
  CheckboxOwnProps,
  "size" | "color" | "rounded"
>;

type CheckboxMerged = MergeLibDefaults<CheckboxOwnProps, CheckboxLibDefaults>;

export function useCheckbox(
  props: CheckboxProps,
  libDefaults: CheckboxLibDefaults,
) {
  // Setup
  const switcher = useSwitcher(props, {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const { customProps, inheritedAttrs } = splitComponentProps<
    CheckboxProps,
    typeof checkboxBridgeKeys
  >({
    props,
    bridgeKeys: checkboxBridgeKeys,
  });

  const { merged, entry: bridgeCheckbox } = useBridgeUIComponent<
    CheckboxMerged,
    "Checkbox"
  >({
    libDefaults,
    props: customProps,
    componentName: "Checkbox",
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

  const mergedClasses = useBridgeUIMergedRegistryClasses<CheckboxClasses>({
    props: customProps,
    entry: bridgeCheckbox,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Elements
  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => {
    return Boolean(inheritedAttrs.defaultChecked);
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
      bridgeCheckbox?.customProps?.size,
    );

    return get(classes, merged.size ?? "sm");
  }, [merged.size, bridgeCheckbox?.customProps?.size]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeCheckbox?.customProps?.color,
    );

    return get(classes, colorKey);
  }, [colorKey, bridgeCheckbox?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCheckbox?.customProps?.rounded,
    );

    return get(classes, merged.rounded ?? "sm");
  }, [merged.rounded, bridgeCheckbox?.customProps?.rounded]);

  // Handlers
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(merged.indeterminate);
    }
  }, [merged.indeterminate, checked]);

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
        ref: inputRef,
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

  const controlBind = derived(() => {
    return mergePartBind(
      partsProps?.control,
      {
        "aria-hidden": true,
      },
      cn({
        "inline-flex shrink-0 items-center justify-center border shadow-sm transition ease-in-out duration-100": true,
        "pointer-events-none": true,
        [sizeClasses ?? ""]: true,
        [roundedClasses ?? ""]: true,
        [colorClasses?.base ?? ""]: !checked,
        [colorClasses?.checked ?? ""]: checked,
        "focus-visible:outline-none": true,
        [mergedClasses.control ?? ""]: true,
      }),
    );
  });

  const iconBind = derived(() => {
    return mergePartBind(
      partsProps?.icon,
      {},
      cn({
        "text-white": true,
        [mergedClasses.icon ?? ""]: true,
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
        [colorClasses?.focus ?? ""]: true,
      }),
    );
  });

  return {
    checked,
    iconBind,
    switcher,
    fieldBind,
    inputBind,
    controlBind,
    CheckIcon: Check,
  };
}
