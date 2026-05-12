// ** External Imports
import clsx from "clsx";
import { get } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { twMerge } from "tailwind-merge";
import { computed, useSlots } from "vue";

// ** Local Imports
import type { AlertProps } from "@/Components/Alert/alert.types";
import type { AlertColor } from "@/Components/Alert/props";
import { paddingProps } from "@/Components/Alert/props/Padding";
import { roundedProps } from "@/Components/Alert/props/Rounded";
import { shadowProps } from "@/Components/Alert/props/Shadow";
import { variantProps } from "@/Components/Alert/props/Variant";
import {
  mergeBridgeUIStringMap,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

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

  const hasIconProp = computed(() => {
    return merged.value.icon != null;
  });

  const showIcon = computed(() => {
    return Boolean(slots.icon) || hasIconProp.value;
  });

  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof AlertColor;
  });

  const variantKey = computed(() => {
    return (merged.value.variant ?? "flat") as keyof typeof variantProps;
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
      Boolean(merged.value.title || hasIconProp.value || slots.icon)
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
    hasIconProp,
    iconClasses,
    rootClasses,
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
