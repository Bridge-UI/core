// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  densityProps,
  roundedProps,
  variantProps,
} from "@bridge-ui/core/Components/Button";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonOwnProps,
  ButtonProps,
} from "@/Components/Button/button.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonBridgeKeys = [
  "as",
  "full",
  "href",
  "icon",
  "size",
  "text",
  "color",
  "classes",
  "density",
  "endIcon",
  "loading",
  "rounded",
  "variant",
  "disabled",
  "startIcon",
  "partsProps",
] as const satisfies readonly (keyof ButtonOwnProps)[];

type ButtonLibDefaults = LibDefaultsShape<
  ButtonOwnProps,
  "as" | "color" | "density" | "rounded" | "size" | "variant"
>;

type ButtonMerged = MergeLibDefaults<ButtonOwnProps, ButtonLibDefaults>;

export function useButton(props: ButtonProps, libDefaults: ButtonLibDefaults) {
  const { customProps, inheritedAttrs } = splitComponentProps<
    ButtonProps,
    typeof buttonBridgeKeys
  >({
    props,
    bridgeKeys: buttonBridgeKeys,
  });

  const { merged, entry: bridgeButton } = useBridgeUIComponent<
    ButtonMerged,
    "Button"
  >({
    libDefaults,
    props: customProps,
    componentName: "Button",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>({
    props: customProps,
    entry: bridgeButton,
  });

  const tag = derived(() => {
    return merged.as ?? "button";
  });

  const isAnchor = derived(() => {
    return tag === "a";
  });

  const isButton = derived(() => {
    return tag === "button";
  });

  const isMini = derived(() => {
    return merged.density === "mini";
  });

  const isDisabled = derived(() => {
    return merged.disabled || merged.loading;
  });

  const rootType = derived(() => {
    return isButton ? ("button" as const) : undefined;
  });

  const rootDisabled = derived(() => {
    return isButton ? isDisabled : undefined;
  });

  const rootAriaBusy = derived(() => {
    return merged.loading ? true : undefined;
  });

  const rootAriaDisabled = derived(() => {
    return isDisabled && !isButton ? true : undefined;
  });

  const rootHref = derived(() => {
    if (!isAnchor || isDisabled || !merged.href) {
      return undefined;
    }

    return merged.href;
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeButton?.customProps?.density,
    );

    return get(classes, [merged.density, merged.size]);
  }, [merged.size, merged.density, bridgeButton?.customProps?.density]);

  const variantKey = useMemo(() => {
    if (!isNil(customProps.variant)) {
      return customProps.variant;
    }

    return isMini ? "flat" : merged.variant;
  }, [isMini, merged.variant, customProps.variant]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton?.customProps?.variant,
    );

    return get(classes, [variantKey, merged.color]);
  }, [variantKey, merged.color, bridgeButton?.customProps?.variant]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeButton?.customProps?.rounded]);

  const iconBind = derived(() => {
    return mergePartBind(
      partsProps?.icon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.icon ?? ""]: true,
      }),
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      partsProps?.root,
      rootInheritedAttrs,
      cn({
        "inline-flex items-center justify-center": true,
        "cursor-pointer outline-none outline-hidden": true,
        "shrink-0": isMini,
        [sizeClass ?? ""]: true,
        [roundedClass ?? ""]: true,
        "w-full": !isMini && merged.full,
        "w-fit": !isMini && !merged.full,
        "group hover:shadow-xs": !isMini,
        [get(colorClasses, "base") ?? ""]: true,
        [get(colorClasses, "hover") ?? ""]: true,
        [get(colorClasses, "focus") ?? ""]: true,
        "transition-all ease-in-out duration-200": true,
        "focus:ring-2": true,
        "focus:ring-offset-background-white dark:focus:ring-offset-background-dark": true,
        "disabled:opacity-80 disabled:cursor-not-allowed": true,
        "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const endIconBind = derived(() => {
    return mergePartBind(
      partsProps?.endIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.endIcon ?? ""]: true,
      }),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const startIconBind = derived(() => {
    return mergePartBind(
      partsProps?.startIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.startIcon ?? ""]: true,
      }),
    );
  });

  const startSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const loadingIconBind = derived(() => {
    return mergePartBind(
      partsProps?.loading,
      {},
      cn({
        "shrink-0 animate-spin": true,
        [mergedClasses.loading ?? ""]: true,
      }),
    );
  });

  return {
    tag,
    slots,
    isMini,
    merged,
    children,
    iconBind,
    rootBind,
    rootHref,
    rootType,
    endIconBind,
    endSlotBind,
    rootAriaBusy,
    rootDisabled,
    startIconBind,
    startSlotBind,
    loadingIconBind,
    rootAriaDisabled,
  };
}
