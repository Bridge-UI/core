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
import { useFormControl } from "@/Components/FormControl/hooks/useFormControl";
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
  "defaultChecked",
] as const satisfies readonly (keyof CheckboxProps)[];

type CheckboxLibDefaults = LibDefaultsShape<
  CheckboxOwnProps,
  "size" | "color" | "rounded"
>;

type CheckboxMerged = MergeLibDefaults<CheckboxOwnProps, CheckboxLibDefaults>;

export function useCheckbox(
  props: CheckboxProps,
  libDefaults: CheckboxLibDefaults,
) {
  const formControl = useFormControl(props, {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const { customProps } = splitComponentProps<
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
    return omit(formControl.inputInheritedAttrs, [
      "color",
      "checked",
      "rounded",
      "indeterminate",
      "defaultChecked",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CheckboxClasses>({
    props: customProps,
    entry: bridgeCheckbox,
  });

  const inputRef = useRef<HTMLInputElement>(null);

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

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...partsProps?.input,
        ...formControl.controlBind,
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
    fieldBind,
    inputBind,
    formControl,
    controlBind,
    CheckIcon: Check,
  };
}
