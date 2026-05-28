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
  "partsProps",
] as const satisfies readonly (keyof AlertOwnProps)[];

type AlertLibDefaults = LibDefaultsShape<
  AlertOwnProps,
  "color" | "shadow" | "padding" | "rounded" | "variant"
>;

type AlertMerged = MergeLibDefaults<AlertOwnProps, AlertLibDefaults>;

export function useAlert(props: AlertProps, libDefaults: AlertLibDefaults) {
  // Setup
  const { customProps, inheritedAttrs } = splitComponentProps<
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
    props: customProps,
    componentName: "Alert",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeAlert,
    props: customProps,
  });

  // Elements
  const hasDefaultBody = derived(() => {
    return Boolean(children);
  });

  // Classes
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

  // Binds
  // prettier-ignore
  const bodyBind = derived(() => {
    return mergePartBind(partsProps?.body, {}, cn({
      // Theme classes
      [paddingClass ?? ""]: true,
      "grow text-sm text-start": true,
      [get(colorClass, "text") ?? ""]: true,
      // Custom classes
      [get(mergedClasses, "body") ?? ""]: true,
    }));
  });

  // prettier-ignore
  const iconBind = derived(() => {
    return mergePartBind(partsProps?.icon, {}, cn({
      // Theme classes
      "w-5 h-5 shrink-0": true,
      [get(colorClass, "iconColor") ?? ""]: true,
      // Custom classes
      [get(mergedClasses, "icon") ?? ""]: true,
    }));
  });

  // prettier-ignore
  const rootBind = derived(() => {
    return mergePartBind(partsProps?.root, rootInheritedAttrs, cn({
      // Theme classes
      [shadowClass ?? ""]: true,
      [roundedClass ?? ""]: true,
      "w-full flex flex-col p-4": true,
      [get(colorClass, "border") ?? ""]: true,
      [get(colorClass, "background") ?? ""]: true,
      // Custom classes
      [get(mergedClasses, "root") ?? ""]: true,
    }));
  });

  // prettier-ignore
  const titleBind = derived(() => {
    return mergePartBind(partsProps?.title, {}, cn({
      // Theme classes
      "font-normal": !hasDefaultBody,
      "font-semibold": hasDefaultBody,
      [get(colorClass, "text") ?? ""]: true,
      "text-start text-sm whitespace-normal": true,
      // Custom classes
      [get(mergedClasses, "title") ?? ""]: true,
    }));
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
