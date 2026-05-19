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
import type { AlertOwnProps, AlertProps } from "@/Components/Alert/alert.types";
import {
  mergeBridgeUILayeredClasses,
  mergeBridgeUIStringMap,
  mergePartBind,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const alertBridgeKeys = [
  "icon",
  "color",
  "title",
  "shadow",
  "classes",
  "padding",
  "rounded",
  "variant",
  "partsProps",
] as const satisfies readonly (keyof AlertOwnProps)[];

const defaultIcons: Record<keyof AlertColor, LucideIcon> = {
  dark: Info,
  primary: Bell,
  error: CircleX,
  secondary: Info,
  info: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
};

export function useAlert(
  props: AlertProps,
  libDefaults: Partial<AlertOwnProps>,
) {
  // Setup
  const { className, children, slots, propsForMerge, rootHtmlProps } =
    splitComponentProps(props, {
      bridgeKeys: alertBridgeKeys,
      peel: ["className", "children", "slots"],
    });

  const { entry: bridgeAlert, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Alert",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAlert,
    props: propsForMerge,
  });

  // Registry maps
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

  // Theme
  const colorKey = (merged.color ?? "primary") as keyof AlertColor;

  const variantKey = (merged.variant ?? "flat") as keyof typeof variantProps;

  const palette = get(mergedVariantProps, [variantKey, colorKey]);

  const resolvedIcon = useMemo(() => {
    if (isNull(merged.icon)) {
      return null;
    }

    return merged.icon ?? get(defaultIcons, colorKey);
  }, [colorKey, merged.icon]);

  // Visibility
  const hasDefaultBody = Boolean(children);

  const showIcon = Boolean(slots?.icon) || resolvedIcon != null;

  const showTitleRow =
    !slots?.header &&
    Boolean(merged.title || resolvedIcon != null || slots?.icon);

  // Root
  const rootClasses = cn(
    "w-full flex flex-col p-4",
    palette.border,
    palette.background,
    get(mergedShadowMap, merged.shadow ?? "none"),
    get(mergedRoundedMap, merged.rounded ?? "none"),
    get(mergedClasses, "root"),
    className,
  );

  // Parts
  const partsProps = merged.partsProps;

  const iconBind = mergePartBind(
    partsProps?.icon,
    cn("w-5 h-5 shrink-0", palette.iconColor, get(mergedClasses, "icon")),
  );

  const titleBind = mergePartBind(
    partsProps?.title,
    cn(
      "text-start text-sm whitespace-normal",
      hasDefaultBody ? "font-semibold" : "font-normal",
      palette.text,
      get(mergedClasses, "title"),
    ),
  );

  const bodyBind = mergePartBind(
    partsProps?.body,
    cn(
      "grow text-sm text-start",
      palette.text,
      get(mergedPaddingMap, merged.padding ?? "none"),
      get(mergedClasses, "body"),
    ),
  );

  return {
    slots,
    merged,
    bodyBind,
    children,
    iconBind,
    showIcon,
    titleBind,
    rootClasses,
    resolvedIcon,
    showTitleRow,
    rootHtmlProps,
    hasDefaultBody,
  };
}
