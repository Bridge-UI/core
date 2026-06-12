// ** External Imports
import { get, isEmpty, isNil } from "es-toolkit/compat";
import { User } from "lucide-vue-next";
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
  colorProps,
  iconSizeProps,
  roundedProps,
  sizeProps,
} from "@bridge-ui/core/Components/Avatar";

// ** Local Imports
import type {
  AvatarClasses,
  AvatarProps,
} from "@/Components/Avatar/avatar.types";
import {
  hasNamedSlot,
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
] as const satisfies readonly (keyof AvatarProps)[];

type AvatarLibDefaults = LibDefaultsShape<
  AvatarProps,
  "size" | "color" | "rounded"
>;

type AvatarMerged = MergeLibDefaults<AvatarProps, AvatarLibDefaults>;

export function useAvatar(props: AvatarProps, libDefaults: AvatarLibDefaults) {
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<AvatarProps, typeof avatarBridgeKeys>({
      bridgeKeys: avatarBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeAvatar } = useBridgeUIComponent<
    AvatarMerged,
    "Avatar"
  >({
    libDefaults,
    componentName: "Avatar",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<AvatarClasses>({
    entry: bridgeAvatar,
    props: () => split.value.componentProps,
  });

  const hasCustomContent = computed(() => {
    return hasNamedSlot(slots, "default");
  });

  const hasImage = computed(() => {
    return !isNil(merged.value.src) && !isEmpty(merged.value.src);
  });

  const hasFallbackSlot = computed(() => {
    return hasNamedSlot(slots, "fallback");
  });

  const hasFallbackText = computed(() => {
    return !isNil(merged.value.fallback) && !isEmpty(merged.value.fallback);
  });

  const resolvedIcon = computed(() => {
    return merged.value.icon ?? User;
  });

  const showFallbackSurface = computed(() => {
    return !hasImage.value && !hasCustomContent.value;
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeAvatar.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeAvatar.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeAvatar.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const iconSizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      iconSizeProps,
      bridgeAvatar.value?.customProps?.iconSize,
    );

    return get(classes, merged.value.size);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      split.value.inheritedAttrs,
      cn({
        "inline-flex shrink-0 items-center justify-center overflow-hidden": true,
        [mergedClasses.value.root ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [sizeClass.value ?? ""]:
          showFallbackSurface.value || hasCustomContent.value || hasImage.value,
        [get(colorClass.value, "background") ?? ""]: showFallbackSurface.value,
        [get(colorClass.value, "text") ?? ""]: showFallbackSurface.value,
      }),
    );
  });

  const imageBind = computed(() => {
    return mergePartBind(
      {},
      {
        alt: merged.value.alt,
        src: merged.value.src,
      },
      cn({
        "shrink-0 object-cover object-center": true,
        [sizeClass.value ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.image ?? ""]: true,
      }),
    );
  });

  const fallbackBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "font-medium": true,
        [get(iconSizeClass.value, "label") ?? ""]: true,
        [get(colorClass.value, "text") ?? ""]: true,
        [mergedClasses.value.fallback ?? ""]: true,
      }),
    );
  });

  const iconBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "shrink-0": true,
        [get(iconSizeClass.value, "icon") ?? ""]: true,
        [get(colorClass.value, "text") ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
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
