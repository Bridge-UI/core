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
  invalidatedProps,
  roundedProps,
  sizeProps,
} from "@bridge-ui/core/Components/Radio";

// ** Local Imports
import { useFormControl } from "@/Components/FormControl/hooks/useFormControl";
import type {
  RadioClasses,
  RadioOwnProps,
  RadioProps,
} from "@/Components/Radio/radio.types";
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
  "customProps",
  "defaultChecked",
] as const satisfies readonly (keyof RadioProps)[];

type RadioLibDefaults = LibDefaultsShape<
  RadioOwnProps,
  "size" | "color" | "rounded"
>;

type RadioMerged = MergeLibDefaults<RadioOwnProps, RadioLibDefaults>;

export function useRadio(props: RadioProps, libDefaults: RadioLibDefaults) {
  const formControl = useFormControl(props, {
    error: false,
    withoutErrorMessage: false,
    size: libDefaults.size ?? "sm",
  });

  const { componentProps } = splitComponentProps<
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
    props: componentProps,
    componentName: "Radio",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(formControl.inputInheritedAttrs, [
      "color",
      "value",
      "checked",
      "rounded",
      "defaultChecked",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<RadioClasses>({
    entry: bridgeRadio,
    props: componentProps,
  });

  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => {
    return Boolean(componentProps.defaultChecked);
  });

  const isControlled = derived(() => {
    return !isNil(componentProps.checked);
  });

  const checked = derived(() => {
    if (isControlled) {
      return Boolean(merged.checked);
    }

    return uncontrolledChecked;
  });

  const colorPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeRadio?.customProps?.color,
    );

    return get(classes, merged.color ?? "primary");
  }, [merged.color, bridgeRadio?.customProps?.color]);

  const invalidatedPalette = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeRadio?.customProps?.invalidated,
    );
  }, [bridgeRadio?.customProps?.invalidated]);

  const colorClasses = derived(() => {
    return formControl.invalidated ? invalidatedPalette : colorPalette;
  });

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeRadio?.customProps?.size,
    );

    return get(classes, merged.size ?? "sm");
  }, [merged.size, bridgeRadio?.customProps?.size]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeRadio?.customProps?.rounded,
    );

    return get(classes, merged.rounded ?? "full");
  }, [merged.rounded, bridgeRadio?.customProps?.rounded]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }

    inputInheritedAttrs.onChange?.(event);
  };

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...customProps?.input,
        ...formControl.controlBind,
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
      customProps?.control,
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
      customProps?.dot,
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
    fieldBind,
    inputBind,
    formControl,
    controlBind,
  };
}
