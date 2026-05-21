// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  densityProps,
  roundedProps,
  variantProps,
  type ButtonColor,
  type ButtonColorItem,
} from "@bridge-ui/core/Components/Button";
import type { IconSize } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonOwnProps,
  ButtonProps,
} from "@/Components/Button/button.types";
import {
  derived,
  hasNamedSlot,
  mergePartBind,
  splitComponentProps,
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

export function useButton(
  props: ButtonProps,
  libDefaults: Partial<ButtonOwnProps>,
) {
  // Setup
  const { className, children, slots, propsForMerge, rootHtmlProps } =
    splitComponentProps(props, {
      bridgeKeys: buttonBridgeKeys,
      peel: ["className", "children", "slots"],
    });

  const { entry: bridgeButton, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Button",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>({
    entry: bridgeButton,
    props: propsForMerge,
  });

  // Registry maps
  const mergedVariantProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton?.customProps?.variant,
    );
  }, [bridgeButton?.customProps?.variant]);

  const mergedDensityProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      densityProps,
      bridgeButton?.customProps?.density,
    );
  }, [bridgeButton?.customProps?.density]);

  const roundedClassMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton?.customProps?.rounded,
    );
  }, [bridgeButton?.customProps?.rounded]);

  // Theme
  const densityKey = derived(() => {
    return (merged.density ?? "default") as keyof typeof densityProps;
  });

  const sizeKey = derived(() => {
    return merged.size ?? "md";
  });

  const isMini = derived(() => {
    return densityKey === "mini";
  });

  const colorKey = derived(() => {
    return (merged.color ?? "primary") as keyof ButtonColor;
  });

  const variantKey = derived(() => {
    return (propsForMerge.variant ??
      (isMini
        ? "flat"
        : (merged.variant ?? "solid"))) as keyof typeof variantProps;
  });

  const colorItem = derived(() => {
    return get(mergedVariantProps, [variantKey, colorKey]) as
      | ButtonColorItem
      | undefined;
  });

  const colorClasses = derived(() => {
    return cn(colorItem?.base, colorItem?.hover, colorItem?.focus);
  });

  const sizeClass = derived(() => {
    return get(mergedDensityProps, [densityKey, sizeKey]);
  });

  const iconSize = derived(() => {
    return sizeKey as keyof IconSize;
  });

  // Element
  const tag = derived(() => {
    return merged.as ?? "button";
  });

  const isButton = derived(() => {
    return tag === "button";
  });

  const isAnchor = derived(() => {
    return tag === "a";
  });

  const isDisabled = derived(() => {
    return merged.disabled || merged.loading;
  });

  const hasChildren = derived(() => {
    return children != null && children !== false;
  });

  // Root
  const rootClass = derived(() => {
    return cn(
      "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
      "cursor-pointer outline-none outline-hidden inline-flex items-center justify-center",
      "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
      "transition-all ease-in-out duration-200 focus:ring-2",
      "disabled:opacity-80 disabled:cursor-not-allowed",
      { "group hover:shadow-xs": !isMini },
      { "w-full": !isMini && merged.full },
      { "w-fit": !isMini && !merged.full },
      { "shrink-0": isMini },
      colorClasses,
      get(roundedClassMap, merged.rounded ?? "md"),
      sizeClass,
      mergedClasses.root,
      className,
    );
  });

  // Visibility
  const showSpinner = derived(() => {
    return merged.loading;
  });

  const canShowContent = derived(() => {
    return !merged.loading;
  });

  const showIcon = derived(() => {
    return canShowContent && Boolean(merged.icon);
  });

  const showDefault = derived(() => {
    return canShowContent && hasChildren && !merged.icon;
  });

  const showText = derived(() => {
    return canShowContent && !!merged.text;
  });

  const showEndIcon = derived(() => {
    return canShowContent && !!merged.endIcon;
  });

  const showStartIcon = derived(() => {
    return canShowContent && !!merged.startIcon;
  });

  const showChildren = derived(() => {
    return canShowContent && hasChildren && !merged.text;
  });

  const showEndSlot = derived(() => {
    return canShowContent && !merged.endIcon && hasNamedSlot(slots, "end");
  });

  const showStartSlot = derived(() => {
    return canShowContent && !merged.startIcon && hasNamedSlot(slots, "start");
  });

  // Parts
  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const iconBind = derived(() => {
    return mergePartBind(partsProps?.icon, cn("shrink-0", mergedClasses.icon));
  });

  const endIconBind = derived(() => {
    return mergePartBind(
      partsProps?.endIcon,
      cn("shrink-0", mergedClasses.endIcon),
    );
  });

  const startIconBind = derived(() => {
    return mergePartBind(
      partsProps?.startIcon,
      cn("shrink-0", mergedClasses.startIcon),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(partsProps?.end, "inline-flex shrink-0 items-center");
  });

  const startSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      "inline-flex shrink-0 items-center",
    );
  });

  const loadingIconBind = derived(() => {
    return mergePartBind(
      partsProps?.loading,
      cn("shrink-0 animate-spin", mergedClasses.loading),
    );
  });

  return {
    tag,
    slots,
    isMini,
    merged,
    children,
    iconBind,
    iconSize,
    isAnchor,
    isButton,
    showIcon,
    showText,
    rootClass,
    isDisabled,
    endIconBind,
    endSlotBind,
    showDefault,
    showEndIcon,
    showEndSlot,
    showSpinner,
    showChildren,
    rootHtmlProps,
    showStartIcon,
    showStartSlot,
    startIconBind,
    startSlotBind,
    loadingIconBind,
    spinnerIcon: Loader2,
  };
}
