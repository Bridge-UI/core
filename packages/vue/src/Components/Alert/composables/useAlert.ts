// ** External Imports
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
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { get, isNull } from "es-toolkit/compat";

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

  // Registry maps
  const shadowMap = computed(() => {
    return get(shadowProps, merged.value.shadow);
  });

  const paddingMap = computed(() => {
    return get(paddingProps, merged.value.padding);
  });

  const roundedMap = computed(() => {
    return get(roundedProps, merged.value.rounded);
  });

  const colorMap = computed(() => {
    return get(variantProps, [merged.value.variant, merged.value.color]);
  });

  const resolvedIcon = computed(() => {
    if (isNull(merged.value.icon)) {
      return null;
    }

    return merged.value.icon ?? get(defaultIcons, merged.value.color);
  });

  // Visibility
  const hasDefaultBody = computed(() => {
    return hasNamedSlot(slots, "default");
  });

  // Binds
  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      inheritedAttrs,
      cn({
        "w-full flex flex-col p-4": true,
        [get(colorMap.value, "border") ?? ""]: true,
        [get(colorMap.value, "background") ?? ""]: true,
        [shadowMap.value]: true,
        [roundedMap.value]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  // prettier-ignore
  const bodyBind = computed(() => {
    return mergePartBind( partsProps.value?.body, {}, cn({
      "grow text-sm text-start": true,
      [get(mergedClasses.value, "body") ?? ""]: true,
      [get(colorMap.value, "text") ?? ""]: true,
      [paddingMap.value]: true,
    }));
  });

  // prettier-ignore
  const iconBind = computed(() => {
    return mergePartBind(partsProps.value?.icon, {}, cn({
      "w-5 h-5 shrink-0": true,
      [get(colorMap.value, "icon") ?? ""]: true,
      [get(mergedClasses.value, "icon") ?? ""]: true,
    }));
  });

  // prettier-ignore
  const titleBind = computed(() => {
    return mergePartBind(partsProps.value?.title, {}, cn({
      "text-start text-sm whitespace-normal": true,
      [hasDefaultBody.value ? "font-semibold" : "font-normal"]: true,
      [get(colorMap.value, "text") ?? ""]: true,
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
  };
}
