// ** External Imports
import { get, isNull } from "es-toolkit/compat";
import type { LucideIcon } from "lucide-vue-next";
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
} from "@bridge-ui/core/Components/Alert";

// ** Local Imports
import type { AlertOwnProps, AlertProps } from "@/Components/Alert";
import { alertDefaultIcons } from "@/Components/Alert/alertDefaultIcons";
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
  "customProps",
] as const satisfies readonly (keyof AlertOwnProps)[];

type AlertLibDefaults = LibDefaultsShape<
  AlertOwnProps,
  "color" | "shadow" | "padding" | "rounded" | "variant"
>;

type AlertMerged = MergeLibDefaults<AlertOwnProps, AlertLibDefaults>;

export function useAlert(props: AlertOwnProps, libDefaults: AlertLibDefaults) {
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<AlertProps, typeof alertBridgeKeys>({
      bridgeKeys: alertBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeAlert } = useBridgeUIComponent<
    AlertMerged,
    "Alert"
  >({
    libDefaults,
    componentName: "Alert",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAlert,
    props: () => split.value.componentProps,
  });

  const hasDefaultBody = computed(() => {
    const content = slots.default?.();

    return Boolean(content && content.length > 0);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeAlert.value?.customProps?.variant,
    );

    return get(classes, [merged.value.variant, merged.value.color]);
  });

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

  const resolvedIcon = computed(() => {
    if (isNull(merged.value.icon)) {
      return null;
    }

    if (merged.value.icon) {
      return merged.value.icon;
    }

    const themeIcon = get(colorClass.value, "icon") as LucideIcon | undefined;

    return themeIcon ?? get(alertDefaultIcons, merged.value.color);
  });

  const bodyBind = computed(() => {
    return mergePartBind(
      customProps.value?.body,
      {},
      cn({
        "grow text-sm text-start": true,
        [paddingClass.value ?? ""]: true,
        [get(colorClass.value, "text") ?? ""]: true,
        [get(mergedClasses.value, "body") ?? ""]: true,
      }),
    );
  });

  const iconBind = computed(() => {
    return mergePartBind(
      customProps.value?.icon,
      {},
      cn({
        "w-5 h-5 shrink-0": true,
        [get(colorClass.value, "iconColor") ?? ""]: true,
        [get(mergedClasses.value, "icon") ?? ""]: true,
      }),
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      split.value.inheritedAttrs,
      cn({
        "w-full flex flex-col p-4": true,
        [shadowClass.value ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [get(colorClass.value, "border") ?? ""]: true,
        [get(colorClass.value, "background") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      cn({
        "text-start text-sm whitespace-normal": true,
        "font-normal": !hasDefaultBody.value,
        "font-semibold": hasDefaultBody.value,
        [get(colorClass.value, "text") ?? ""]: true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    );
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
