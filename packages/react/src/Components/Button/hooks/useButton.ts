// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  roundedProps,
  sizeProps,
  variantProps,
  type ButtonColorItem,
} from "@bridge-ui/core/Components/Button";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonOwnProps,
  ButtonProps,
} from "@/Components/Button/button.types";
import {
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export function useButton(
  props: ButtonProps,
  libDefaults: Partial<ButtonOwnProps>,
) {
  const {
    as,
    full,
    href,
    size,
    text,
    color,
    slots,
    classes,
    endIcon,
    loading,
    rounded,
    variant,
    children,
    disabled,
    className,
    startIcon,
    ...rootHtmlProps
  } = props;

  const propsForMerge = {
    as,
    full,
    href,
    size,
    text,
    color,
    classes,
    endIcon,
    loading,
    rounded,
    variant,
    disabled,
    startIcon,
  };

  const { entry: bridgeButton, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Button",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>({
    entry: bridgeButton,
    props: propsForMerge,
  });

  const mergedVariantMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton?.customProps?.variant,
    );
  }, [bridgeButton?.customProps?.variant]);

  const sizeClassMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeButton?.customProps?.size,
    );
  }, [bridgeButton?.customProps?.size]);

  const roundedClassMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton?.customProps?.rounded,
    );
  }, [bridgeButton?.customProps?.rounded]);

  const colorItem = get(mergedVariantMap, [
    merged.variant ?? "solid",
    merged.color ?? "primary",
  ]) as ButtonColorItem | undefined;

  const colorClasses = cn(colorItem?.base, colorItem?.hover, colorItem?.focus);

  const tag = merged.as ?? "button";

  const isButton = tag === "button";

  const isAnchor = tag === "a";

  const isDisabled = merged.disabled || merged.loading;

  const rootClass = cn(
    "cursor-pointer outline-none outline-hidden inline-flex justify-center items-center group hover:shadow-xs",
    "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
    "transition-all ease-in-out duration-200 focus:ring-2",
    "disabled:opacity-80 disabled:cursor-not-allowed",
    colorClasses,
    get(roundedClassMap, merged.rounded ?? "sm"),
    get(sizeClassMap, merged.size ?? "md"),
    merged.full && "w-full",
    mergedClasses.root,
    className,
  );

  const showSpinner = merged.loading;

  const showText = !merged.loading && !!merged.text;

  const showEndIcon = !merged.loading && !!merged.endIcon;

  const hasChildren = children != null && children !== false;

  const showStartIcon = !merged.loading && !!merged.startIcon;

  const showChildren = !merged.loading && hasChildren && !merged.text;

  const showEndSlot = !merged.loading && !merged.endIcon && slots?.end != null;

  const showStartSlot =
    !merged.loading && !merged.startIcon && slots?.start != null;

  const endIconClass = cn("shrink-0", mergedClasses.endIcon);

  const startIconClass = cn("shrink-0", mergedClasses.startIcon);

  const spinnerIconClass = cn("shrink-0 animate-spin", mergedClasses.loading);

  return {
    tag,
    slots,
    merged,
    children,
    isAnchor,
    isButton,
    showText,
    rootClass,
    isDisabled,
    showEndIcon,
    showEndSlot,
    showSpinner,
    bridgeButton,
    endIconClass,
    showChildren,
    rootHtmlProps,
    showStartIcon,
    showStartSlot,
    startIconClass,
    spinnerIconClass,
    spinnerIcon: Loader2,
  };
}
