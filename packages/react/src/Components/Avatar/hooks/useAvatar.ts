// ** External Imports
import { get, isEmpty, isNil, omit } from "es-toolkit/compat";
import { User } from "lucide-react";
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
  colorProps,
  iconSizeProps,
  roundedProps,
  sizeProps,
} from "@bridge-ui/core/Components/Avatar";

// ** Local Imports
import type {
  AvatarClasses,
  AvatarOwnProps,
  AvatarProps,
} from "@/Components/Avatar/avatar.types";
import {
  derived,
  hasNamedSlot,
  isPropPresent,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const avatarBridgeKeys = [
  "alt",
  "src",
  "icon",
  "size",
  "color",
  "classes",
  "rounded",
  "fallback",
] as const satisfies readonly (keyof AvatarOwnProps)[];

type AvatarLibDefaults = LibDefaultsShape<
  AvatarOwnProps,
  "size" | "color" | "rounded"
>;

type AvatarMerged = MergeLibDefaults<AvatarOwnProps, AvatarLibDefaults>;

export function useAvatar(props: AvatarProps, libDefaults: AvatarLibDefaults) {
  const { customProps, inheritedAttrs } = splitComponentProps<
    AvatarProps,
    typeof avatarBridgeKeys
  >({
    props,
    bridgeKeys: avatarBridgeKeys,
  });

  const { merged, entry: bridgeAvatar } = useBridgeUIComponent<
    AvatarMerged,
    "Avatar"
  >({
    libDefaults,
    props: customProps,
    componentName: "Avatar",
  });

  const children = derived(() => {
    return props.children;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<AvatarClasses>({
    props: customProps,
    entry: bridgeAvatar,
  });

  const hasCustomContent = derived(() => {
    return isPropPresent(children);
  });

  const hasImage = derived(() => {
    return !isNil(merged.src) && !isEmpty(merged.src);
  });

  const hasFallbackSlot = derived(() => {
    return hasNamedSlot(slots, "fallback");
  });

  const hasFallbackText = derived(() => {
    return isPropPresent(merged.fallback);
  });

  const resolvedIcon = derived(() => {
    return merged.icon ?? User;
  });

  const showFallbackSurface = derived(() => {
    return !hasImage && !hasCustomContent;
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeAvatar?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeAvatar?.customProps?.size]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeAvatar?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeAvatar?.customProps?.color]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeAvatar?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeAvatar?.customProps?.rounded]);

  const iconSizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      iconSizeProps,
      bridgeAvatar?.customProps?.iconSize,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeAvatar?.customProps?.iconSize]);

  const rootBind = derived(() => {
    return mergePartBind(
      {},
      rootInheritedAttrs,
      cn({
        "inline-flex shrink-0 items-center justify-center overflow-hidden": true,
        [mergedClasses.root ?? ""]: true,
        [roundedClass ?? ""]: true,
        [sizeClass ?? ""]: showFallbackSurface || hasCustomContent,
        [get(colorClass, "background") ?? ""]: showFallbackSurface,
        [get(colorClass, "text") ?? ""]: showFallbackSurface,
      }),
    );
  });

  const imageBind = derived(() => {
    return mergePartBind(
      {},
      {
        alt: merged.alt,
        src: merged.src,
      },
      cn({
        "shrink-0 object-cover object-center": true,
        [sizeClass ?? ""]: true,
        [roundedClass ?? ""]: true,
        [mergedClasses.image ?? ""]: true,
      }),
    );
  });

  const fallbackBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "font-medium": true,
        [get(iconSizeClass, "label") ?? ""]: true,
        [get(colorClass, "text") ?? ""]: true,
        [mergedClasses.fallback ?? ""]: true,
      }),
    );
  });

  const iconBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "shrink-0": true,
        [get(iconSizeClass, "icon") ?? ""]: true,
        [get(colorClass, "text") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    children,
    rootBind,
    iconBind,
    hasImage,
    imageBind,
    fallbackBind,
    resolvedIcon,
    hasFallbackSlot,
    hasFallbackText,
    hasCustomContent,
  };
}
