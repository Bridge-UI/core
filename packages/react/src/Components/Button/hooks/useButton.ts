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
  const densityKey = (merged.density ?? "default") as keyof typeof densityProps;

  const sizeKey = merged.size ?? "md";

  const isMini = densityKey === "mini";

  const colorKey = (merged.color ?? "primary") as keyof ButtonColor;

  const variantKey = (propsForMerge.variant ??
    (isMini
      ? "flat"
      : (merged.variant ?? "solid"))) as keyof typeof variantProps;

  const colorItem = get(mergedVariantProps, [variantKey, colorKey]) as
    | ButtonColorItem
    | undefined;

  const colorClasses = cn(colorItem?.base, colorItem?.hover, colorItem?.focus);

  const sizeClass = get(mergedDensityProps, [densityKey, sizeKey]);

  const iconSize = sizeKey as keyof IconSize;

  // Element
  const tag = merged.as ?? "button";

  const isButton = tag === "button";

  const isAnchor = tag === "a";

  const isDisabled = merged.disabled || merged.loading;

  const hasChildren = children != null && children !== false;

  // Root
  const rootClass = cn(
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

  // Visibility
  const showSpinner = merged.loading;

  const canShowContent = !merged.loading;

  const showIcon = canShowContent && Boolean(merged.icon);

  const showDefault = canShowContent && hasChildren && !merged.icon;

  const showText = canShowContent && !!merged.text;

  const showEndIcon = canShowContent && !!merged.endIcon;

  const showStartIcon = canShowContent && !!merged.startIcon;

  const showChildren = canShowContent && hasChildren && !merged.text;

  const showEndSlot = canShowContent && !merged.endIcon && slots?.end != null;

  const showStartSlot =
    canShowContent && !merged.startIcon && slots?.start != null;

  // Parts
  const partsProps = merged.partsProps;

  const iconBind = mergePartBind(
    partsProps?.icon,
    cn("shrink-0", mergedClasses.icon),
  );

  const endIconBind = mergePartBind(
    partsProps?.endIcon,
    cn("shrink-0", mergedClasses.endIcon),
  );

  const startIconBind = mergePartBind(
    partsProps?.startIcon,
    cn("shrink-0", mergedClasses.startIcon),
  );

  const endSlotBind = mergePartBind(
    partsProps?.end,
    "inline-flex shrink-0 items-center",
  );

  const startSlotBind = mergePartBind(
    partsProps?.start,
    "inline-flex shrink-0 items-center",
  );

  const loadingIconBind = mergePartBind(
    partsProps?.loading,
    cn("shrink-0 animate-spin", mergedClasses.loading),
  );

  return {
    tag,
    slots,
    isMini,
    merged,
    children,
    iconSize,
    iconBind,
    isAnchor,
    isButton,
    showText,
    showIcon,
    rootClass,
    isDisabled,
    endIconBind,
    endSlotBind,
    showEndIcon,
    showDefault,
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
