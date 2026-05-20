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
import { computed, useAttrs, useSlots } from "vue";

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
  hasNamedSlot,
  hasSlotOrProp,
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
  const slots = useSlots();
  const attrs = useAttrs();

  const { userClass, propsForMerge, rootBind } = splitComponentProps(
    props,
    attrs,
    { bridgeKeys: alertBridgeKeys },
  );

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

  // Theme
  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof AlertColor;
  });

  const variantKey = computed(() => {
    return (merged.value.variant ?? "flat") as keyof typeof variantProps;
  });

  const palette = computed(() => {
    return get(mergedVariantProps.value, [variantKey.value, colorKey.value]);
  });

  const resolvedIcon = computed(() => {
    if (isNull(merged.value.icon)) {
      return null;
    }

    return merged.value.icon ?? get(defaultIcons, colorKey.value);
  });

  // Visibility
  const hasDefaultBody = computed(() => {
    const d = slots.default?.();

    return Boolean(d && d.length > 0);
  });

  const showIcon = computed(() => {
    return hasNamedSlot(slots, "icon") || resolvedIcon.value != null;
  });

  // prettier-ignore
  const showTitleRow = computed(() => {
    return (
      !showHeaderSlot.value &&
      (hasSlotOrProp(slots, "title", merged.value.title) || resolvedIcon.value != null || showIconSlot.value)
    );
  });

  // Root
  const rootClasses = computed(() => {
    return cn(
      "w-full flex flex-col p-4",
      palette.value.border,
      palette.value.background,
      get(mergedShadowMap.value, merged.value.shadow ?? "none"),
      get(mergedRoundedMap.value, merged.value.rounded ?? "none"),
      get(mergedClasses.value, "root"),
      userClass,
    );
  });

  // Parts
  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const showIconSlot = computed(() => {
    return hasNamedSlot(slots, "icon");
  });

  const showFooterSlot = computed(() => {
    return hasNamedSlot(slots, "footer");
  });

  const showActionSlot = computed(() => {
    return hasNamedSlot(slots, "action");
  });

  const showHeaderSlot = computed(() => {
    return hasNamedSlot(slots, "header");
  });

  const iconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.icon,
      cn(
        "w-5 h-5 shrink-0",
        palette.value.iconColor,
        get(mergedClasses.value, "icon"),
      ),
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      partsProps.value?.title,
      cn(
        "text-start text-sm whitespace-normal",
        hasDefaultBody.value ? "font-semibold" : "font-normal",
        palette.value.text,
        get(mergedClasses.value, "title"),
      ),
    );
  });

  const bodyBind = computed(() => {
    return mergePartBind(
      partsProps.value?.body,
      cn(
        "grow text-sm text-start",
        palette.value.text,
        get(mergedPaddingMap.value, merged.value.padding ?? "none"),
        get(mergedClasses.value, "body"),
      ),
    );
  });

  return {
    slots,
    merged,
    bodyBind,
    iconBind,
    rootBind,
    showIcon,
    titleBind,
    rootClasses,
    resolvedIcon,
    showIconSlot,
    showTitleRow,
    hasDefaultBody,
    showActionSlot,
    showFooterSlot,
    showHeaderSlot,
  };
}
