// ** External Imports
import { get, isEmpty, isNil, omit } from "es-toolkit/compat";
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
} from "@bridge-ui/core/Tokens/Avatar";

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
  "customProps",
] as const satisfies readonly (keyof AvatarOwnProps)[];

type AvatarLibDefaults = LibDefaultsShape<
  AvatarOwnProps,
  "size" | "color" | "rounded"
>;

type AvatarMerged = MergeLibDefaults<AvatarOwnProps, AvatarLibDefaults>;

export function useAvatar(props: AvatarProps, libDefaults: AvatarLibDefaults) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
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
    props: componentProps,
    componentName: "Avatar",
  });

  const children = derived(() => {
    return props.children;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<AvatarClasses>({
    entry: bridgeAvatar,
    props: componentProps,
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
    return merged.icon ?? "user";
  });

  const showFallbackSurface = derived(() => {
    return !hasImage && !hasCustomContent;
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeAvatar?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeAvatar?.tokens?.size]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeAvatar?.tokens?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeAvatar?.tokens?.color]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeAvatar?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeAvatar?.tokens?.rounded]);

  const iconSizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      iconSizeProps,
      bridgeAvatar?.tokens?.iconSize,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeAvatar?.tokens?.iconSize]);

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "inline-flex shrink-0 items-center justify-center overflow-hidden": true,
        [mergedClasses.root ?? ""]: true,
        [roundedClass ?? ""]: true,
        [sizeClass ?? ""]: showFallbackSurface || hasCustomContent || hasImage,
        [get(colorClass, "background") ?? ""]: showFallbackSurface,
        [get(colorClass, "text") ?? ""]: showFallbackSurface,
      }),
    );
  });

  const imageBind = derived(() => {
    return mergePartBind(
      customProps?.image,
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
      customProps?.fallback,
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
      customProps?.icon,
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
