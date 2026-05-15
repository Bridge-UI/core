// ** External Imports
import { get, isNull } from "es-toolkit/compat";
import type { LucideIcon } from "lucide-vue-next";
import {
  Bell,
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-vue-next";
import { computed, useSlots } from "vue";

// ** Core Imports
import { cn, type Direction } from "@bridge-ui/core";
import {
  paddingProps,
  roundedProps,
  shadowProps,
  variantProps,
  type AlertColor,
} from "@bridge-ui/core/Components/Alert";

// ** Local Imports
import type { AlertProps } from "@/Components/Alert/alert.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";
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
  const slots = useSlots();

  const bridge = useBridgeUI();

  const direction = computed((): Direction => {
    return bridge?.global.value.direction ?? "ltr";
  });

  const { entry: bridgeAlert, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Alert",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props,
    entry: bridgeAlert,
  });

  const mergedShadowMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: shadowProps,
      provider: bridgeAlert.value?.customProps?.shadow,
    });
  });

  const mergedPaddingMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: paddingProps,
      provider: bridgeAlert.value?.customProps?.padding,
    });
  });

  const mergedRoundedMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
      provider: bridgeAlert.value?.customProps?.rounded,
    });
  });

  const mergedVariantProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeAlert.value?.customProps?.variant,
    ) as typeof variantProps;
  });

  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof AlertColor;
  });

  const variantKey = computed(() => {
    return (merged.value.variant ?? "flat") as keyof typeof variantProps;
  });

  const resolvedIcon = computed(() => {
    if (isNull(merged.value.icon)) {
      return null;
    }

    return merged.value.icon ?? get(defaultIcons, colorKey.value);
  });

  const showIcon = computed(() => {
    return Boolean(slots.icon) || resolvedIcon.value != null;
  });

  const palette = computed(() => {
    return get(mergedVariantProps.value, [variantKey.value, colorKey.value]);
  });

  const hasDefaultBody = computed(() => {
    const d = slots.default?.();

    return Boolean(d && d.length > 0);
  });

  const showTitleRow = computed(() => {
    return (
      !slots.header &&
      Boolean(merged.value.title || resolvedIcon.value != null || slots.icon)
    );
  });

  const iconClasses = computed(() => {
    return cn(
      "w-5 h-5 shrink-0",
      palette.value.iconColor,
      get(mergedClasses.value, "icon"),
    );
  });

  const titleClasses = computed(() => {
    return cn(
      palette.value.text,
      get(mergedClasses.value, "title"),
      "text-start text-sm whitespace-normal",
      hasDefaultBody.value ? "font-semibold" : "font-normal",
    );
  });

  const bodyClasses = computed(() => {
    return cn(
      palette.value.text,
      "grow text-sm text-start",
      get(mergedClasses.value, "body"),
      get(mergedPaddingMap.value, merged.value.padding ?? "none"),
    );
  });

  const rootClasses = computed(() => {
    return cn(
      palette.value.border,
      palette.value.background,
      "w-full flex flex-col p-4",
      get(mergedClasses.value, "root"),
      get(mergedShadowMap.value, merged.value.shadow ?? "none"),
      get(mergedRoundedMap.value, merged.value.rounded ?? "none"),
    );
  });

  return {
    slots,
    merged,
    palette,
    showIcon,
    direction,
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
