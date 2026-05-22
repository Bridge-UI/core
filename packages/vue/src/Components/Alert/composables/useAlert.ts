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
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  paddingProps,
  roundedProps,
  shadowProps,
  variantProps,
  type AlertColor,
} from "@bridge-ui/core/Components/Alert";

// ** Local Imports
import type { AlertOwnProps, AlertProps } from "@/Components/Alert";
import {
  mergePartBind,
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

type AlertLibDefaults = LibDefaultsShape<
  AlertOwnProps,
  "color" | "shadow" | "padding" | "rounded" | "variant"
>;

type AlertMerged = MergeLibDefaults<AlertOwnProps, AlertLibDefaults>;

export function useAlert(props: AlertProps, libDefaults: AlertLibDefaults) {
  // Setup
  const attrs = useAttrs();
  const slots = useSlots();

  const { customProps, inheritedAttrs } = splitComponentProps<
    AlertProps,
    typeof alertBridgeKeys
  >({
    bridgeKeys: alertBridgeKeys,
    props: { ...attrs, ...props },
  });

  const { merged, entry: bridgeAlert } = useBridgeUIComponent<
    AlertMerged,
    "Alert"
  >({
    libDefaults,
    props: customProps,
    componentName: "Alert",
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAlert,
    props: customProps,
  });

  // Classes
  const shadowClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgeAlert.value?.customProps?.shadow,
    );

    return get(classes, merged.value.shadow);
  });

  const paddingClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      paddingProps,
      bridgeAlert.value?.customProps?.padding,
    );

    return get(classes, merged.value.padding);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeAlert.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeAlert.value?.customProps?.variant,
    );

    return get(classes, [merged.value.variant, merged.value.color]);
  });

  const resolvedIcon = computed(() => {
    if (isNull(merged.value.icon)) {
      return null;
    }

    return merged.value.icon ?? get(defaultIcons, merged.value.color);
  });

  // Visibility
  const hasDefaultBody = computed(() => {
    const content = slots.default?.();

    return Boolean(content && content.length > 0);
  });

  // Binds
  // prettier-ignore
  const rootBind = computed(() => {
    return mergePartBind(partsProps.value?.root, inheritedAttrs, cn({
      // Theme classes
      [shadowClass.value ?? ""]: true,
      [roundedClass.value ?? ""]: true,
      "w-full flex flex-col p-4": true,
      [get(colorClass.value, "border") ?? ""]: true,
      [get(colorClass.value, "background") ?? ""]: true,
      // Custom classes
      [get(mergedClasses.value, "root") ?? ""]: true,
    }));
  });

  // prettier-ignore
  const bodyBind = computed(() => {
    return mergePartBind( partsProps.value?.body, {}, cn({
      // Theme classes
      "grow text-sm text-start": true,
      [paddingClass.value ?? ""]: true,
      [get(colorClass.value, "text") ?? ""]: true,
      // Custom classes
      [get(mergedClasses.value, "body") ?? ""]: true,
    }));
  });

  // prettier-ignore
  const iconBind = computed(() => {
    return mergePartBind(partsProps.value?.icon, {}, cn({
      // Theme classes
      "w-5 h-5 shrink-0": true,
      [get(colorClass.value, "icon") ?? ""]: true,
      // Custom classes
      [get(mergedClasses.value, "icon") ?? ""]: true,
    }));
  });

  // prettier-ignore
  const titleBind = computed(() => {
    return mergePartBind(partsProps.value?.title, {}, cn({
      // Theme classes
      "font-normal": !hasDefaultBody.value,
      "font-semibold": hasDefaultBody.value,
      [get(colorClass.value, "text") ?? ""]: true,
      "text-start text-sm whitespace-normal": true,
      // Custom classes
      [get(mergedClasses.value, "title") ?? ""]: true,
    }));
  });

  return {
    slots,
    merged,
    bodyBind,
    iconBind,
    rootBind,
    titleBind,
    resolvedIcon,
    hasDefaultBody,
  };
}
