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

  const colorItem = get(mergedVariantProps, [
    merged.variant ?? (isMini ? "flat" : "solid"),
    merged.color ?? "primary",
  ]) as ButtonColorItem | undefined;

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
    isMini
      ? "inline-flex shrink-0 items-center justify-center cursor-pointer outline-none outline-hidden"
      : "cursor-pointer outline-none outline-hidden inline-flex justify-center items-center group hover:shadow-xs",
    "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
    "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
    "transition-all ease-in-out duration-200 focus:ring-2",
    "disabled:opacity-80 disabled:cursor-not-allowed",
    colorClasses,
    get(roundedClassMap, merged.rounded ?? "md"),
    sizeClass,
    !isMini && merged.full && "w-full",
    mergedClasses.root,
    className,
  );

  // Visibility
  const showSpinner = merged.loading;

  const showText = !isMini && !merged.loading && !!merged.text;

  const showEndIcon = !isMini && !merged.loading && !!merged.endIcon;

  const showStartIcon = !isMini && !merged.loading && !!merged.startIcon;

  const showChildren =
    !isMini && !merged.loading && hasChildren && !merged.text;

  const showEndSlot =
    !isMini && !merged.loading && !merged.endIcon && slots?.end != null;

  // prettier-ignore
  const showStartSlot = !isMini && !merged.loading && !merged.startIcon && slots?.start != null;

  const showIcon = isMini && !merged.loading && Boolean(merged.icon);

  const showDefault = isMini && !merged.loading && hasChildren && !merged.icon;

  // Parts
  const partsProps = merged.partsProps;

  const endIconBind = mergePartBind(
    partsProps?.endIcon,
    cn("shrink-0", mergedClasses.endIcon),
  );

  const startIconBind = mergePartBind(
    partsProps?.startIcon,
    cn("shrink-0", mergedClasses.startIcon),
  );

  const iconBind = mergePartBind(
    partsProps?.icon,
    cn("shrink-0", mergedClasses.icon),
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
    merged,
    children,
    isMini,
    isAnchor,
    isButton,
    iconSize,
    showText,
    rootClass,
    iconBind,
    isDisabled,
    showIcon,
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
