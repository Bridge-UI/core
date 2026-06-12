// ** External Imports
import { get, isNull, omit } from "es-toolkit/compat";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";

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
import type { AlertOwnProps, AlertProps } from "@/Components/Alert/alert.types";
import { alertDefaultIcons } from "@/Components/Alert/alertDefaultIcons";
import {
  derived,
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

export function useAlert(props: AlertProps, libDefaults: AlertLibDefaults) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    AlertProps,
    typeof alertBridgeKeys
  >({
    props: props,
    bridgeKeys: alertBridgeKeys,
  });

  const { merged, entry: bridgeAlert } = useBridgeUIComponent<
    AlertMerged,
    "Alert"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Alert",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAlert,
    props: componentProps,
  });

  const hasDefaultBody = derived(() => {
    return Boolean(children);
  });

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeAlert?.customProps?.variant,
    );

    return get(classes, [merged.variant, merged.color]);
  }, [merged.color, merged.variant, bridgeAlert?.customProps?.variant]);

  const shadowClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      shadowProps,
      bridgeAlert?.customProps?.shadow,
    );

    return get(classes, merged.shadow);
  }, [merged.shadow, bridgeAlert?.customProps?.shadow]);

  const paddingClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      paddingProps,
      bridgeAlert?.customProps?.padding,
    );

    return get(classes, merged.padding);
  }, [merged.padding, bridgeAlert?.customProps?.padding]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeAlert?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeAlert?.customProps?.rounded]);

  const resolvedIcon = useMemo(() => {
    if (isNull(merged.icon)) {
      return null;
    }

    if (merged.icon) {
      return merged.icon;
    }

    const themeIcon = get(colorClass, "icon") as LucideIcon | undefined;

    return themeIcon ?? get(alertDefaultIcons, merged.color);
  }, [merged.icon, merged.color, colorClass]);

  const bodyBind = derived(() => {
    return mergePartBind(
      customProps?.body,
      {},
      cn({
        "grow text-sm text-start": true,
        [paddingClass ?? ""]: true,
        [get(colorClass, "text") ?? ""]: true,
        [get(mergedClasses, "body") ?? ""]: true,
      }),
    );
  });

  const iconBind = derived(() => {
    return mergePartBind(
      customProps?.icon,
      {},
      cn({
        "w-5 h-5 shrink-0": true,
        [get(colorClass, "iconColor") ?? ""]: true,
        [get(mergedClasses, "icon") ?? ""]: true,
      }),
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "w-full flex flex-col p-4": true,
        [shadowClass ?? ""]: true,
        [roundedClass ?? ""]: true,
        [get(colorClass, "border") ?? ""]: true,
        [get(colorClass, "background") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    );
  });

  const titleBind = derived(() => {
    return mergePartBind(
      customProps?.title,
      {},
      cn({
        "text-start text-sm whitespace-normal": true,
        "font-normal": !hasDefaultBody,
        "font-semibold": hasDefaultBody,
        [get(colorClass, "text") ?? ""]: true,
        [get(mergedClasses, "title") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    bodyBind,
    children,
    iconBind,
    rootBind,
    titleBind,
    resolvedIcon,
    hasDefaultBody,
  };
}
