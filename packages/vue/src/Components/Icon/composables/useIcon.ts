// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import { resolveIconSource } from "@bridge-ui/core/Adapters";
import { iconSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconElement } from "@/Adapters/Icon";
import { useIconAdapter } from "@/Adapters/Icon";
import type { IconOwnProps, IconProps } from "@/Components/Icon/icon.types";
import { mergePartBind, useBridgeUIComponent } from "@/Utils";

const iconBridgeKeys = [
  "icon",
  "size",
] as const satisfies readonly (keyof IconOwnProps)[];

type IconLibDefaults = LibDefaultsShape<IconOwnProps, "size">;

type IconMerged = MergeLibDefaults<IconOwnProps, IconLibDefaults>;

export function useIcon(props: IconOwnProps, libDefaults: IconLibDefaults) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<IconProps, typeof iconBridgeKeys>({
      bridgeKeys: iconBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeIcon } = useBridgeUIComponent<
    IconMerged,
    "Icon"
  >({
    libDefaults,
    componentName: "Icon",
    props: () => split.value.componentProps,
  });

  const iconAdapter = useIconAdapter();

  const resolvedIcon = computed(() => {
    return resolveIconSource<IconElement>(merged.value.icon, iconAdapter.value);
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeIcon.value?.tokens?.size,
    );

    return get(classes, merged.value.size);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      split.value.inheritedAttrs,
      cn({
        [sizeClass.value ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
    resolvedIcon,
  };
}
