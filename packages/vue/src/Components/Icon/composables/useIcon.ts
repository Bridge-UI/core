// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  cn,
  LibDefaultsShape,
  mergeBridgeUILayeredClasses,
  MergeLibDefaults,
  splitComponentProps,
} from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import type { IconOwnProps, IconProps } from "@/Components/Icon/icon.types";
import { mergePartBind, useBridgeUIComponent } from "@/Utils";

const iconBridgeKeys = [
  "icon",
  "size",
] as const satisfies readonly (keyof IconOwnProps)[];

type IconLibDefaults = LibDefaultsShape<IconOwnProps, "size">;

type IconMerged = MergeLibDefaults<IconOwnProps, IconLibDefaults>;

export function useIcon(props: IconOwnProps, libDefaults: IconLibDefaults) {
  // Setup
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
    props: () => split.value.customProps,
  });

  // Classes
  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeIcon.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  // Binds
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
  };
}
