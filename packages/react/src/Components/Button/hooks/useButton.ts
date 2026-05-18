// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

// ** Core Imports
import type { ButtonColorItem } from "@bridge-ui/core";
import {
  cn,
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core";
import {
  sizeProps as buttonSizeProps,
  roundedProps,
  variantProps,
} from "@bridge-ui/core/Components/Button";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonProps,
} from "@/Components/Button/button.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";

export type UseButtonOptions = {
  slots?: ButtonProps["slots"];
};

export function useButton(
  propsForMerge: Omit<ButtonProps, "children" | "slots">,
  libDefaults: Partial<ButtonProps>,
  options: UseButtonOptions,
) {
  const bridge = useBridgeUI();

  const components = bridge?.components ?? null;

  const bridgeButton = components?.Button;

  const merged = useMemo(() => {
    return mergePropsWithBridgeUIDefaults({
      props: propsForMerge as object,
      libDefaults,
      componentName: "Button",
      components,
    }) as Omit<ButtonProps, "children" | "slots">;
  }, [
    components,
    libDefaults,
    bridgeButton,
    propsForMerge.as,
    propsForMerge.full,
    propsForMerge.href,
    propsForMerge.size,
    propsForMerge.color,
    propsForMerge.classes,
    propsForMerge.endIcon,
    propsForMerge.loading,
    propsForMerge.rounded,
    propsForMerge.variant,
    propsForMerge.disabled,
    propsForMerge.startIcon,
  ]);

  const mergedClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      bridgeButton?.classes as Partial<ButtonClasses> | undefined,
      propsForMerge.classes,
    );
  }, [bridgeButton?.classes, propsForMerge.classes]);

  const mergedVariantMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton?.customProps?.variant,
    );
  }, [bridgeButton?.customProps?.variant]);

  const sizeClassMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      buttonSizeProps,
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
    get(roundedClassMap, merged.rounded ?? "sm"),
    get(sizeClassMap, merged.size ?? "md"),
    get(mergedClasses, "root"),
    merged.full && "w-full",
    colorClasses,
  );

  const slots = options.slots;

  const showSpinner = merged.loading;

  const showEndIcon = !merged.loading && !!merged.endIcon;

  const showStartIcon = !merged.loading && !!merged.startIcon;

  const showEndSlot = !merged.loading && !merged.endIcon && slots?.end != null;

  const showStartSlot =
    !merged.loading && !merged.startIcon && slots?.start != null;

  const endIconClass = cn("shrink-0", get(mergedClasses, "endIcon"));

  const startIconClass = cn("shrink-0", get(mergedClasses, "startIcon"));

  const spinnerIconClass = cn(
    "shrink-0 animate-spin",
    get(mergedClasses, "loading"),
  );

  return {
    tag,
    merged,
    isAnchor,
    isButton,
    rootClass,
    isDisabled,
    showEndIcon,
    showEndSlot,
    showSpinner,
    showStartIcon,
    showStartSlot,
    endIconClass,
    startIconClass,
    spinnerIconClass,
    spinnerIcon: Loader2,
  };
}
