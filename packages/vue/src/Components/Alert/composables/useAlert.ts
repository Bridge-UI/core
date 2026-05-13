// ** External Imports
import clsx from "clsx";
import { get, isNull } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import type { LucideIcon } from "lucide-vue-next";
import {
  Bell,
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-vue-next";
import { twMerge } from "tailwind-merge";
import { computed, useSlots } from "vue";

// ** Core Imports
import type { AlertColor } from "@bridge-ui/core";
import { paddingProps } from "@core/Components/Alert/Padding";
import { roundedProps } from "@core/Components/Alert/Rounded";
import { shadowProps } from "@core/Components/Alert/Shadow";
import { variantProps } from "@core/Components/Alert/Variant";

// ** Local Imports
import type { AlertProps } from "@/Components/Alert/alert.types";
import {
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

export function useAlert(props: AlertProps, defaults: Partial<AlertProps>) {
  const slots = useSlots();

  const { entry: bridgeAlert, merged } = useBridgeUIComponent(
    "Alert",
    props,
    defaults,
  );

  const mergedClasses = useBridgeUIMergedRegistryClasses(bridgeAlert, props);

  const mergedShadowMap = computed(() => {
    return mergeBridgeUIStringMap(
      shadowProps,
      bridgeAlert.value?.customProps?.shadow,
    );
  });

  const mergedPaddingMap = computed(() => {
    return mergeBridgeUIStringMap(
      paddingProps,
      bridgeAlert.value?.customProps?.padding,
    );
  });

  const mergedRoundedMap = computed(() => {
    return mergeBridgeUIStringMap(
      roundedProps,
      bridgeAlert.value?.customProps?.rounded,
    );
  });

  const mergedVariantProps = computed(() => {
    return toMerged(
      toMerged(
        {} as Record<PropertyKey, unknown>,
        variantProps as unknown as Record<PropertyKey, unknown>,
      ),
      (bridgeAlert.value?.customProps?.variant ?? {}) as Record<
        PropertyKey,
        unknown
      >,
    ) as unknown as typeof variantProps;
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

    return merged.value.icon ?? defaultIcons[colorKey.value];
  });

  const showIcon = computed(() => {
    return Boolean(slots.icon) || resolvedIcon.value != null;
  });

  const palette = computed(() => {
    return mergedVariantProps.value[variantKey.value][colorKey.value];
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
    return twMerge(
      clsx(
        palette.value.iconColor,
        "w-5 h-5 mr-3 shrink-0",
        get(mergedClasses.value, "icon"),
      ),
    );
  });

  const titleClasses = computed(() => {
    return twMerge(
      clsx(
        palette.value.text,
        "text-sm whitespace-normal",
        get(mergedClasses.value, "title"),
        hasDefaultBody.value ? "font-semibold" : "font-normal",
      ),
    );
  });

  const bodyClasses = computed(() => {
    return twMerge(
      clsx(
        "grow text-sm",
        palette.value.text,
        get(mergedClasses.value, "body"),
        get(mergedPaddingMap.value, merged.value.padding ?? "none"),
      ),
    );
  });

  const rootClasses = computed(() => {
    return twMerge(
      clsx(
        palette.value.border,
        palette.value.background,
        "w-full flex flex-col p-4",
        get(mergedClasses.value, "root"),
        get(mergedShadowMap.value, merged.value.shadow ?? "none"),
        get(mergedRoundedMap.value, merged.value.rounded ?? "none"),
      ),
    );
  });

  return {
    slots,
    merged,
    palette,
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
