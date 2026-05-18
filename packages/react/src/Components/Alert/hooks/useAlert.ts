// ** External Imports
import { get, isNull } from "es-toolkit/compat";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-react";
import { useMemo } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import {
  paddingProps,
  roundedProps,
  shadowProps,
  variantProps,
  type AlertColor,
} from "@bridge-ui/core/Components/Alert";

// ** Local Imports
import type { AlertProps } from "@/Components/Alert/alert.types";
import {
  mergeBridgeUILayeredClasses,
  mergeBridgeUIStringMap,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const defaultIcons: Record<keyof AlertColor, LucideIcon> = {
  dark: Info,
  primary: Bell,
  error: CircleX,
  secondary: Info,
  info: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
};

export function useAlert(props: AlertProps, libDefaults: Partial<AlertProps>) {
  const { children, slots, ...propsForMerge } = props;

  const { entry: bridgeAlert, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Alert",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAlert,
    props: propsForMerge,
  });

  const mergedShadowMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: shadowProps,
      provider: bridgeAlert?.customProps?.shadow,
    });
  }, [bridgeAlert?.customProps?.shadow]);

  const mergedPaddingMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: paddingProps,
      provider: bridgeAlert?.customProps?.padding,
    });
  }, [bridgeAlert?.customProps?.padding]);

  const mergedRoundedMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
      provider: bridgeAlert?.customProps?.rounded,
    });
  }, [bridgeAlert?.customProps?.rounded]);

  const mergedVariantProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeAlert?.customProps?.variant,
    ) as typeof variantProps;
  }, [bridgeAlert?.customProps?.variant]);

  const colorKey = (merged.color ?? "primary") as keyof AlertColor;

  const variantKey = (merged.variant ?? "flat") as keyof typeof variantProps;

  const resolvedIcon = useMemo(() => {
    if (isNull(merged.icon)) {
      return null;
    }

    return merged.icon ?? get(defaultIcons, colorKey);
  }, [colorKey, merged.icon]);

  const hasDefaultBody = Boolean(children);

  const showIcon = Boolean(slots?.icon) || resolvedIcon != null;

  const palette = get(mergedVariantProps, [variantKey, colorKey]);

  const showTitleRow =
    !slots?.header &&
    Boolean(merged.title || resolvedIcon != null || slots?.icon);

  const iconClasses = cn(
    "w-5 h-5 shrink-0",
    palette.iconColor,
    get(mergedClasses, "icon"),
  );

  const titleClasses = cn(
    palette.text,
    get(mergedClasses, "title"),
    "text-start text-sm whitespace-normal",
    hasDefaultBody ? "font-semibold" : "font-normal",
  );

  const bodyClasses = cn(
    palette.text,
    "grow text-sm text-start",
    get(mergedClasses, "body"),
    get(mergedPaddingMap, merged.padding ?? "none"),
  );

  const rootClasses = cn(
    palette.border,
    palette.background,
    "w-full flex flex-col p-4",
    get(mergedClasses, "root"),
    get(mergedShadowMap, merged.shadow ?? "none"),
    get(mergedRoundedMap, merged.rounded ?? "none"),
  );

  return {
    slots,
    merged,
    palette,
    children,
    showIcon,
    bodyClasses,
    bridgeAlert,
    iconClasses,
    rootClasses,
    resolvedIcon,
    showTitleRow,
    titleClasses,
    mergedClasses,
    hasDefaultBody,
    mergedShadowMap,
    mergedPaddingMap,
    mergedRoundedMap,
    mergedVariantProps,
  };
}
