// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import {
  miniSizeProps,
  roundedProps,
  variantProps,
  type ButtonColorItem,
} from "@bridge-ui/core/Components/Button";
import type { IconSize } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import type {
  MiniButtonClasses,
  MiniButtonOwnProps,
  MiniButtonProps,
} from "@/Components/MiniButton/miniButton.types";
import {
  mergeBridgeUIStringMap,
  mergePartBind,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const miniButtonBridgeKeys = [
  "as",
  "icon",
  "href",
  "size",
  "color",
  "classes",
  "loading",
  "rounded",
  "variant",
  "disabled",
  "partsProps",
] as const satisfies readonly (keyof MiniButtonOwnProps)[];

export function useMiniButton(
  props: MiniButtonProps,
  libDefaults: Partial<MiniButtonOwnProps>,
) {
  // Setup
  const { className, children, propsForMerge, rootHtmlProps } =
    splitComponentProps(props, {
      bridgeKeys: miniButtonBridgeKeys,
      peel: ["className", "children"],
    });

  const { entry: bridgeMiniButton, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "MiniButton",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<MiniButtonClasses>({
    entry: bridgeMiniButton,
    props: propsForMerge,
  });

  // Registry maps
  const mergedRoundedMap = useMemo(() => {
    return roundedProps;
  }, []);

  const mergedVariantMap = useMemo(() => {
    return variantProps;
  }, []);

  const mergedSizeMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: miniSizeProps,
      provider: bridgeMiniButton?.customProps?.size,
    });
  }, [bridgeMiniButton?.customProps?.size]);

  // Theme
  const colorItem = get(mergedVariantMap, [
    merged.variant ?? "flat",
    merged.color ?? "primary",
  ]) as ButtonColorItem | undefined;

  const iconSize = (merged.size ?? "md") as keyof IconSize;

  const colorClasses = cn(colorItem?.base, colorItem?.hover, colorItem?.focus);

  // Element
  const tag = merged.as ?? "button";

  const isButton = tag === "button";

  const isAnchor = tag === "a";

  const isDisabled = merged.disabled || merged.loading;

  // Root
  const rootClass = cn(
    "inline-flex shrink-0 items-center justify-center cursor-pointer outline-none outline-hidden",
    "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
    "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
    "transition-all ease-in-out duration-200 focus:ring-2",
    "disabled:opacity-80 disabled:cursor-not-allowed",
    colorClasses,
    get(mergedRoundedMap, merged.rounded ?? "md"),
    get(mergedSizeMap, merged.size ?? "md"),
    mergedClasses.root,
    className,
  );

  // Visibility
  const showSpinner = merged.loading;

  const showIcon = !merged.loading && Boolean(merged.icon);

  const hasChildren = children != null && children !== false;

  const showDefault = !merged.loading && hasChildren && !merged.icon;

  // Parts
  const partsProps = merged.partsProps;

  const iconBind = mergePartBind(
    partsProps?.icon,
    cn("shrink-0", mergedClasses.icon),
  );

  const loadingIconBind = mergePartBind(
    partsProps?.loading,
    cn("shrink-0 animate-spin", mergedClasses.loading),
  );

  return {
    tag,
    merged,
    children,
    iconBind,
    iconSize,
    isAnchor,
    isButton,
    showIcon,
    rootClass,
    isDisabled,
    showDefault,
    showSpinner,
    rootHtmlProps,
    loadingIconBind,
    spinnerIcon: Loader2,
  };
}
